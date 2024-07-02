import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { Coordinates } from "../RecipeRushTypes";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { ITEM_BUMPKIN } from "../RecipeRushConstants";

interface Props {
  x: number;
  y: number;
  frame: number;
  itemPosition: Coordinates;
  scene: Phaser.Scene;
  player?: BumpkinContainer;
}

export class CountertopContainer extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  private item: Phaser.GameObjects.GameObject | null;
  private itemPosition: Coordinates;

  constructor({ x, y, frame, itemPosition, scene, player }: Props) {
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.scene = scene;
    this.player = player;
    this.item = null;
    this.itemPosition = itemPosition;

    const spriteName = "countertop_highlights";

    const countertop = scene.add
      .sprite(0, 0, spriteName, frame)
      .setVisible(false);

    this.add(countertop);
    this.setSize(countertop.width, countertop.height);
    this.setInteractive({ cursor: "pointer" });

    // Events
    this.on("pointerover", () => {
      countertop.setVisible(true);
    });
    this.on("pointerout", () => {
      countertop.setVisible(false);
    });
    this.on("pointerdown", this.handleCountertopClick);

    scene.add.existing(this);
  }

  handleCountertopClick() {
    if (this.item && !this.player?.hasItem) {
      // Transfer item from the countertop to the Bumpkin
      const item = this.item;
      (item as Phaser.GameObjects.Sprite).setPosition(
        ITEM_BUMPKIN.x,
        ITEM_BUMPKIN.y
      );
      this.remove(item);
      this.item = null;
      this.player?.pickUpItem(item);
    } else if (!this.item && this.player?.hasItem) {
      // Transfer item from the Bumpkin to the countertop
      const item = this.player?.dropItem();
      (item as Phaser.GameObjects.Sprite).setPosition(
        this.itemPosition.x,
        this.itemPosition.y
      );
      item && this.add(item);
      this.item = item;
    }
  }
}
