export const calculatePrice = ({
  quality,
  originality,
  audienceAppeal,
  franchisePotential,
}) => {
  return (
    quality * 1000 +
    originality * 500 +
    audienceAppeal * 600 +
    franchisePotential * 700
  );
};
