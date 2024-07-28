export interface Coordinates {
  x: number;
  y: number;
}

export type SpritePositions =
  | "MTL"
  | "MT"
  | "MTR"
  | "MBL"
  | "MB"
  | "MBR"
  | "RT"
  | "R"
  | "RB"
  | "LT"
  | "L"
  | "LB";

export type CookingTools = "Cutting Board" | "Pot" | "Pan" | "Deep Fryer";

export type IngredientStates =
  | "RAW"
  | "CHOPPED"
  | "ROASTED"
  | "FRIED"
  | "BOILED";

export type SpriteConfig = { frame: number } & Coordinates;

export type SpritePositionConfig = SpriteConfig & { pos: SpritePositions };

export interface AnimationConfig {
  start: number;
  end: number;
  frameRate: number;
}

export type CookingToolInfo = {
  spriteName: string;
  animation: AnimationConfig;
  effect: IngredientStates;
  duration: number;
  canPickUp: boolean;
  burnable: boolean;
  ingredientYOffset: number;
};

export type Item = Coordinates & { scale: number };
