import mongoose from "mongoose";

const CapsuleSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  title: {
    type: String,
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
  files: [{ 
    type: String 
  }],
}, {
  timestamps: true
});

export default mongoose.model("Capsule", CapsuleSchema);