import { BaseScene } from "features/world/scenes/BaseScene";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
}

export class RecipeContainer extends Phaser.GameObjects.Container {
  private verticalMove: Phaser.Tweens.TweenChain | null;

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

  playVerticalMove() {
    this.verticalMove = this.scene.tweens.chain({
      targets: this,
      tweens: [
        {
          y: this.y,
          duration: 300,
          ease: "Linear",
        },
        {
          y: this.y + 1,
          duration: 100,
          ease: "Linear",
        },
        {
          y: this.y + 2,
          duration: 200,
          ease: "Linear",
        },
        {
          y: this.y + 1,
          duration: 200,
          ease: "Linear",
        },
        {
          y: this.y,
          duration: 100,
          ease: "Linear",
        },
      ],
      repeat: -1,
    });
  }

  removeVerticalMove() {
    this.verticalMove?.destroy();
    this.verticalMove = null;
  }
}
