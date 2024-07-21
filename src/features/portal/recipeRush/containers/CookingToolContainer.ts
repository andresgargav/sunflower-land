import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  Coordinates,
  IngredientStates,
  CookingTools,
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
  animStart: number;
  animEnd: number;
  spriteName: string;
  scene: BaseScene;
  itemPosition: Coordinates;
  id: number;
  effect: IngredientStates;
  duration: number;
  canPickUp: boolean;
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
  private cookingToolName: CookingTools;
  private player?: BumpkinContainer;
  private ingredient: IngredientContainer | null;
  private sprite: Phaser.GameObjects.Sprite;
  private progressBar: ProgressBar;

  scene: BaseScene;

  constructor({
    x,
    y,
    frame,
    animStart,
    animEnd,
    spriteName,
    scene,
    itemPosition,
    id,
    effect,
    duration,
    canPickUp,
    name,
    player,
  }: Props) {
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.spriteName = spriteName;
    this.scene = scene;
    this.itemPosition = itemPosition;
    this.id = id;
    this.effect = effect;
    this.duration = duration;
    this.canPickUp = canPickUp;
    this.cookingToolName = name;
    this.player = player;
    this.ingredient = null;

    // Cooking Tool Sprite
    this.sprite = scene.add.sprite(
      this.itemPosition.x,
      this.itemPosition.y,
      spriteName,
      frame
    );

    // Animations
    scene.anims.create({
      key: `${spriteName}_${id}_idle`,
      frames: [{ key: spriteName, frame: frame }],
      repeat: -1,
      frameRate: 10,
    });

    scene.anims.create({
      key: `${spriteName}_${id}_action`,
      frames: scene.anims.generateFrameNumbers(spriteName, {
        start: frame + animStart,
        end: frame + animEnd,
      }),
      repeat: -1,
      frameRate: 10,
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
    this.playIdle();
    (this.player as BumpkinContainer).isCooking = false;
    this.ingredient?.applyHighlight();
    this.ingredient?.setVisible(true);
    this.setInteractive();
    this.scene.walkingSpeed = PLAYER_WALKING_SPEED;
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
    const ingredient = this.ingredient;
    if (!ingredient) return;

    ingredient.setPosition(ITEM_BUMPKIN.x, ITEM_BUMPKIN.y);
    ingredient.removeHighlight();
    this.remove(ingredient);
    this.ingredient = null;
    this.player?.pickUpItem(ingredient);
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

    ingredient.adjustDefault(this.itemPosition.x, this.itemPosition.y - 5);
    this.add(ingredient);
    this.ingredient = ingredient;

    this.handleActions();
  }

  private handleActions() {
    if (!this.player) return;

    if (!this.canPickUp) {
      this.scene.walkingSpeed = 0;
      this.ingredient?.setVisible(false);
    }

    this.disableInteractive();
    this.playAction();
    this.ingredient?.changeState(this.effect);
    this.player.isCooking = true;
    this.progressBar.start();
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
