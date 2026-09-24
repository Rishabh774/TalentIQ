import Notification from "../models/Notification.js";

// create an in-app notification; never throws (best-effort)
export async function createNotification({ user, type, title, message = "", link = "" }) {
  try {
    return await Notification.create({ user, type, title, message, link });
  } catch (error) {
    console.log("Failed to create notification:", error.message);
    return null;
  }
}
