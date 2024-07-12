import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { Coordinates } from "../RecipeRushTypes";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { ITEM_BUMPKIN } from "../RecipeRushConstants";
import { BaseScene } from "features/world/scenes/BaseScene";

interface Props {
  x: number;
  y: number;
  frame: number;
  scene: BaseScene;
  itemPosition: Coordinates;
  player?: BumpkinContainer;
}

export class CountertopContainer extends Phaser.GameObjects.Container {
  private itemPosition: Coordinates;
  private player?: BumpkinContainer;
  private item: Phaser.GameObjects.Sprite | null;

  constructor({ x, y, frame, itemPosition, scene, player }: Props) {
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.scene = scene;
    this.itemPosition = itemPosition;
    this.player = player;
    this.item = null;

    // Countertop Highlight Sprite
    const spriteName = "highlights";
    const countertop = scene.add
      .sprite(0, 0, spriteName, frame)
      .setVisible(false);

    // Events
    this.on("pointerover", () => countertop.setVisible(true));
    this.on("pointerout", () => countertop.setVisible(false));
    this.on("pointerdown", this.handleCountertopClick);

    this.setSize(countertop.width, countertop.height);
    this.setInteractive({ cursor: "pointer" });
    this.add(countertop);

    scene.add.existing(this);
  }

  private handleCountertopClick() {
    if (this.item && !this.player?.hasItem) {
      // Transfer item from the countertop to the Bumpkin
      const item = this.item;
      (item as Phaser.GameObjects.Sprite).setPosition(
        ITEM_BUMPKIN.x,
        ITEM_BUMPKIN.y
      );
      this.remove(item as Phaser.GameObjects.Sprite);
      this.item = null;
      this.player?.pickUpItem(item);
    } else if (!this.item && this.player?.hasItem) {
      // Transfer item from the Bumpkin to the countertop
      const item = this.player?.dropItem();
      (item as Phaser.GameObjects.Sprite)
        .setPosition(this.itemPosition.x, this.itemPosition.y)
        .setScale(ITEM_BUMPKIN.scale);
      item && this.add(item as Phaser.GameObjects.Sprite);
      this.item = item;
    }
  }
}
