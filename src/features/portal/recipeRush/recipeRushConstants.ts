import { SQUARE_WIDTH } from "features/game/lib/constants";

const BOX_POSITION_Y_OFFSET = 3.75 / 4;

const calcYPosition = (baseY: number, offsetMultiplier = 0) =>
  baseY + BOX_POSITION_Y_OFFSET * offsetMultiplier;

export const INGREDIENT_BOXES_POSITIONS: {
  index: number;
  x: number;
  y: number;
}[] = [
  // Top
  { index: 0, x: SQUARE_WIDTH * 20, y: SQUARE_WIDTH * 8 }, // Crop - Sunflower
  { index: 1, x: SQUARE_WIDTH * 21, y: SQUARE_WIDTH * 8 }, // Crop - Potato
  { index: 2, x: SQUARE_WIDTH * 22, y: SQUARE_WIDTH * 8 }, // Crop - Pumpkin
  { index: 3, x: SQUARE_WIDTH * 23, y: SQUARE_WIDTH * 8 }, // Crop - Carrot
  { index: 4, x: SQUARE_WIDTH * 24, y: SQUARE_WIDTH * 8 }, // Crop - Cabbage
  { index: 5, x: SQUARE_WIDTH * 25, y: SQUARE_WIDTH * 8 }, // Crop - Soybean
  // Bottom
  { index: 7, x: SQUARE_WIDTH * 20, y: SQUARE_WIDTH * 11.75 }, // Crop - Cauliflower
  { index: 8, x: SQUARE_WIDTH * 21, y: SQUARE_WIDTH * 11.75 }, // Crop - Parsnip
  { index: 9, x: SQUARE_WIDTH * 22, y: SQUARE_WIDTH * 11.75 }, // Crop - Eggplant
  { index: 10, x: SQUARE_WIDTH * 23, y: SQUARE_WIDTH * 11.75 }, // Crop - Corn
  { index: 11, x: SQUARE_WIDTH * 24, y: SQUARE_WIDTH * 11.75 }, // Crop - Radish
  { index: 12, x: SQUARE_WIDTH * 25, y: SQUARE_WIDTH * 11.75 }, // Crop - Wheat
  // Right
  { index: 6, x: SQUARE_WIDTH * 26, y: SQUARE_WIDTH * calcYPosition(8, 0) }, // Crop - Beetroot
  { index: 14, x: SQUARE_WIDTH * 26, y: SQUARE_WIDTH * calcYPosition(8, 1) }, // Fish - Anchovy
  { index: 15, x: SQUARE_WIDTH * 26, y: SQUARE_WIDTH * calcYPosition(8, 2) }, // Fish - Red Snapper
  { index: 16, x: SQUARE_WIDTH * 26, y: SQUARE_WIDTH * calcYPosition(8, 3) }, // Fish - Tuna
  { index: 13, x: SQUARE_WIDTH * 26, y: SQUARE_WIDTH * calcYPosition(8, 4) }, // Crop - Kale
];
