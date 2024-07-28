import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { Coordinates } from "../RecipeRushTypes";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { ITEM_BUMPKIN } from "../RecipeRushConstants";
import { BaseScene } from "features/world/scenes/BaseScene";
import { ItemContainer } from "./ItemContainer";

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
  private item: ItemContainer | null;

  scene: BaseScene;

  constructor({ x, y, frame, itemPosition, scene, player }: Props) {
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.scene = scene;
    this.itemPosition = itemPosition;
    this.player = player;
    this.item = null;

    // Countertop Highlight Sprite
    const spriteName = "highlights";
    const sprite = scene.add.sprite(0, 0, spriteName, frame).setVisible(false);

    // Events
    this.on("pointerover", () => sprite.setVisible(true));
    this.on("pointerout", () => sprite.setVisible(false));
    this.on("pointerdown", this.handleClick);

    this.setSize(sprite.width, sprite.height);
    this.setInteractive({ cursor: "pointer" });
    this.add(sprite);

    scene.add.existing(this);
  }

  private handleClick() {
    if (this.item && !this.player?.hasItem) {
      // Transfer item from the countertop to the Bumpkin
      this.moveItemToPlayer();
    } else if (!this.item && this.player?.hasItem) {
      // Transfer item from the Bumpkin to the countertop
      this.moveItemToCountertop();
    }
  }

  private moveItemToPlayer() {
    if (!this.item) return;

    const item = this.item;
    item.setPosition(ITEM_BUMPKIN.x, ITEM_BUMPKIN.y);
    this.remove(item);
    this.item = null;
    this.player?.pickUpItem(item);
  }

  private moveItemToCountertop() {
    const item = this.player?.dropItem();
    item?.adjustDefault(this.itemPosition.x, this.itemPosition.y);
    item && this.add(item);
    this.item = item as ItemContainer;
  }
}
