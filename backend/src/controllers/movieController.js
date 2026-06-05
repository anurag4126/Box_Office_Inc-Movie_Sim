import Movie from "../models/Movie.js";
import GameState from "../models/GameState.js";
import Studio from "../models/Studio.js";
import { generateReviews } from "../services/simulation/engines/reviewEngine.js";
import { generateBoxOffice } from "../services/simulation/engines/boxOfficeEngine.js";
import { processCareerImpact } from "../services/simulation/engines/careerImpactEngine.js";
import { processStudioGrowth } from "../services/simulation/engines/studioGrowthEngine.js";
import { addNotification } from "../services/simulation/helpers/notificationHelper.js";
import { MARKETING_CAMPAIGNS } from "../constants/marketingCampaigns.js";

const findGameState = async (userId) => GameState.findOne({ user: userId });

export const createMovie = async (req, res) => {
  try {
    const { title, scriptId, directorId, leadActorId, supportingActorIds, marketingCampaignIds } = req.body;

    if (!title || !scriptId || !directorId || !leadActorId || !req.body.crewTeamId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const gameState = await findGameState(req.user._id);
    const studio = await Studio.findOne({ owner: req.user._id });

    if (!gameState || !studio) {
      return res.status(404).json({ success: false, message: "Game state or studio not found" });
    }

    // Validate Script
    const scriptIndex = gameState.ownedScripts.findIndex(s => s.id === scriptId);
    if (scriptIndex === -1) return res.status(404).json({ success: false, message: "Script not found" });
    const script = gameState.ownedScripts[scriptIndex];
    if (script.status !== "AVAILABLE") return res.status(400).json({ success: false, message: "Script is not available" });

    // Validate Director
    const director = gameState.ownedDirectors.find(d => d.id === directorId);
    if (!director) return res.status(404).json({ success: false, message: "Director not found" });
    if (director.status !== "AVAILABLE") return res.status(400).json({ success: false, message: "Director is busy" });

    // Validate Lead Actor
    const leadActor = gameState.ownedActors.find(a => a.id === leadActorId);
    if (!leadActor) return res.status(404).json({ success: false, message: "Lead actor not found" });
    if (leadActor.status !== "AVAILABLE") return res.status(400).json({ success: false, message: "Lead actor is busy" });

    // Validate Crew Team
    const crewTeam = gameState.ownedCrewTeams.find(c => c.id === req.body.crewTeamId);
    if (!crewTeam) return res.status(404).json({ success: false, message: "Crew team not found" });
    if (crewTeam.status !== "AVAILABLE") return res.status(400).json({ success: false, message: "Crew team is busy" });

    // Calculate Marketing Budget and Hype Boost
    let marketingBudget = 0;
    let marketingHypeBoost = 0;
    const selectedCampaigns = [];

    if (marketingCampaignIds && Array.isArray(marketingCampaignIds)) {
        marketingCampaignIds.forEach(cid => {
            const campaign = MARKETING_CAMPAIGNS.find(c => c.id === cid);
            if (campaign) {
                marketingBudget += campaign.cost;
                marketingHypeBoost += campaign.hypeBoost;
                selectedCampaigns.push(cid);
            }
        });
    }

    // Validate Studio Money for Marketing Budget
    if (studio.money < (marketingBudget || 0)) {
        return res.status(400).json({ success: false, message: "Insufficient funds for marketing" });
    }

    // Formula Implementation
    // quality = Script Quality → 35% + Director Creativity → 25% + Lead Actor Skill → 20% + Crew Technical Quality → 20%
    const quality = Math.round(
      (script.quality * 0.35) +
      (director.creativity * 0.25) +
      (leadActor.actingSkill * 0.20) +
      (crewTeam.technicalQuality * 0.20)
    );

    // Hype = Lead Actor Popularity + Director Reputation + Marketing Budget influence
    const hype = Math.min(100, Math.round(
      (leadActor.popularity * 0.4) +
      (director.reputation * 0.3) +
      marketingHypeBoost
    ));

    const movie = await Movie.create({
      title,
      studioId: studio._id,
      scriptId,
      directorId,
      leadActorId,
      supportingActorIds: supportingActorIds || [],
      crewTeamId: crewTeam.id,
      budget: 0, // Will accumulate or be set
      marketingBudget,
      marketingCampaigns: selectedCampaigns,
      quality,
      hype,
      status: "PRE_PRODUCTION",
      createdWeek: gameState.currentWeek,
      productionProgress: 0
    });

    // Update statuses
    script.status = "SOLD"; // Or a new "IN_PRODUCTION" status
    director.status = "BUSY";
    director.busyUntilWeek = gameState.currentWeek + 20; // Approx
    leadActor.status = "BUSY";
    leadActor.busyUntilWeek = gameState.currentWeek + 20;
    crewTeam.status = "BUSY";
    crewTeam.busyUntilWeek = gameState.currentWeek + 20;

    // Deduct marketing budget
    studio.money -= (marketingBudget || 0);

    gameState.activeMovies.push(movie._id);

    gameState.notifications.push({
        message: `Production started for "${title}". Quality: ${quality}, Hype: ${hype}`,
        createdAt: new Date()
    });

    await studio.save();
    await gameState.save();

    res.status(201).json({ success: true, movie });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveMovies = async (req, res) => {
    try {
        const gameState = await GameState.findOne({ user: req.user._id }).select("activeMovies").lean();
        if (!gameState) return res.status(404).json({ success: false, message: "Game state not found" });

        const movies = await Movie.find({ _id: { $in: gameState.activeMovies } }).lean();
        res.status(200).json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const releaseMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
        if (movie.status !== "READY_FOR_RELEASE") {
            return res.status(400).json({ success: false, message: "Movie is not ready for release" });
        }

        const gameState = await findGameState(req.user._id);
        const studio = await Studio.findOne({ owner: req.user._id });

        // Get all related talent/data for engines
        const script = gameState.marketScripts.find(s => s.id === movie.scriptId) ||
                       gameState.ownedScripts.find(s => s.id === movie.scriptId);

        // Find in owned talent
        const director = gameState.ownedDirectors.find(d => d.id === movie.directorId);
        const leadActor = gameState.ownedActors.find(a => a.id === movie.leadActorId);
        const crewTeam = gameState.ownedCrewTeams.find(c => c.id === movie.crewTeamId);

        // Find Writer (might be in history or owned writers)
        const writer = gameState.ownedWriters.find(w => w.id === script?.writerId);

        // 1. Generate Reviews
        const reviews = generateReviews(movie, script, director, leadActor, crewTeam);
        movie.criticScore = reviews.criticScore;
        movie.criticLabel = reviews.criticLabel;
        movie.audienceScore = reviews.audienceScore;
        movie.audienceLabel = reviews.audienceLabel;

        // 2. Generate Box Office
        const boxOffice = generateBoxOffice(movie, leadActor, director);
        Object.assign(movie, boxOffice);

        // 3. Update Studio Growth (Money handled here, Fans/Prestige inside)
        const growth = processStudioGrowth(gameState, studio, movie);

        // 4. Update Careers
        processCareerImpact(gameState, movie, writer, director, leadActor, crewTeam);

        // 5. Release Talent (Set back to AVAILABLE)
        if (director) {
            director.status = "AVAILABLE";
            director.busyUntilWeek = null;
        }
        if (leadActor) {
            leadActor.status = "AVAILABLE";
            leadActor.busyUntilWeek = null;
        }
        if (crewTeam) {
            crewTeam.status = "AVAILABLE";
            crewTeam.busyUntilWeek = null;
        }
        // Supporting Actors
        if (movie.supportingActorIds && movie.supportingActorIds.length > 0) {
            movie.supportingActorIds.forEach(actorId => {
                const sActor = gameState.ownedActors.find(a => a.id === actorId);
                if (sActor) {
                    sActor.status = "AVAILABLE";
                    sActor.busyUntilWeek = null;
                }
            });
        }

        // 6. Finalize Movie Status
        movie.status = "RELEASED";
        movie.releaseWeek = gameState.currentWeek;

        // Move to history in GameState if needed
        if (!gameState.movieHistory) gameState.movieHistory = [];
        gameState.movieHistory.push(movie._id);

        // Remove from active movies
        gameState.activeMovies = gameState.activeMovies.filter(mId => mId.toString() !== movie._id.toString());

        // Notifications
        addNotification(gameState, `"${movie.title}" released! Critic Score: ${movie.criticScore} (${movie.criticLabel})`);
        addNotification(gameState, `"${movie.title}" earned ₹${movie.worldwideGross.toLocaleString()} worldwide. Verdict: ${movie.verdict}`);

        await movie.save();
        await studio.save();
        await gameState.save();

        res.status(200).json({ success: true, movie, growth });
    } catch (error) {
        console.error("Release Movie Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getReleasedMovies = async (req, res) => {
    try {
        const studio = await Studio.findOne({ owner: req.user._id }).select("_id").lean();
        if (!studio) return res.status(404).json({ success: false, message: "Studio not found" });

        const movies = await Movie.find({ studioId: studio._id, status: "RELEASED" })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ success: true, movies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMovieDetails = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ success: false, message: "Movie not found" });
        res.status(200).json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
