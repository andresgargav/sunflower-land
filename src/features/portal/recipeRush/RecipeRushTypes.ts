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

export type CookingStates = "ROASTED" | "FRIED" | "BOILED" | "CHOPPED";

export type SpriteConfig = { frame: number } & Coordinates;

export type SpritePositionConfig = SpriteConfig & { pos: SpritePositions };

export type CookingTool = {
  spriteName: string;
  animStart: number;
  animEnd: number;
  effect: CookingStates;
};

export type ItemBumpkin = Coordinates & { scale: number };
