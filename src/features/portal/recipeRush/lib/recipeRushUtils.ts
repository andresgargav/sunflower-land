import { BOX_POSITION_Y_OFFSET } from "../RecipeRushConstants";

export const calcYPosition = (baseY: number, offsetMultiplier = 0) =>
  baseY + BOX_POSITION_Y_OFFSET * offsetMultiplier;
