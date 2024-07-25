import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  Coordinates,
  IngredientStates,
  CookingTools,
  AnimationConfig,
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

interface Props {
  x: number;
  y: number;
  frame: number;
  animation: AnimationConfig;
  spriteName: string;
  scene: BaseScene;
  itemPosition: Coordinates;
  id: number;
  effect: IngredientStates;
  duration: number;
  canPickUp: boolean;
  burnable: boolean;
  ingredientYOffset: number;
  name: CookingTools;
  player?: BumpkinContainer;
}

export class CookingToolContainer extends Phaser.GameObjects.Container {
  private id: number;
  private spriteName: string;
  private itemPosition: Coordinates;
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
  private verticalMove: Phaser.Tweens.TweenChain | null;

  scene: BaseScene;
  defaultX: number;
  defaultY: number;

  constructor({
    x,
    y,
    frame,
    animation,
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
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.defaultX = x + SQUARE_WIDTH / 2;
    this.defaultY = y + SQUARE_WIDTH / 2;
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
    this.verticalMove = null;

    // Cooking Tool Sprite
    this.sprite = scene.add.sprite(
      this.itemPosition.x,
      this.itemPosition.y,
      spriteName,
      frame
    );

    // Animations
    if (canPickUp) {
      scene.anims.create({
        key: `${spriteName}_${id}_final_idle`,
        frames: [{ key: spriteName, frame: animation.end + 1 }],
        repeat: -1,
        frameRate: 10,
      });
    }

    scene.anims.create({
      key: `${spriteName}_${id}_idle`,
      frames: [{ key: spriteName, frame: frame }],
      repeat: -1,
      frameRate: 10,
    });

    scene.anims.create({
      key: `${spriteName}_${id}_action`,
      frames: scene.anims.generateFrameNumbers(spriteName, {
        start: frame + animation.start,
        end: frame + animation.end,
      }),
      repeat: -1,
      frameRate: animation.frameRate,
    });

    // Progress Bar
    this.progressBar = new ProgressBar({
      x: this.itemPosition.x - SQUARE_WIDTH / 2,
      y: this.itemPosition.y + SQUARE_WIDTH / 2 - 1,
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
    this.sprite.play(`${this.spriteName}_${this.id}_final_idle`, true);
  }

  private playIdle() {
    this.sprite.play(`${this.spriteName}_${this.id}_idle`, true);
  }

  private playAction() {
    this.sprite.play(`${this.spriteName}_${this.id}_action`, true);
  }

  private performAction() {
    if (this.ingredient && !this.player?.hasItem) {
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

    ingredient.adjustDefault(
      this.itemPosition.x,
      this.itemPosition.y + this.ingredientYOffset
    );
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
    this.ingredient?.adjustDefault(
      this.itemPosition.x,
      this.itemPosition.y + this.ingredientYOffset
    );
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