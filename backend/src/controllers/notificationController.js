import Notification from "../models/Notification.js";

export async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.log("Error in getMyNotifications controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ notification });
  } catch (error) {
    console.log("Error in markAsRead controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function markAllAsRead(req, res) {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.log("Error in markAllAsRead controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
