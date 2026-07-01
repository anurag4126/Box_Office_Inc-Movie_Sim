import mongoose from "mongoose";

/**
 * @fileoverview TV Show model.
 *
 * Introduced for issue #41 ("Streaming, TV Shows & Media Expansion") as the
 * studio-owned foundation for Version 2 entertainment systems. A TV show is a
 * first-class production owned by a single studio, mirroring how a {@link Movie}
 * is owned via `studioId`. It deliberately reuses the existing streaming
 * `platformId` convention (the string id of an entry in
 * `GameState.streamingPlatforms`) instead of introducing any parallel platform
 * system, so future V2 features (airing simulation, per-show OTT revenue, etc.)
 * can build on the same architecture.
 *
 * This model is fully additive — nothing in the existing movie production or
 * release flow references it.
 */
const tvShowSchema = new mongoose.Schema(
  {
    // The studio that owns and produced this show.
    studioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Studio",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      default: "Drama",
      trim: true,
    },

    seasons: {
      type: Number,
      default: 1,
      min: 1,
    },

    episodesPerSeason: {
      type: Number,
      default: 8,
      min: 1,
    },

    // Total production budget invested by the studio (₹). Optional — a show can
    // be created with no budget, in which case no funds are deducted.
    budget: {
      type: Number,
      default: 0,
      min: 0,
    },

    // 0–100 quality score. Derived from the production budget on creation so a
    // larger investment yields a better show, consistent with how movie quality
    // scales with budget elsewhere in the game.
    quality: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // OTT performance metric, reserved for future weekly growth simulation.
    popularity: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Optional streaming platform association. Stores the string `id` of an
    // entry in `GameState.streamingPlatforms` (e.g. "flixstream"), reusing the
    // existing embedded platform model rather than a standalone one.
    platformId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["IN_PRODUCTION", "AIRING", "ENDED", "CANCELLED"],
      default: "IN_PRODUCTION",
    },

    // The in-game week the show was commissioned.
    createdWeek: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const TVShow = mongoose.model("TVShow", tvShowSchema);

export default TVShow;
