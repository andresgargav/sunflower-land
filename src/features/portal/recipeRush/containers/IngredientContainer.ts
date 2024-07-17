import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { CookingStates } from "../RecipeRushTypes";
import { BaseScene } from "features/world/scenes/BaseScene";
import { EXPRESSION_ITEM, ITEM_BUMPKIN } from "../RecipeRushConstants";
import { AlertContainer } from "./AlertContainer";

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
  private alert: AlertContainer;

  scene: BaseScene;
  sprite: Phaser.GameObjects.Sprite;
  ingredientState: CookingStates;

  constructor({ x, y, frame, scene, name, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;
    this.ingredientName = name;
    this.ingredientState = "RAW";

    // Ingredient Sprite
    const spriteName = "ingredients";
    this.sprite = scene.add.sprite(0, 0, spriteName, frame);

    // Alert
    this.alert = new AlertContainer({
      x: EXPRESSION_ITEM.x,
      y: EXPRESSION_ITEM.y,
      scene: scene,
    });

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);
  }

  applyHighlight() {
    this.sprite.setPipeline("WhitenPipeline");
    this.alert.createBuzzTween();
    this.add(this.alert);
  }

  removeHighlight() {
    this.sprite.resetPipeline();
    this.alert.destroyBuzzTween();
    this.remove(this.alert);
  }

  adjustWithPlayer() {
    const directionMultiplier =
      this.player?.directionFacing === "left" ? -1 : 1;

    this.player?.item
      ?.setX(directionMultiplier)
      .setScale(ITEM_BUMPKIN.scale * directionMultiplier, ITEM_BUMPKIN.scale);
  }
}
