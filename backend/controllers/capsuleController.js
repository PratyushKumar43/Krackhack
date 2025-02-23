import Capsule from "../models/CapsuleSchema.js";

// Create new capsule
export const createCapsule = async (req, res) => {
  const { description, photos, videos, date } = req.body;
  
  const userId = req.userId; // Assuming user ID is set by auth middleware

  try {
    const newCapsule = new Capsule({
      user: userId,
      description,
      photos: photos || [],
      videos: videos || [],
      date,
      lock: false
    });

    const savedCapsule = await newCapsule.save();

    res.status(201).json({
      success: true,
      message: "Capsule created successfully",
      data: savedCapsule
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create capsule",
      error: err.message
    });
  }
};

// Update capsule
export const updateCapsule = async (req, res) => {
  const { description, photos, videos } = req.body;
  const capsuleId = req.params.id;
  const userId = req.userId; // Assuming user ID is set by auth middleware

  try {
    const capsule = await Capsule.findById(capsuleId);

    // Check if capsule exists
    if (!capsule) {
      return res.status(404).json({
        success: false,
        message: "Capsule not found"
      });
    }

    // Check if user owns the capsule
    if (capsule.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this capsule"
      });
    }

    // Check if capsule is locked
    if (capsule.lock) {
      return res.status(400).json({
        success: false,
        message: "Cannot update a locked capsule"
      });
    }

    // Update only allowed fields
    const updateCapsule = await Capsule.findByIdAndUpdate(
      capsuleId,
      {
        description: description || capsule.description,
        photos: photos || capsule.photos,
        videos: videos || capsule.videos
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Capsule updated successfully",
      data: updateCapsule
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update capsule",
      error: err.message
    });
  }
};

// Get user's capsules
export const getCapsules = async (req, res) => {
  const userId = req.userId; // Assuming user ID is set by auth middleware

  try {
    const capsules = await Capsule.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("user", "name email"); // Populate user details except password

    res.status(200).json({
      success: true,
      message: "Capsules fetched successfully",
      data: capsules
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch capsules",
      error: err.message
    });
  }
};