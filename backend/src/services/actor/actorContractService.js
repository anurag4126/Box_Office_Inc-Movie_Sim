const MIN_ACTOR_COMPENSATION = 50000;
const MAX_ACTOR_COMPENSATION = 2000000;

const rarityFanLoss = {
  Common: 10,
  Uncommon: 25,
  Rare: 100,
  Epic: 500,
  Legendary: 2000,
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const calculateActorCompensation = (actor) => {
  const popularity = Number(actor.popularity || 0);
  const awards = Number(actor.awards || 0);
  const contractYears = Math.max(1, Number(actor.contractYears || 1));

  const popularityComponent = popularity * 10000;
  const awardsComponent = awards * 150000;
  const contractComponent = Math.max(0, contractYears - 1) * 75000;

  return Math.round(
    clamp(
      MIN_ACTOR_COMPENSATION + popularityComponent + awardsComponent + contractComponent,
      MIN_ACTOR_COMPENSATION,
      MAX_ACTOR_COMPENSATION,
    ),
  );
};

export const calculateActorFanLoss = (actor) => rarityFanLoss[actor.rarity] || 10;
