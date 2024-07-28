import { BaseScene } from "features/world/scenes/BaseScene";
import { ItemContainer } from "./ItemContainer";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
}

export class RecipeContainer extends ItemContainer {
  constructor({ x, y, scene }: Props) {
    super(scene, x, y);
    this.scene = scene;
  }

  adjustWithPlayer() {
    // const directionMultiplier =
    //   this.player?.directionFacing === "left" ? -1 : 1;
    // this.setX(directionMultiplier).setScale(
    //   ITEM_BUMPKIN.scale * directionMultiplier,
    //   ITEM_BUMPKIN.scale
    // );
    // directionMultiplier === -1
    //   ? this.ingredientState.setX(this.width + INGREDIENT_STATE.x * 2 - 1)
    //   : this.ingredientState.setX(INGREDIENT_STATE.x);
    // directionMultiplier === -1
    //   ? this.ingredientState.setScale(
    //       INGREDIENT_STATE.scale * -1,
    //       INGREDIENT_STATE.scale
    //     )
    //   : this.ingredientState.setScale(INGREDIENT_STATE.scale);
  }

  adjustDefault(x: number, y: number) {
    // this.setPosition(x, y).setScale(ITEM_BUMPKIN.scale);
    // this.ingredientState
    //   .setX(INGREDIENT_STATE.x)
    //   .setScale(INGREDIENT_STATE.scale);
  }
}
