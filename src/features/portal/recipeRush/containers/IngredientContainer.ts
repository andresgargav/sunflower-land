import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { IngredientStates } from "../RecipeRushTypes";
import { BaseScene } from "features/world/scenes/BaseScene";
import {
  EXPRESSION_ITEM,
  INGREDIENT_STATE,
  ITEM_BUMPKIN,
  ITEM_IDLE_ANIMATION,
  ITEM_WALK_ANIMATION,
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
  private verticalMove: Phaser.Tweens.Tween | null;

  private startTime = 0;
  private endTime = 0;

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

  private getFramePosition = (
    elapsed: number,
    frames: Record<string, number>[]
  ) => {
    let accumulatedDuration = 0;
    for (const frame of frames) {
      if (elapsed <= accumulatedDuration + frame.duration) {
        return frame.y;
      }
      accumulatedDuration += frame.duration;
    }
    return frames[frames.length - 1].y;
  };

  playVerticalMove() {
    if (this.verticalMove) return;

    let startTime = 0;

    const getTotalDuration = (animation: { duration: number }[]) => {
      return animation.reduce((sum, frame) => sum + frame.duration, 0);
    };

    const createTween = (animation: { duration: number; y: number }[]) => {
      const totalDuration = getTotalDuration(animation);

      return this.scene.tweens.add({
        targets: this,
        repeat: -1,
        y: this.y + 3,
        yoyo: true,
        duration: totalDuration / 2,
        onStart: () => (startTime = this.scene.time.now),
        onUpdate: () => {
          const elapsed = this.scene.time.now - startTime;
          this.setY(this.getFramePosition(elapsed, animation));
        },
        onRepeat: () => (startTime = this.scene.time.now),
      });
    };

    const animation = this.scene.isMoving
      ? ITEM_WALK_ANIMATION
      : ITEM_IDLE_ANIMATION;
    this.verticalMove = createTween(animation);
  }

  removeVerticalMove() {
    if (!this.verticalMove) return;

    this.verticalMove.stop();
    this.setY(ITEM_BUMPKIN.y);
    this.verticalMove.destroy();
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
