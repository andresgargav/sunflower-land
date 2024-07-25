import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { IngredientStates } from "../RecipeRushTypes";
import { BaseScene } from "features/world/scenes/BaseScene";
import {
  EXPRESSION_ITEM,
  INGREDIENT_STATE,
  ITEM_BUMPKIN,
} from "../RecipeRushConstants";
import { AlertContainer } from "./AlertContainer";
import { IngredientStateContainer } from "./IngredientStateContainer";

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
  private ingredientState: IngredientStateContainer;
  private verticalMove: Phaser.Tweens.TweenChain | null;

  scene: BaseScene;
  sprite: Phaser.GameObjects.Sprite;

  constructor({ x, y, frame, scene, name, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;
    this.ingredientName = name;
    this.verticalMove = null;

    // Ingredient Sprite
    const spriteName = "ingredients";
    this.sprite = scene.add.sprite(0, 0, spriteName, frame);

    // Alert
    this.alert = new AlertContainer({
      x: EXPRESSION_ITEM.x,
      y: EXPRESSION_ITEM.y,
      scene: scene,
    });

    // State
    this.ingredientState = new IngredientStateContainer({
      x: INGREDIENT_STATE.x,
      y: INGREDIENT_STATE.y,
      scene: scene,
      stateName: "RAW",
    });

    this.setSize(this.sprite.width, this.sprite.height);
    this.add([this.sprite, this.ingredientState]);
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

  adjustWithPlayer(isInCookingTool = false) {
    const [directionMultiplier, ingredientStateX] =
      this.player?.directionFacing === "left"
        ? [-1, this.width + INGREDIENT_STATE.x * 2 - 1]
        : [1, INGREDIENT_STATE.x];

    const scaledItem = ITEM_BUMPKIN.scale * directionMultiplier;
    const scaledIngredientState = INGREDIENT_STATE.scale * directionMultiplier;

    !isInCookingTool &&
      this.setX(directionMultiplier).setScale(scaledItem, ITEM_BUMPKIN.scale);

    this.ingredientState
      .setX(ingredientStateX)
      .setScale(scaledIngredientState, INGREDIENT_STATE.scale);
  }

  adjustDefault(x: number, y: number) {
    this.setPosition(x, y).setScale(ITEM_BUMPKIN.scale);
    this.ingredientState
      .setX(INGREDIENT_STATE.x)
      .setScale(INGREDIENT_STATE.scale);
  }

  changeState(stateName: IngredientStates) {
    this.ingredientState?.changeState(stateName);
  }

  getState() {
    return this.ingredientState.getState();
  }
}
