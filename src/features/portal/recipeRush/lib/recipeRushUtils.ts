import { BOX_POSITION_Y_OFFSET } from "../RecipeRushConstants";

export const calcYPosition = (baseY: number, offsetMultiplier = 0) =>
  baseY + BOX_POSITION_Y_OFFSET * offsetMultiplier;

export const checkDistance = (
  firstContainer: Phaser.GameObjects.Container,
  secondContainer: Phaser.GameObjects.Container,
  maxDistance: number
) => {
  const distance = Phaser.Math.Distance.BetweenPoints(
    firstContainer,
    secondContainer
  );

  if (distance > maxDistance) return false;
  return true;
};

export const findKeyByValue = (
  object: Record<number, string>,
  value: string
): number | undefined => {
  const entry = Object.entries(object).find(([, v]) => v === value);

  return entry ? Number(entry[0]) : undefined;
};
