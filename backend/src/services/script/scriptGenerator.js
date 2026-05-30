import { generateTitle } from "./titleGenerator.js";
import { generateGenres } from "./genreGenerator.js";
import { calculatePrice } from "./priceCalculator.js";

const randomStat = () => Math.floor(Math.random() * 51) + 50;

export const generateScripts = (count = 5) => {
  return Array.from({ length: count }, () => {
    const quality = randomStat();
    const originality = randomStat();
    const audienceAppeal = randomStat();
    const franchisePotential = randomStat();

    return {
      title: generateTitle(),

      genres: generateGenres(),

      quality,

      originality,

      audienceAppeal,

      franchisePotential,

      rarity: "Common",

      price: calculatePrice({
        quality,
        originality,
        audienceAppeal,
        franchisePotential,
      }),
    };
  });
};
