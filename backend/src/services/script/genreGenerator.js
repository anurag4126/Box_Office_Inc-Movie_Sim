import { genres } from "../../constants/genres.js";

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const generateGenres = () => {
  const count = Math.floor(Math.random() * 3) + 1;

  const selected = new Set();

  while (selected.size < count) {
    selected.add(randomItem(genres));
  }

  return [...selected];
};
