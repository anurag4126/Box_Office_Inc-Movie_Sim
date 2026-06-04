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

        writer: String,

        writerId: String,

        studio: String,

        studioId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Studio",
        },

        creationDate: Date,

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

        writer: String,

        writerId: String,

        studio: String,

        studioId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Studio",
        },

        creationDate: Date,
      },
    ],

    activeMovies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],

    marketWriters: [
      {
        id: String,

        name: String,

        avatarSeed: String,

        age: Number,

        originality: Number,

        consistency: Number,

        reliability: Number,

        reputation: Number,

        morale: Number,

        salary: Number,

        rarity: String,

        genreExpertise: [String],

        status: {
          type: String,
          default: "AVAILABLE",
        },

        busyUntilWeek: Number,

        contractYears: Number,

        writtenScripts: {
          type: Number,
          default: 0,
        },

        hitScripts: {
          type: Number,
          default: 0,
        },

        flopScripts: {
          type: Number,
          default: 0,
        },

        awards: {
          type: Number,
          default: 0,
        },

        awardsHistory: [
          {
            awardName: String,
            scriptName: String,
            week: Number,
            genre: String,
            reputationGain: Number,
            skillBoosts: {
              originality: Number,
              consistency: Number,
              reliability: Number,
            },
          },
        ],

        totalEarnings: {
          type: Number,
          default: 0,
        },

        salaryHistory: [
          {
            week: Number,
            salary: Number,
            reason: String,
          },
        ],

        careerHistory: [
          {
            scriptName: String,
            studioName: String,
            completionWeek: Number,
            genre: String,
            scriptQuality: Number,
          },
        ],

        discovered: {
          type: Number,
          default: 0,
        },
      },
    ],

    ownedWriters: [
      {
        id: String,

        name: String,

        avatarSeed: String,

        age: Number,

        originality: Number,

        consistency: Number,

        reliability: Number,

        reputation: Number,

        morale: Number,

        salary: Number,

        rarity: String,

        genreExpertise: [String],

        status: {
          type: String,
          default: "AVAILABLE",
        },

        busyUntilWeek: Number,

        contractYears: Number,

        writtenScripts: {
          type: Number,
          default: 0,
        },

        hitScripts: {
          type: Number,
          default: 0,
        },

        flopScripts: {
          type: Number,
          default: 0,
        },

        awards: {
          type: Number,
          default: 0,
        },

        awardsHistory: [
          {
            awardName: String,
            scriptName: String,
            week: Number,
            genre: String,
            reputationGain: Number,
            skillBoosts: {
              originality: Number,
              consistency: Number,
              reliability: Number,
            },
          },
        ],

        totalEarnings: {
          type: Number,
          default: 0,
        },

        salaryHistory: [
          {
            week: Number,
            salary: Number,
            reason: String,
          },
        ],

        careerHistory: [
          {
            scriptName: String,
            studioName: String,
            completionWeek: Number,
            genre: String,
            scriptQuality: Number,
          },
        ],

        discovered: {
          type: Number,
          default: 0,
        },

        hiredAt: Date,
      },
    ],

    marketDirectors: [
      {
        id: String,

        name: String,

        avatarSeed: String,

        age: Number,

        creativity: Number,

        reliability: Number,

        leadership: Number,

        reputation: Number,

        morale: Number,

        salary: Number,

        rarity: String,

        genreExpertise: [String],

        status: {
          type: String,
          default: "AVAILABLE",
        },

        busyUntilWeek: Number,

        contractYears: Number,

        moviesDirected: {
          type: Number,
          default: 0,
        },

        hitMovies: {
          type: Number,
          default: 0,
        },

        flopMovies: {
          type: Number,
          default: 0,
        },

        awards: {
          type: Number,
          default: 0,
        },

        awardsHistory: [
          {
            awardName: String,
            movieName: String,
            week: Number,
            genre: String,
            rating: Number,
            reputationGain: Number,
            skillBoosts: {
              creativity: Number,
              reliability: Number,
              leadership: Number,
            },
          },
        ],

        totalEarnings: {
          type: Number,
          default: 0,
        },

        salaryHistory: [
          {
            week: Number,
            salary: Number,
            reason: String,
          },
        ],

        careerHistory: [
          {
            movieName: String,
            studioName: String,
            releaseWeek: Number,
            genre: String,
            movieRating: Number,
            boxOffice: Number,
            outcome: String,
          },
        ],

        studiosWorkedWith: [String],

        ratings: [Number],

        discovered: {
          type: Number,
          default: 0,
        },
      },
    ],

    ownedDirectors: [
      {
        id: String,

        name: String,

        avatarSeed: String,

        age: Number,

        creativity: Number,

        reliability: Number,

        leadership: Number,

        reputation: Number,

        morale: Number,

        salary: Number,

        rarity: String,

        genreExpertise: [String],

        status: {
          type: String,
          default: "AVAILABLE",
        },

        busyUntilWeek: Number,

        contractYears: Number,

        moviesDirected: {
          type: Number,
          default: 0,
        },

        hitMovies: {
          type: Number,
          default: 0,
        },

        flopMovies: {
          type: Number,
          default: 0,
        },

        awards: {
          type: Number,
          default: 0,
        },

        awardsHistory: [
          {
            awardName: String,
            movieName: String,
            week: Number,
            genre: String,
            rating: Number,
            reputationGain: Number,
            skillBoosts: {
              creativity: Number,
              reliability: Number,
              leadership: Number,
            },
          },
        ],

        totalEarnings: {
          type: Number,
          default: 0,
        },

        salaryHistory: [
          {
            week: Number,
            salary: Number,
            reason: String,
          },
        ],

        careerHistory: [
          {
            movieName: String,
            studioName: String,
            releaseWeek: Number,
            genre: String,
            movieRating: Number,
            boxOffice: Number,
            outcome: String,
          },
        ],

        studiosWorkedWith: [String],

        ratings: [Number],

        discovered: {
          type: Number,
          default: 0,
        },

        hiredAt: Date,
      },
    ],

    retiredDirectors: [mongoose.Schema.Types.Mixed],

    activeDirectorProjects: [
      {
        id: String,

        directorId: String,

        directorName: String,

        movieName: String,

        genre: String,

        startWeek: Number,

        completionWeek: Number,

        progress: Number,

        qualityPenalty: {
          type: Number,
          default: 0,
        },

        replacementRequired: {
          type: Boolean,
          default: false,
        },

        status: {
          type: String,
          default: "DIRECTING",
        },
      },
    ],

    activeWritingProjects: [
      {
        id: String,

        writerId: String,

        writerName: String,

        genre: String,

        targetAudience: String,

        startWeek: Number,

        completionWeek: Number,

        progress: Number,

        qualityPenalty: {
          type: Number,
          default: 0,
        },

        replacementRequired: {
          type: Boolean,
          default: false,
        },

        status: {
          type: String,
          default: "WRITING",
        },
      },
    ],

    notifications: [
      {
        type: {
          type: String,
          default: "SYSTEM",
        },

        message: {
          type: String,
          required: true,
        },

        read: {
          type: Boolean,
          default: false,
        },

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
