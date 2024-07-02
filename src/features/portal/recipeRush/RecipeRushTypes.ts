export type Coordinates = {
  x: number;
  y: number;
};

export type IngredientBoxConfig = { frame: number } & Coordinates;

export type ItemBumpkin = Coordinates & { scale: number };

export type CountertopPosition =
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

export interface CountertopConfig {
  frame: number;
  x: number;
  y: number;
  pos: CountertopPosition;
}
