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

export class TrashCanContainer extends Phaser.GameObjects.Container {
  private itemPosition: Coordinates;
  private player?: BumpkinContainer;
  private item: Phaser.GameObjects.Sprite | null;

  constructor({ x, y, frame, itemPosition, scene, player }: Props) {
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.scene = scene;
    this.itemPosition = itemPosition;
    this.player = player;
    this.item = null;

    // Trash Can Highlight Sprite
    const spriteName = "highlights";
    const trashCan = scene.add
      .sprite(-1, 0, spriteName, frame)
      .setVisible(false);

    // Events
    this.on("pointerover", () => trashCan.setVisible(true));
    this.on("pointerout", () => trashCan.setVisible(false));
    this.on("pointerdown", this.removeObject);

    this.setSize(trashCan.width, trashCan.height);
    this.setInteractive({ cursor: "pointer" });
    this.add(trashCan);

    scene.add.existing(this);
  }

  private removeObject() {
    if (!this.item && this.player?.hasItem) {
      // Transfer item from the Bumpkin to the trash can
      const item = this.player?.dropItem();
      (item as Phaser.GameObjects.Sprite)
        .setPosition(this.itemPosition.x, this.itemPosition.y - 2)
        .setScale(ITEM_BUMPKIN.scale);
      this.add(item as Phaser.GameObjects.Sprite);
      this.item = item;

      setTimeout(() => {
        this.remove(item as Phaser.GameObjects.Sprite);
        item?.destroy();
        this.item = null;
      }, 500);
    }
  }
}
