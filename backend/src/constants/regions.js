export const REGIONS = {
  NORTH_AMERICA: {
    name: "North America",
    marketShare: 0.40, // 40% of global box office
    genreModifiers: {
      "Action": 1.2,
      "Comedy": 1.1,
      "Drama": 0.9,
      "Sci-Fi": 1.1,
    }
  },
  EUROPE: {
    name: "Europe",
    marketShare: 0.25, // 25% of global box office
    genreModifiers: {
      "Drama": 1.3,
      "Romance": 1.2,
      "Thriller": 1.1,
      "Action": 0.9,
    }
  },
  ASIA: {
    name: "Asia",
    marketShare: 0.25, // 25% of global box office
    genreModifiers: {
      "Action": 1.4,
      "Sci-Fi": 1.3,
      "Fantasy": 1.2,
      "Comedy": 0.8,
    }
  },
  LATIN_AMERICA: {
    name: "Latin America",
    marketShare: 0.05, // 5% of global box office
    genreModifiers: {
      "Action": 1.2,
      "Horror": 1.3,
      "Comedy": 1.1,
    }
  },
  REST_OF_WORLD: {
    name: "Rest of World",
    marketShare: 0.05, // 5% of global box office
    genreModifiers: {}
  }
};
