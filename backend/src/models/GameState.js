import mongoose from "mongoose";

const gameStateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    currentWeek: {
      type: Number,
      default: 1,
    },

    ownedScripts: [
      {
        title: String,

        genres: [String],

        quality: Number,

        originality: Number,

        audienceAppeal: Number,

        franchisePotential: Number,

        rarity: String,

        price: Number,

        sellPrice: Number,

        purchasedAt: Date,
      },
    ],

    marketScripts: [
      {
        title: String,

        genres: [String],

        quality: Number,

        originality: Number,

        audienceAppeal: Number,

        franchisePotential: Number,

        rarity: String,

        price: Number,
      },
    ],

    activeMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],

    notifications: [
      {
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const GameState = mongoose.model("GameState", gameStateSchema);

export default GameState;
