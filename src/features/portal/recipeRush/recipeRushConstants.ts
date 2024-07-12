import { SQUARE_WIDTH } from "features/game/lib/constants";
import {
  ItemBumpkin,
  Coordinates,
  SpriteConfig,
  SpritePositions,
  SpritePositionConfig,
  CookingTool,
  CookingStates,
} from "./RecipeRushTypes";
import { calcYPosition } from "./lib/recipeRushUtils";

export const PLAYER_WALKING_SPEED = 45;

export const BOX_POSITION_Y_OFFSET = 3.75 / 4;

const PROGRESS_BAR_WIDTH_PERCENT = 0.75;
export const PROGRESS_BAR_WIDTH = SQUARE_WIDTH * PROGRESS_BAR_WIDTH_PERCENT;
export const PROGRESS_BAR_X =
  (SQUARE_WIDTH * (1 - PROGRESS_BAR_WIDTH_PERCENT)) / 2;

export const ITEM_BUMPKIN: ItemBumpkin = {
  x: 0,
  y: -10,
  scale: 0.75,
};

export const INGREDIENT_BOXES_CONFIGURATIONS: SpriteConfig[] = [
  // Top
  { frame: 0, x: SQUARE_WIDTH * 25, y: SQUARE_WIDTH * 8 }, // Crop - Sunflower
  { frame: 1, x: SQUARE_WIDTH * 26, y: SQUARE_WIDTH * 8 }, // Crop - Potato
  { frame: 2, x: SQUARE_WIDTH * 27, y: SQUARE_WIDTH * 8 }, // Crop - Pumpkin
  { frame: 3, x: SQUARE_WIDTH * 28, y: SQUARE_WIDTH * 8 }, // Crop - Carrot
  { frame: 4, x: SQUARE_WIDTH * 29, y: SQUARE_WIDTH * 8 }, // Crop - Cabbage
  { frame: 5, x: SQUARE_WIDTH * 30, y: SQUARE_WIDTH * 8 }, // Crop - Soybean
  // Bottom
  { frame: 7, x: SQUARE_WIDTH * 25, y: SQUARE_WIDTH * 11.75 }, // Crop - Cauliflower
  { frame: 8, x: SQUARE_WIDTH * 26, y: SQUARE_WIDTH * 11.75 }, // Crop - Parsnip
  { frame: 9, x: SQUARE_WIDTH * 27, y: SQUARE_WIDTH * 11.75 }, // Crop - Eggplant
  { frame: 10, x: SQUARE_WIDTH * 28, y: SQUARE_WIDTH * 11.75 }, // Crop - Corn
  { frame: 11, x: SQUARE_WIDTH * 29, y: SQUARE_WIDTH * 11.75 }, // Crop - Radish
  { frame: 12, x: SQUARE_WIDTH * 30, y: SQUARE_WIDTH * 11.75 }, // Crop - Wheat
  // Right
  { frame: 6, x: SQUARE_WIDTH * 31, y: SQUARE_WIDTH * calcYPosition(8, 0) }, // Crop - Beetroot
  { frame: 14, x: SQUARE_WIDTH * 31, y: SQUARE_WIDTH * calcYPosition(8, 1) }, // Fish - Anchovy
  { frame: 15, x: SQUARE_WIDTH * 31, y: SQUARE_WIDTH * calcYPosition(8, 2) }, // Fish - Red Snapper
  { frame: 16, x: SQUARE_WIDTH * 31, y: SQUARE_WIDTH * calcYPosition(8, 3) }, // Fish - Tuna
  { frame: 13, x: SQUARE_WIDTH * 31, y: SQUARE_WIDTH * calcYPosition(8, 4) }, // Crop - Kale
];

export const COUNTERTOPS_CONFIGURATIONS: SpritePositionConfig[] = [
  // Middle - Top
  { frame: 0, x: SQUARE_WIDTH * 16, y: SQUARE_WIDTH * 5, pos: "MTL" },
  { frame: 1, x: SQUARE_WIDTH * 17, y: SQUARE_WIDTH * 5, pos: "MT" },
  { frame: 1, x: SQUARE_WIDTH * 18, y: SQUARE_WIDTH * 5, pos: "MT" },
  { frame: 1, x: SQUARE_WIDTH * 19, y: SQUARE_WIDTH * 5, pos: "MT" },
  { frame: 1, x: SQUARE_WIDTH * 20, y: SQUARE_WIDTH * 5, pos: "MT" },
  { frame: 1, x: SQUARE_WIDTH * 21, y: SQUARE_WIDTH * 5, pos: "MT" },
  { frame: 1, x: SQUARE_WIDTH * 22, y: SQUARE_WIDTH * 5, pos: "MT" },
  { frame: 2, x: SQUARE_WIDTH * 23, y: SQUARE_WIDTH * 5, pos: "MTR" },
  // Middle - Bottom
  { frame: 3, x: SQUARE_WIDTH * 16, y: SQUARE_WIDTH * 15, pos: "MBL" },
  { frame: 4, x: SQUARE_WIDTH * 17, y: SQUARE_WIDTH * 15, pos: "MB" },
  { frame: 4, x: SQUARE_WIDTH * 19, y: SQUARE_WIDTH * 15, pos: "MB" },
  { frame: 4, x: SQUARE_WIDTH * 20, y: SQUARE_WIDTH * 15, pos: "MB" },
  { frame: 4, x: SQUARE_WIDTH * 21, y: SQUARE_WIDTH * 15, pos: "MB" },
  { frame: 5, x: SQUARE_WIDTH * 23, y: SQUARE_WIDTH * 15, pos: "MBR" },
  // Right
  { frame: 6, x: SQUARE_WIDTH * 24, y: SQUARE_WIDTH * 6, pos: "RT" },
  { frame: 7, x: SQUARE_WIDTH * 24, y: SQUARE_WIDTH * 7, pos: "R" },
  { frame: 8, x: SQUARE_WIDTH * 24, y: SQUARE_WIDTH * 8, pos: "RB" },
  // ---
  { frame: 6, x: SQUARE_WIDTH * 24, y: SQUARE_WIDTH * 12, pos: "RT" },
  { frame: 12, x: SQUARE_WIDTH * 24, y: SQUARE_WIDTH * 14, pos: "RB" },
  // Left
  { frame: 9, x: SQUARE_WIDTH * 15, y: SQUARE_WIDTH * 6, pos: "LT" },
  { frame: 10, x: SQUARE_WIDTH * 15, y: SQUARE_WIDTH * 7, pos: "L" },
  { frame: 11, x: SQUARE_WIDTH * 15, y: SQUARE_WIDTH * 8, pos: "LB" },
  // ---
  { frame: 2, x: SQUARE_WIDTH * 15, y: SQUARE_WIDTH * 10, pos: "MTR" },
  // ---
  { frame: 9, x: SQUARE_WIDTH * 15, y: SQUARE_WIDTH * 12, pos: "LT" },
  { frame: 10, x: SQUARE_WIDTH * 15, y: SQUARE_WIDTH * 13, pos: "L" },
  { frame: 11, x: SQUARE_WIDTH * 15, y: SQUARE_WIDTH * 14, pos: "LB" },
];

export const TRASH_CANS_CONFIGURATIONS: SpritePositionConfig[] = [
  { frame: 13, x: SQUARE_WIDTH * 24, y: SQUARE_WIDTH * 13, pos: "R" },
];

export const POSITION_CONFIGURATIONS: Record<SpritePositions, Coordinates> = {
  MTL: { x: 2, y: 2 }, // Middle - Top - Left
  MT: { x: 1, y: 2 }, // Middle - Top
  MTR: { x: -1, y: 2 }, // Middle - Top - Right
  MBL: { x: 2, y: -2 }, // Middle - Bottom - Left
  MB: { x: 0, y: -2 }, // Middle - Bottom
  MBR: { x: -1, y: -2 }, // Middle - Bottom - Right
  RT: { x: -2, y: 2 }, // Right - Top
  R: { x: -2, y: 0 }, // Right
  RB: { x: -2, y: -2 }, // Right - Bottom
  LT: { x: 2, y: 1 }, // Left - Top
  L: { x: 2, y: -1 }, // Left
  LB: { x: 2, y: -2 }, // Left - Bottom
};

export const BURNABLE_STATES: Record<CookingStates, boolean> = {
  ROASTED: true,
  FRIED: true,
  BOILED: true,
  CHOPPED: false,
};

export const CUTTING_BOARD: CookingTool = {
  spriteName: "cutting_board",
  animStart: 1,
  animEnd: 5,
  effect: "CHOPPED",
};

export const CUTTING_BOARDS_CONFIGURATIONS: SpritePositionConfig[] = [
  { frame: 0, x: SQUARE_WIDTH * 17, y: SQUARE_WIDTH * 5, pos: "MT" },
  { frame: 6, x: SQUARE_WIDTH * 18, y: SQUARE_WIDTH * 15, pos: "MB" },
  { frame: 6, x: SQUARE_WIDTH * 22, y: SQUARE_WIDTH * 15, pos: "MB" },
  { frame: 12, x: SQUARE_WIDTH * 15, y: SQUARE_WIDTH * 12, pos: "LT" },
];
