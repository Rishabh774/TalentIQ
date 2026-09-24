import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";
import { createNotification } from "../lib/notifications.js";
import { sendEmail, emailTemplates } from "../lib/email.js";

export async function createSession(req, res) {
  try {
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const googleId = req.user.googleId;

    // problem/difficulty are chosen after the session is created, so they're optional here
    const sessionLabel = problem || "Interview Session";

    // generate a unique call id for stream video
    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // create session in db
    const session = await Session.create({
      problem: problem || "",
      difficulty: difficulty || "easy",
      host: userId,
      callId,
    });

    // create stream video call
    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: googleId,
        custom: { problem: problem || "", difficulty: difficulty || "easy", sessionId: session._id.toString() },
      },
    });

    // chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${sessionLabel} Session`,
      created_by_id: googleId,
      members: [googleId],
    });

    await channel.create();

    // notify host (in-app + email)
    await createNotification({
      user: userId,
      type: "interview_update",
      title: "Interview session created",
      message: `Your session is ready. Select a problem to get started.`,
      link: `/session/${session._id}`,
    });

    const tmpl = emailTemplates.interviewCreated(req.user.name, sessionLabel);
    sendEmail({ to: req.user.email, ...tmpl });

    res.status(201).json({ session });
  } catch (error) {
    console.log("Error in createSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateSessionProblem(req, res) {
  try {
    const { id } = req.params;
    const { problem, difficulty } = req.body;
    const userId = req.user._id;

    if (!problem || !difficulty) {
      return res.status(400).json({ message: "Problem and difficulty are required" });
    }

    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can select the problem" });
    }

    session.problem = problem;
    session.difficulty = difficulty;
    await session.save();

    // keep the stream call/channel metadata in sync — the problem is already
    // persisted, so a stream hiccup must not fail the request
    try {
      const call = streamClient.video.call("default", session.callId);
      await call.update({ custom: { problem, difficulty, sessionId: session._id.toString() } });
    } catch (streamError) {
      console.error("Stream call metadata sync failed:", streamError.message);
    }

    if (session.participant) {
      await createNotification({
        user: session.participant,
        type: "interview_update",
        title: "Problem selected for your session",
        message: `The interviewer selected "${problem}" for your session.`,
        link: `/session/${session._id}`,
      });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in updateSessionProblem controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getActiveSessions(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email googleId")
      .populate("participant", "name profileImage email googleId")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getActiveSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    const userId = req.user._id;

    // get sessions where user is either host or participant
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error in getMyRecentSessions controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate("host", "name email profileImage googleId")
      .populate("participant", "name email profileImage googleId");

    if (!session) return res.status(404).json({ message: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in getSessionById controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const googleId = req.user.googleId;

    const session = await Session.findOneAndUpdate(
      {
        _id: id,
        status: "active",
        participant: null,
        host: { $ne: userId },
      },
      { $set: { participant: userId } },
      { new: true }
    );

    if (!session) {
      const existingSession = await Session.findById(id);

      if (!existingSession) return res.status(404).json({ message: "Session not found" });

      if (existingSession.status !== "active") {
        return res.status(400).json({ message: "Cannot join a completed session" });
      }

      if (existingSession.host.toString() === userId.toString()) {
        return res
          .status(400)
          .json({ message: "Host cannot join their own session as participant" });
      }

      if (existingSession.participant?.toString() === userId.toString()) {
        const channel = chatClient.channel("messaging", existingSession.callId);
        await channel.addMembers([googleId]);

        return res.status(200).json({ session: existingSession });
      }

      return res.status(409).json({ message: "Session is full" });
    }

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([googleId]);

    // notify the host that someone joined
    await createNotification({
      user: session.host,
      type: "interview_update",
      title: "Someone joined your session",
      message: `${req.user.name} joined your "${session.problem}" session.`,
      link: `/session/${session._id}`,
    });

    res.status(200).json({ session });
  } catch (error) {
    console.log("Error in joinSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ message: "Session not found" });

    // check if user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the host can end the session" });
    }

    // check if session is already completed
    if (session.status === "completed") {
      return res.status(400).json({ message: "Session is already completed" });
    }

    // delete stream video call
    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    // delete stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    session.status = "completed";
    await session.save();

    res.status(200).json({ session, message: "Session ended successfully" });
  } catch (error) {
    console.log("Error in endSession controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
