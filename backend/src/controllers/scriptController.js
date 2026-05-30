import GameState from "../models/GameState.js";
import Studio from "../models/Studio.js";
import { generateScripts } from "../services/script/scriptGenerator.js";

export const generateMarketScripts = async (req, res) => {
  try {
    const gameState = await GameState.findOne({
      user: req.user._id,
    });

    const scripts = generateScripts(5);

    gameState.marketScripts = scripts;

    await gameState.save();

    res.status(200).json({
      success: true,
      scripts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getScripts = async (req, res) => {
  try {
    const gameState = await GameState.findOne({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      scripts: gameState.marketScripts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const buyScript = async (req, res) => {
  try {
    const index = Number(req.params.index);

    const studio = await Studio.findOne({
      owner: req.user._id,
    });

    if (!studio) {
      return res.status(404).json({
        success: false,
        message: "Studio not found",
      });
    }

    const gameState = await GameState.findOne({
      user: req.user._id,
    });

    if (!gameState) {
      return res.status(404).json({
        success: false,
        message: "Game state not found",
      });
    }

    const script = gameState.marketScripts[index];

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Script not found",
      });
    }

    if (studio.money < script.price) {
      return res.status(400).json({
        success: false,
        message: "Not enough money",
      });
    }

    studio.money -= script.price;

    const sellPercentage = Math.floor(Math.random() * 61) + 30;

    const sellPrice = Math.floor(script.price * (sellPercentage / 100));

    gameState.ownedScripts.push({
      title: script.title,
      genres: script.genres,
      quality: script.quality,
      originality: script.originality,
      audienceAppeal: script.audienceAppeal,
      franchisePotential: script.franchisePotential,
      rarity: script.rarity,
      price: script.price,
      sellPrice,
      purchasedAt: new Date(),
    });

    gameState.marketScripts.splice(index, 1);

    await studio.save();
    await gameState.save();

    return res.status(200).json({
      success: true,
      message: "Script purchased",
      money: studio.money,
    });
  } catch (error) {
    console.error("BUY SCRIPT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnedScripts = async (req, res) => {
  try {
    const gameState = await GameState.findOne({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      scripts: gameState.ownedScripts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sellScript = async (req, res) => {
  try {
    const index = Number(req.params.index);

    const studio = await Studio.findOne({
      owner: req.user._id,
    });

    const gameState = await GameState.findOne({
      user: req.user._id,
    });

    const script = gameState.ownedScripts[index];

    if (!script) {
      return res.status(404).json({
        success: false,
        message: "Script not found",
      });
    }

    studio.money += script.sellPrice;

    gameState.ownedScripts.splice(index, 1);

    await studio.save();
    await gameState.save();

    res.status(200).json({
      success: true,
      message: "Script sold",
      money: studio.money,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
