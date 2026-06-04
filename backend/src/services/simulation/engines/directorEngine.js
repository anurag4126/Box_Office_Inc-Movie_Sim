import {
  createReplacementDirector,
  retireDirector,
} from "../../director/directorRetirementService.js";

const RETIREMENT_AGE = 90;
const WEEKS_PER_YEAR = 52;

const markRetiredDirectorProjectsForReplacement = (gameState, director) => {
  (gameState.activeDirectorProjects || []).forEach((project) => {
    if (project.directorId !== director.id) {
      return;
    }

    project.replacementRequired = true;
    project.status = "NEEDS_DIRECTOR_REPLACEMENT";
  });
};

const preserveAlreadyRetiredDirector = (gameState, director) => {
  gameState.retiredDirectors = gameState.retiredDirectors || [];

  const alreadyPreserved = gameState.retiredDirectors.some(
    (retiredDirector) => retiredDirector.id === director.id
  );

  if (!alreadyPreserved) {
    const retiredDirector = director.toObject
      ? director.toObject()
      : { ...director };
    retiredDirector.status = "RETIRED";
    gameState.retiredDirectors.push(retiredDirector);
  }
};

const ageDirectorPool = ({ directors = [], gameState, source }) => {
  const activeDirectors = [];
  let retiredCount = 0;

  directors.forEach((director) => {
    if (director.status === "RETIRED") {
      preserveAlreadyRetiredDirector(gameState, director);
      return;
    }

    director.age = Number(director.age || 0) + 1;

    if (director.age >= RETIREMENT_AGE) {
      if (source === "owned") {
        markRetiredDirectorProjectsForReplacement(gameState, director);
      }

      retireDirector({ director, gameState, source });
      retiredCount += 1;
      return;
    }

    activeDirectors.push(director);
  });

  return {
    activeDirectors,
    retiredCount,
  };
};

export const processDirectorAging = (gameState) => {
  if (gameState.currentWeek % WEEKS_PER_YEAR !== 0) {
    return;
  }

  const marketResult = ageDirectorPool({
    directors: gameState.marketDirectors || [],
    gameState,
    source: "market",
  });

  const ownedResult = ageDirectorPool({
    directors: gameState.ownedDirectors || [],
    gameState,
    source: "owned",
  });

  gameState.marketDirectors = marketResult.activeDirectors;
  gameState.ownedDirectors = ownedResult.activeDirectors;

  const totalRetirements = marketResult.retiredCount + ownedResult.retiredCount;

  for (let index = 0; index < totalRetirements; index += 1) {
    gameState.marketDirectors.push(createReplacementDirector());
  }
};
