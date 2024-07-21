import { CookingToolContainer } from "./containers/CookingToolContainer";
import { IngredientContainer } from "./containers/IngredientContainer";
import { RecipeContainer } from "./containers/RecipeContainer";

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

export type CookingToolInfo = {
  spriteName: string;
  animStart: number;
  animEnd: number;
  effect: IngredientStates;
  duration: number;
  canPickUp: boolean;
};

export type Item = Coordinates & { scale: number };

export type ItemContainer =
  | IngredientContainer
  | CookingToolContainer
  | RecipeContainer;
