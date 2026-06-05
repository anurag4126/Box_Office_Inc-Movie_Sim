const getReviewLabel = (score) => {
  if (score <= 20) return "Terrible";
  if (score <= 40) return "Poor";
  if (score <= 60) return "Average";
  if (score <= 80) return "Good";
  return "Excellent";
};

export const generateReviews = (movie, script, director, leadActor, crewTeam) => {
  // Defensive checks to prevent crashes if data is missing
  const scriptQuality = script?.quality ?? 50;
  const scriptAudienceAppeal = script?.audienceAppeal ?? 50;
  const directorCreativity = director?.creativity ?? 50;
  const directorReputation = director?.reputation ?? 50;
  const crewTechnicalQuality = crewTeam?.technicalQuality ?? 50;
  const actorActingSkill = leadActor?.actingSkill ?? 50;
  const actorPopularity = leadActor?.popularity ?? 50;
  const movieQuality = movie?.quality ?? 50;

  // Critic Score Formula:
  // Script Quality → 40%
  // Director Creativity → 30%
  // Crew Technical Quality → 20%
  // Lead Actor Skill → 10%
  const criticScore = Math.round(
    (scriptQuality * 0.4) +
    (directorCreativity * 0.3) +
    (crewTechnicalQuality * 0.2) +
    (actorActingSkill * 0.1)
  );

  // Audience Score Formula:
  // Lead Actor Popularity → 35%
  // Script Audience Appeal → 25%
  // Director Reputation → 20%
  // Movie Quality → 20%
  const audienceScore = Math.round(
    (actorPopularity * 0.35) +
    (scriptAudienceAppeal * 0.25) +
    (directorReputation * 0.2) +
    (movieQuality * 0.2)
  );

  return {
    criticScore: Math.min(100, criticScore),
    criticLabel: getReviewLabel(criticScore),
    audienceScore: Math.min(100, audienceScore),
    audienceLabel: getReviewLabel(audienceScore)
  };
};
