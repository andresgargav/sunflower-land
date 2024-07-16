import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { CookingStates } from "../RecipeRushTypes";
import { BaseScene } from "features/world/scenes/BaseScene";
import { ITEM_BUMPKIN } from "../RecipeRushConstants";

interface Props {
  x: number;
  y: number;
  frame: number;
  scene: BaseScene;
  name: string;
  player?: BumpkinContainer;
}

export class IngredientContainer extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  private ingredientName: string;
  private ingredientState: CookingStates;
  private border = false;

  scene: BaseScene;
  sprite: Phaser.GameObjects.Sprite;

  constructor({ x, y, frame, scene, name, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;
    this.ingredientName = name;
    this.ingredientState = "RAW";

    // Ingredient Sprite
    const spriteName = "ingredients";
    this.sprite = scene.add.sprite(0, 0, spriteName, frame);

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);
  }

  applyOutline() {
    this.sprite.setPipeline("WhitenPipeline");
  }

  removeOutline() {
    this.sprite.resetPipeline();
  }

  adjustWithPlayer() {
    const directionMultiplier =
      this.player?.directionFacing === "left" ? -1 : 1;

    this.player?.item
      ?.setX(directionMultiplier)
      .setScale(ITEM_BUMPKIN.scale * directionMultiplier, ITEM_BUMPKIN.scale);
  }
}
