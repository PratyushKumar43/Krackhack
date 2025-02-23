import mongoose from "mongoose";

const CapsuleSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  date: {
    type: String,
    required: true
  },
  lock: {
    type: Boolean,
    default: false
  },
  description: { 
    type: String, 
    required: true 
  },
  photos: [{ 
    type: String 
  }],
  videos: [{ 
    type: String 
  }],
}, {
  timestamps: true
});

export default mongoose.model("Capsule", CapsuleSchema);