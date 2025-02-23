import express from "express";
import {
    createCapsule,
    updateCapsule,
    getCapsules,
} from "../controllers/capsuleController.js";
import { authenticate } from "../auth/verifyToken.js";

const router = express.Router();

// Create new capsule (requires authentication)
router.post("/", authenticate, createCapsule);

// Update capsule (requires authentication)
router.patch("/:id", authenticate, updateCapsule);

// Get user's capsules (requires authentication)
router.get("/", authenticate, getCapsules);

export default router;