import NjangiNotification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await NjangiNotification.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate("sender", "lastName", "firstName");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const notification = new NjangiNotification.create({
      recipient: req.body.recipient,
      sender: req.body.sender,
      type: req.body.type,
      content: req.body.content,
      isRead: false,
    });

    const savedNotification = await notification.save();
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all notifications for a specific user
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await NjangiNotification.find({
      recipients: { $in: [req.params.userId] },
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .populate("sender", "lastName", "firstName");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await NjangiNotification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read for a user
export const markAllAsRead = async (req, res) => {
  try {
    await NjangiNotification.updateMany(
      { recipient: req.params.userId, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
  const { notificationId } = req.params;
  try {
    await NjangiNotification.findByIdAndUpdate(notificationId, {
      isDeleted: true,
    });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread notifications count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await NjangiNotification.countDocuments({
      recipient: req.params.userId,
      isRead: false,
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
