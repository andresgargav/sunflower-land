import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { Coordinates, CookingStates, CookingTools } from "../RecipeRushTypes";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { BaseScene } from "features/world/scenes/BaseScene";
import { ProgressBar } from "./ProgressBarContainer";
import {
  BURNABLE_STATES,
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
  effect: CookingStates;
  duration: number;
  name: CookingTools;
  player?: BumpkinContainer;
}

export class CookingToolContainer extends Phaser.GameObjects.Container {
  private id: number;
  private spriteName: string;
  private itemPosition: Coordinates;
  private effect: CookingStates;
  private duration: number;
  private cookingToolName: CookingTools;
  private player?: BumpkinContainer;
  private ingredient: IngredientContainer | null;
  private cookingTool: Phaser.GameObjects.Sprite;
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
    this.cookingToolName = name;
    this.player = player;
    this.ingredient = null;

    // Cooking Tool Sprite
    this.cookingTool = scene.add.sprite(
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
      onComplete: () => {
        this.idle();
        (this.player as BumpkinContainer).isCooking = false;

        this.ingredient?.setVisible(true);

        this.setInteractive();

        this.scene.walkingSpeed = PLAYER_WALKING_SPEED;
      },
    });

    // Events
    this.on("pointerdown", this.performAction);

    this.setSize(this.cookingTool.width, this.cookingTool.height);
    this.setInteractive({ cursor: "pointer" });
    this.add(this.cookingTool);
    this.add(this.progressBar);

    this.cookingTool.play(`${spriteName}_${id}_idle`, true);

    scene.add.existing(this);
  }

  private idle() {
    this.cookingTool.play(`${this.spriteName}_${this.id}_idle`, true);
  }

  private action() {
    this.cookingTool.play(`${this.spriteName}_${this.id}_action`, true);
  }

  private performAction() {
    if (this.ingredient && !this.player?.hasItem) {
      // Transfer ingredient from the Cooking Tool to the Bumpkin
      const ingredient = this.ingredient;
      ingredient?.setPosition(ITEM_BUMPKIN.x, ITEM_BUMPKIN.y);
      this.remove(ingredient);
      this.ingredient = null;
      this.player?.pickUpItem(ingredient);
    } else if (!this.ingredient && this.player?.hasItem) {
      this.disableInteractive();

      // Transfer ingredient from the Bumpkin to the Cooking Tool
      const ingredient = this.player?.dropItem();
      if (ingredient instanceof IngredientContainer) {
        ingredient
          ?.setPosition(this.itemPosition.x, this.itemPosition.y - 5)
          .setScale(ITEM_BUMPKIN.scale);
        ingredient && this.add(ingredient);
        this.ingredient = ingredient;
      }

      // Actions of Cooking Tools that cannot be picked up
      if (!BURNABLE_STATES[this.effect]) {
        this.scene.walkingSpeed = 0;
        this.ingredient?.setVisible(false);
      }

      this.action();
      this.player.isCooking = true;

      this.progressBar.start();
    }
  }
}
