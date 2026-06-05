import GameState from "../models/GameState.js";
import Studio from "../models/Studio.js";
import {
  calculateDirectorCompensation,
  calculateDirectorFanLoss,
  calculateDirectorReplacementPenalty,
} from "../services/director/directorContractService.js";
import { generateDirectors } from "../services/director/directorGenerator.js";
import { buildDirectorProfile } from "../services/director/directorProfileService.js";
import { presentDirectors } from "../services/director/directorPresenter.js";

const findGameState = async (userId) => GameState.findOne({ user: userId });

const getDirectorProgress = (project, currentWeek) => {
  const existingProgress = Number(project.progress || 0);
  const totalDuration = Math.max(
    1,
    Number(project.completionWeek || currentWeek) -
      Number(project.startWeek || currentWeek)
  );
  const elapsedWeeks = Math.max(0, currentWeek - Number(project.startWeek || currentWeek));
  const calculatedProgress = Math.min(
    100,
    Math.floor((elapsedWeeks / totalDuration) * 100)
  );

  return Math.max(existingProgress, calculatedProgress);
};

const findActiveDirectorProject = (gameState, directorId, projectId = null) => {
  const projects = gameState.activeDirectorProjects || [];

  if (projectId) {
    return projects.find(
      (project) => project.id === projectId && project.directorId === directorId
    );
  }

  return projects.find((project) => project.directorId === directorId);
};

export const getMarketDirectors = async (req, res) => {
  try {
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    if (!gameState.marketDirectors || gameState.marketDirectors.length === 0) {
      gameState.marketDirectors = generateDirectors(100);
      await gameState.save();
    }

    res.status(200).json({
      success: true,
      directors: presentDirectors(gameState.marketDirectors),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnedDirectors = async (req, res) => {
  try {
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    res.status(200).json({
      success: true,
      directors: presentDirectors(gameState.ownedDirectors || []),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getDirectorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    const director =
      gameState.ownedDirectors?.find((candidate) => candidate.id === id) ||
      gameState.marketDirectors?.find((candidate) => candidate.id === id) ||
      gameState.retiredDirectors?.find((candidate) => candidate.id === id);

    if (!director) {
      return res.status(404).json({
        success: false,
        message: "Director not found",
      });
    }

    res.status(200).json({
      success: true,
      profile: buildDirectorProfile(director, gameState.currentWeek),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const hireDirector = async (req, res) => {
  try {
    const { index } = req.params;
    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    const marketDirector = gameState.marketDirectors[index];

    if (!marketDirector) {
      return res.status(404).json({
        success: false,
        message: "Director not found",
      });
    }

    const director = marketDirector.toObject
      ? marketDirector.toObject()
      : { ...marketDirector };

    if (director.status === "RETIRED") {
      return res.status(400).json({
        success: false,
        message: "Retired directors cannot be hired",
      });
    }

    director.status = "AVAILABLE";
    director.hiredAt = new Date();

    gameState.marketDirectors.splice(index, 1);
    gameState.ownedDirectors.push(director);

    gameState.notifications.push({
      message: `${director.name} was hired as a director.`,
    });

    await gameState.save();

    res.status(200).json({
      success: true,
      message: "Director hired",
      director,
      marketDirectors: presentDirectors(gameState.marketDirectors),
      ownedDirectors: presentDirectors(gameState.ownedDirectors),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fireDirector = async (req, res) => {
  try {
    const { index } = req.params;
    const gameState = await findGameState(req.user._id);
    const studio = await Studio.findOne({ owner: req.user._id });

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found",
      });
    }

    const ownedDirector = gameState.ownedDirectors[index];

    if (!ownedDirector) {
      return res.status(404).json({
        success: false,
        message: "Director not found",
      });
    }

    const activeProject = findActiveDirectorProject(gameState, ownedDirector.id);

    if (ownedDirector.status !== "AVAILABLE" || activeProject) {
      return res.status(400).json({
        success: false,
        message:
          "Director is assigned to an active production. Replace the director before firing.",
      });
    }

    const director = ownedDirector.toObject
      ? ownedDirector.toObject()
      : { ...ownedDirector };

    const compensation = calculateDirectorCompensation(director);
    const fanLoss = calculateDirectorFanLoss(director);

    studio.money = Math.max(0, Number(studio.money || 0) - compensation);
    studio.fans = Math.max(0, Number(studio.fans || 0) - fanLoss);

    director.status = "AVAILABLE";
    director.busyUntilWeek = null;
    delete director.hiredAt;

    gameState.ownedDirectors.splice(index, 1);
    gameState.marketDirectors.push(director);

    gameState.notifications.push({
      message: `${director.name} was released to the director market. Compensation ₹${compensation.toLocaleString("en-IN")} paid and ${fanLoss} fans lost.`,
    });

    await studio.save();
    await gameState.save();

    res.status(200).json({
      success: true,
      message: "Director released to market",
      director,
      compensation,
      fanLoss,
      remainingMoney: studio.money,
      remainingFans: studio.fans,
      marketDirectors: presentDirectors(gameState.marketDirectors),
      ownedDirectors: presentDirectors(gameState.ownedDirectors),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const replaceDirector = async (req, res) => {
  try {
    const { oldDirectorId, newDirectorId, projectId } = req.body;

    if (!oldDirectorId || !newDirectorId) {
      return res.status(400).json({
        success: false,
        message: "Old director and replacement director are required",
      });
    }

    if (oldDirectorId === newDirectorId) {
      return res.status(400).json({
        success: false,
        message: "Replacement director must be different from current director",
      });
    }

    const gameState = await findGameState(req.user._id);

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    const project = findActiveDirectorProject(gameState, oldDirectorId, projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Active production not found",
      });
    }

    const oldDirector = gameState.ownedDirectors.find(
      (director) => director.id === oldDirectorId
    );
    const newDirector = gameState.ownedDirectors.find(
      (director) => director.id === newDirectorId
    );

    if (!newDirector) {
      return res.status(404).json({
        success: false,
        message: "Replacement director not found",
      });
    }

    if (newDirector.status !== "AVAILABLE") {
      return res.status(400).json({
        success: false,
        message: "Replacement director is already busy",
      });
    }

    const progress = getDirectorProgress(project, gameState.currentWeek);
    const penalty = calculateDirectorReplacementPenalty(progress);

    project.progress = progress;
    project.directorId = newDirector.id;
    project.directorName = newDirector.name;
    project.qualityPenalty = Number(project.qualityPenalty || 0) + penalty;
    project.replacementRequired = false;

    newDirector.status = "DIRECTING";
    newDirector.busyUntilWeek = project.completionWeek;

    if (oldDirector) {
      oldDirector.status = "AVAILABLE";
      oldDirector.busyUntilWeek = null;
    }

    gameState.notifications.push({
      message: `${oldDirector?.name || "A director"} was replaced by ${newDirector.name} on ${project.movieName || "an active production"}. Movie quality -${penalty}.`,
    });

    await gameState.save();

    res.status(200).json({
      success: true,
      message: "Director replaced successfully",
      progress,
      penalty,
      qualityPenalty: project.qualityPenalty,
      project,
      ownedDirectors: presentDirectors(gameState.ownedDirectors),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
