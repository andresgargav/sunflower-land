import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { Coordinates, CookingStates } from "../RecipeRushTypes";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { BaseScene, WALKING_SPEED } from "features/world/scenes/BaseScene";
import { ProgressBar } from "./ProgressBarContainer";
import { BURNABLE_STATES, ITEM_BUMPKIN } from "../RecipeRushConstants";

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
  player?: BumpkinContainer;
}

export class CookingToolContainer extends Phaser.GameObjects.Container {
  private id: number;
  private spriteName: string;
  private itemPosition: Coordinates;
  private effect: CookingStates;
  private player?: BumpkinContainer;
  private item: Phaser.GameObjects.Sprite | null;
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
    player,
  }: Props) {
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.spriteName = spriteName;
    this.scene = scene;
    this.itemPosition = itemPosition;
    this.id = id;
    this.effect = effect;
    this.player = player;
    this.item = null;

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
      duration: 2400,
      onComplete: () => {
        this.cookingTool.playAfterRepeat(
          `${this.spriteName}_${this.id}_idle`,
          0
        );

        this.item?.setVisible(true);

        this.setInteractive();

        this.scene.walkingSpeed = WALKING_SPEED;
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

  private performAction() {
    if (this.item && !this.player?.hasItem) {
      // Transfer item from the Cooking Tool to the Bumpkin
      const item = this.item;
      (item as Phaser.GameObjects.Sprite).setPosition(
        ITEM_BUMPKIN.x,
        ITEM_BUMPKIN.y
      );
      this.remove(item as Phaser.GameObjects.Sprite);
      this.item = null;
      this.player?.pickUpItem(item);
    } else if (!this.item && this.player?.hasItem) {
      this.disableInteractive();

      // Transfer item from the Bumpkin to the Cooking Tool
      const item = this.player?.dropItem();
      (item as Phaser.GameObjects.Sprite).setPosition(
        this.itemPosition.x,
        this.itemPosition.y - 5
      );
      item && this.add(item as Phaser.GameObjects.Sprite);
      this.item = item;

      if (!BURNABLE_STATES[this.effect]) {
        this.scene.walkingSpeed = 0;
        this.item?.setVisible(false);
      }

      this.cookingTool.play(`${this.spriteName}_${this.id}_action`, true);

      this.progressBar.start();
    }
  }
}
