import { generateDirector } from "./directorGenerator.js";

export const createReplacementDirector = () => generateDirector(18);

export const retireDirector = ({ director, gameState, source }) => {
  const retiredDirector = director.toObject
    ? director.toObject()
    : { ...director };

  retiredDirector.status = "RETIRED";
  retiredDirector.busyUntilWeek = null;
  retiredDirector.retiredAtWeek = gameState.currentWeek;
  retiredDirector.retiredFrom = source;

  gameState.retiredDirectors = gameState.retiredDirectors || [];
  gameState.retiredDirectors.push(retiredDirector);

  gameState.notifications.push({
    message: `${retiredDirector.name} has retired from directing.`,
  });

  return retiredDirector;
};
