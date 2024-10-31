export interface Coordinates {
  x: number;
  y: number;
}

export type SpritePositions =
  | "TL"
  | "T"
  | "TR"
  | "BL"
  | "B"
  | "BR"
  | "RT"
  | "R"
  | "RB"
  | "LT"
  | "L"
  | "LB";

export type Directions = "Top" | "Bottom" | "Right" | "Left";

export type CookingTools = "Cutting Board" | "Pot" | "Pan" | "Deep Fryer";

export type CookingToolBases = "Stove";

export type IngredientStates =
  | "RAW"
  | "CHOPPED"
  | "ROASTED"
  | "FRIED"
  | "BOILED";

export type SpriteConfig = { frame: number } & Coordinates;

export type SpritePositionConfig = SpriteConfig & { pos: SpritePositions };

export type PositionConfig = Coordinates & { direction: Directions };

export interface AnimationConfig {
  start: number;
  end: number;
  frameRate: number;
}

export interface CookingToolBaseInfo {
  spriteName: string;
  cookingToolYOffset: number;
}

export type CookingToolInfo = {
  spriteName: string;
  animation: AnimationConfig;
  directionFrame: Record<Directions, number>;
  base?: CookingToolBaseInfo;
  effect: IngredientStates;
  duration: number;
  canPickUp: boolean;
  burnable: boolean;
  ingredientYOffset: number;
};

export type Item = Coordinates & { scale: number };
