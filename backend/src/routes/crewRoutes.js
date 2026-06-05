import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMarketCrewTeams,
  getOwnedCrewTeams,
  hireCrewTeam,
  fireCrewTeam,
} from "../controllers/crewController.js";

const router = express.Router();

router.get("/", protect, getMarketCrewTeams);
router.get("/owned", protect, getOwnedCrewTeams);
router.post("/hire/:id", protect, hireCrewTeam);
router.post("/fire/:id", protect, fireCrewTeam);

export default router;
