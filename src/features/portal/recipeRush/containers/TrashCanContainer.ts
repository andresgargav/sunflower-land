import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { Coordinates } from "../RecipeRushTypes";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { ITEM_BUMPKIN } from "../RecipeRushConstants";
import { BaseScene } from "features/world/scenes/BaseScene";
import { IngredientContainer } from "./IngredientContainer";
import { RecipeContainer } from "./RecipeContainer";

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
  private item: IngredientContainer | RecipeContainer | null;

  scene: BaseScene;

  constructor({ x, y, frame, itemPosition, scene, player }: Props) {
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.scene = scene;
    this.itemPosition = itemPosition;
    this.player = player;
    this.item = null;

    // Trash Can Highlight Sprite
    const spriteName = "highlights";
    const sprite = scene.add.sprite(-1, 0, spriteName, frame).setVisible(false);

    // Events
    this.on("pointerover", () => sprite.setVisible(true));
    this.on("pointerout", () => sprite.setVisible(false));
    this.on("pointerdown", this.removeItem);

    this.setSize(sprite.width, sprite.height);
    this.setInteractive({ cursor: "pointer" });
    this.add(sprite);

    scene.add.existing(this);
  }

  private removeItem() {
    if (!this.item && this.player?.hasItem) {
      // Transfer item from the Bumpkin to the trash can
      const item = this.player?.dropItem();
      if (
        item instanceof IngredientContainer ||
        item instanceof RecipeContainer
      ) {
        item
          ?.setPosition(this.itemPosition.x, this.itemPosition.y - 2)
          .setScale(ITEM_BUMPKIN.scale);
        item && this.add(item);
        this.item = item;

        setTimeout(() => {
          item && this.remove(item);
          item?.destroy();
          this.item = null;
        }, 500);
      }
    }
  }
}
