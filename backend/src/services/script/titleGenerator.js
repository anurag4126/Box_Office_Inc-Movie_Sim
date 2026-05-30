import {
  adjectives,
  nouns,
} from "../../constants/titleData.js";

const templates = [
  "{prefix}",
  "{prefix} of {suffix}",
  "The {suffix}",
  "Return of the {suffix}",
  "Rise of the {suffix}",
  "Legend of the {suffix}",
  "{prefix}: The {suffix}",
];

const randomItem = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

export const generateTitle = () => {
  const prefix =
    `${randomItem(adjectives)} ${randomItem(nouns)}`;

  const suffix =
    `${randomItem(adjectives)} ${randomItem(nouns)}`;

  const template =
    randomItem(templates);

  return template
    .replace("{prefix}", prefix)
    .replace("{suffix}", suffix);
};