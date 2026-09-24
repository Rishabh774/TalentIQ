import User from "../models/User.js";
import { createNotification } from "../lib/notifications.js";
import { sendEmail, emailTemplates } from "../lib/email.js";

const ASSIGNABLE_ROLES = ["student", "interviewer"];

export async function getMe(req, res) {
  res.status(200).json({ user: req.user });
}

export async function setMyRole(req, res) {
  try {
    const { role } = req.body;

    if (!ASSIGNABLE_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.user.roleSet) {
      return res.status(400).json({ message: "Role already set" });
    }

    if (role === "interviewer") {
      // interviewer access needs admin approval - grant student role for now,
      // flag the request, and notify admins
      req.user.role = "student";
      req.user.roleSet = true;
      req.user.interviewerRequested = true;
      await req.user.save();

      const admins = await User.find({ role: "admin" });
      await Promise.all(
        admins.map((admin) =>
          createNotification({
            user: admin._id,
            type: "interviewer_request",
            title: "New interviewer request",
            message: `${req.user.name} (${req.user.email}) requested interviewer access.`,
            link: "/admin",
          })
        )
      );

      await createNotification({
        user: req.user._id,
        type: "interviewer_request",
        title: "Interviewer request sent",
        message: "An admin will review and approve you as an interviewer soon.",
        link: "/dashboard",
      });

      const template = emailTemplates.interviewerRequestReceived(req.user.name);
      sendEmail({ to: req.user.email, ...template });

      return res.status(200).json({ user: req.user, pendingApproval: true });
    }

    req.user.role = role;
    req.user.roleSet = true;
    await req.user.save();

    res.status(200).json({ user: req.user });
  } catch (error) {
    console.log("Error in setMyRole controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(200);
    res.status(200).json({ users });
  } catch (error) {
    console.log("Error in listUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["student", "interviewer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const previousUser = await User.findById(id);
    if (!previousUser) return res.status(404).json({ message: "User not found" });

    const user = await User.findByIdAndUpdate(
      id,
      { role, roleSet: true, interviewerRequested: false },
      { new: true }
    );

    if (role === "interviewer" && previousUser.role !== "interviewer") {
      await createNotification({
        user: user._id,
        type: "interviewer_request",
        title: "You're approved as an interviewer!",
        message: "An admin approved your request. You can now host live sessions.",
        link: "/interviewer",
      });

      const template = emailTemplates.interviewerApproved(user.name);
      sendEmail({ to: user.email, ...template });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in updateUserRole controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
