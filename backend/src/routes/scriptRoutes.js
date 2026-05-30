import express from "express";

import {
  generateMarketScripts,
  getScripts,
  buyScript,
  getOwnedScripts,
  sellScript,
} from "../controllers/scriptController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getScripts);

router.post("/generate", protect, generateMarketScripts);
router.post("/buy/:index", protect, buyScript);
router.get("/owned", protect, getOwnedScripts);
router.post("/sell/:index", protect, sellScript);

export default router;
