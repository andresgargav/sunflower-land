import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  IngredientStates,
  CookingTools,
  AnimationConfig,
  Directions,
  PositionConfig,
} from "../RecipeRushTypes";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { BaseScene } from "features/world/scenes/BaseScene";
import { ProgressBar } from "./ProgressBarContainer";
import {
  ALLOWED_TRANSITIONS,
  ITEM_BUMPKIN,
  PLAYER_WALKING_SPEED,
} from "../RecipeRushConstants";
import { IngredientContainer } from "./IngredientContainer";
import { ItemContainer } from "./ItemContainer";
import { CookingToolBaseContainer } from "./CookingToolBaseContainer";
import { CountertopContainer } from "./CountertopContainer";

interface Props {
  x: number;
  y: number;
  animation: AnimationConfig;
  directionFrame: Record<Directions, number>;
  spriteName: string;
  scene: BaseScene;
  itemPosition: PositionConfig;
  id: number;
  effect: IngredientStates;
  duration: number;
  canPickUp: boolean;
  burnable: boolean;
  ingredientYOffset: number;
  name: CookingTools;
  player?: BumpkinContainer;
}

export class CookingToolContainer extends ItemContainer {
  private id: number;
  private animation: AnimationConfig;
  private frame: number;
  private directionFrame: Record<Directions, number>;
  private spriteName: string;
  private itemPosition: PositionConfig;
  private effect: IngredientStates;
  private duration: number;
  private canPickUp: boolean;
  private burnable: boolean;
  private ingredientYOffset: number;
  private cookingToolName: CookingTools;
  private player?: BumpkinContainer;
  private ingredient: IngredientContainer | null;
  private sprite: Phaser.GameObjects.Sprite;
  private progressBar: ProgressBar;

  scene: BaseScene;

  constructor({
    x,
    y,
    animation,
    directionFrame,
    spriteName,
    scene,
    itemPosition,
    id,
    effect,
    duration,
    canPickUp,
    burnable,
    ingredientYOffset,
    name,
    player,
  }: Props) {
    super(scene, x, y);
    this.animation = animation;
    this.frame = directionFrame[itemPosition.direction];
    this.directionFrame = directionFrame;
    this.spriteName = spriteName;
    this.scene = scene;
    this.itemPosition = itemPosition;
    this.id = id;
    this.effect = effect;
    this.duration = duration;
    this.canPickUp = canPickUp;
    this.burnable = burnable;
    this.ingredientYOffset = ingredientYOffset;
    this.cookingToolName = name;
    this.player = player;
    this.ingredient = null;

    // Cooking Tool Sprite
    this.sprite = scene.add.sprite(0, 0, spriteName, this.frame);

    // Progress Bar
    this.progressBar = new ProgressBar({
      x: (SQUARE_WIDTH * -1) / 2,
      y: SQUARE_WIDTH / 2 - 1,
      scene: scene,
      duration: this.duration,
      onComplete: this.onProgressComplete.bind(this),
    });

    // Events
    this.on("pointerdown", this.performAction);

    this.setSize(this.sprite.width, this.sprite.height);
    this.setInteractive({ cursor: "pointer" });
    this.add([this.sprite, this.progressBar]);

    this.sprite.play(`${spriteName}_${id}_idle`, true);

    scene.add.existing(this);
  }

  private onProgressComplete() {
    this.canPickUp ? this.playFinalIdle() : this.playIdle();

    this.ingredient?.changeState(this.effect);
    this.ingredient?.applyHighlight();
    this.setInteractive();

    if (this.canPickUp) return;
    (this.player as BumpkinContainer).isCooking = false;
    this.ingredient?.setVisible(true);
    this.scene.walkingSpeed = PLAYER_WALKING_SPEED;
  }

  private playFinalIdle() {
    const animationName = `${this.spriteName}_${this.id}_${this.frame}_final_idle`;

    if (!this.scene.anims.exists(animationName)) {
      this.scene.anims.create({
        key: animationName,
        frames: [{ key: this.spriteName, frame: this.animation.end + 1 }],
        repeat: -1,
        frameRate: 10,
      });
    }

    this.sprite.play(animationName, true);
  }

  private playIdle() {
    const animationName = `${this.spriteName}_${this.id}_${this.frame}_idle`;

    if (!this.scene.anims.exists(animationName)) {
      this.scene.anims.create({
        key: animationName,
        frames: [{ key: this.spriteName, frame: this.frame }],
        repeat: -1,
        frameRate: 10,
      });
    }

    this.sprite.play(animationName, true);
  }

  private playAction() {
    const animationName = `${this.spriteName}_${this.id}_${this.frame}_action`;

    if (!this.scene.anims.exists(animationName)) {
      this.scene.anims.create({
        key: animationName,
        frames: this.scene.anims.generateFrameNumbers(this.spriteName, {
          start: this.frame + this.animation.start,
          end: this.frame + this.animation.end,
        }),
        repeat: -1,
        frameRate: this.animation.frameRate,
      });
    }

    this.sprite.play(animationName, true);
  }

  private performAction() {
    if (!this.player?.hasItem) {
      // Transfer ingredient from the Cooking Tool to the Bumpkin
      this.moveItemToPlayer();
    } else if (!this.ingredient && this.player?.hasItem) {
      // Transfer ingredient from the Bumpkin to the Cooking Tool
      this.moveItemToTool();
    }
  }

  private moveItemToPlayer() {
    this.ingredient?.removeHighlight();

    const item = this.canPickUp ? this : this.ingredient;
    if (!item) return;

    if (!this.canPickUp) {
      this.remove(item);
      this.ingredient = null;
    } else {
      const container = this.parentContainer as
        | CookingToolBaseContainer
        | CountertopContainer;
      container?.setItem(null);
      this.setDirection("Top");
    }

    item.setPosition(ITEM_BUMPKIN.x, ITEM_BUMPKIN.y);
    this.player?.pickUpItem(item);
  }

  private moveItemToTool() {
    if (!this.player) return;

    const playerItem = this.player.item;
    if (!(playerItem instanceof IngredientContainer)) return;

    if (!ALLOWED_TRANSITIONS[playerItem.getState()].includes(this.effect)) {
      return;
    }

    const ingredient = this.player.dropItem() as IngredientContainer;
    if (!ingredient) return;

    ingredient.adjustDefault(0, this.ingredientYOffset);
    this.add(ingredient);
    this.ingredient = ingredient;

    this.handleActions();
  }

  private handleActions() {
    if (!this.player) return;

    if (!this.canPickUp) {
      this.scene.walkingSpeed = 0;
      this.ingredient?.setVisible(false);
      this.player.isCooking = true;
    }

    this.disableInteractive();
    this.playAction();
    this.progressBar.start();
  }

  adjustWithPlayer() {
    const directionMultiplier =
      this.player?.directionFacing === "left" ? -1 : 1;

    this.setX(directionMultiplier).setScale(directionMultiplier, 1);
    this.ingredient?.adjustWithPlayer(true);
  }

  adjustDefault(x: number, y: number) {
    this.setPosition(x, y).setScale(1);
    this.ingredient?.adjustDefault(0, this.ingredientYOffset);
  }

  setDirection(direction: Directions) {
    this.frame = this.directionFrame[direction];
    this.sprite.setFrame(this.directionFrame[direction]);
  }
}
