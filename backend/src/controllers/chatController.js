import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    // use googleId for Stream (not mongodb _id) => it must match the id we registered with Stream
    const token = chatClient.createToken(req.user.googleId);

    res.status(200).json({
      token,
      userId: req.user.googleId,
      userName: req.user.name,
      userImage: req.user.profileImage,
    });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
