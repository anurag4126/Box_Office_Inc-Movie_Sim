const DISCOVERY_REVEAL_THRESHOLD = 50;
const HIDDEN_STAT_VALUE = null;

export const presentDirector = (director) => {
  const presentedDirector = director.toObject
    ? director.toObject()
    : { ...director };

  const discovered = Number(presentedDirector.discovered || 0);
  const statsRevealed = discovered >= DISCOVERY_REVEAL_THRESHOLD;

  presentedDirector.statsRevealed = statsRevealed;

  if (!statsRevealed) {
    presentedDirector.creativity = HIDDEN_STAT_VALUE;
    presentedDirector.reliability = HIDDEN_STAT_VALUE;
    presentedDirector.leadership = HIDDEN_STAT_VALUE;
  }

  return presentedDirector;
};

export const presentDirectors = (directors = []) => directors.map(presentDirector);
