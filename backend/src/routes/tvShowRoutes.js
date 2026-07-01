import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTVShows,
  getTVShowById,
  createTVShow,
} from "../controllers/tvShowController.js";

const router = express.Router();

router.get("/", protect, getTVShows);
router.post("/", protect, createTVShow);
router.get("/:id", protect, getTVShowById);

export default router;
