import { BaseScene } from "features/world/scenes/BaseScene";
import { CookingTools, PositionConfig } from "../RecipeRushTypes";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { CookingToolContainer } from "./CookingToolContainer";
import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import {
  COOKING_TOOLS_INFORMATION,
  ITEM_BUMPKIN,
} from "../RecipeRushConstants";

interface Props {
  x: number;
  y: number;
  frame: number;
  spriteName?: string;
  scene: BaseScene;
  itemPosition: PositionConfig;
  id: number;
  cookingToolYOffset?: number;
  cookingToolName: CookingTools;
  player?: BumpkinContainer;
}

export class CookingToolBaseContainer extends Phaser.GameObjects.Container {
  private itemPosition: PositionConfig;
  private cookingToolYOffset?: number;
  private player?: BumpkinContainer;
  private sprite?: Phaser.GameObjects.Sprite;
  private item: CookingToolContainer | null;

  constructor({
    x,
    y,
    frame,
    spriteName,
    scene,
    itemPosition,
    id,
    cookingToolYOffset,
    cookingToolName,
    player,
  }: Props) {
    super(scene, x + SQUARE_WIDTH / 2, y + SQUARE_WIDTH / 2);
    this.scene = scene;
    this.itemPosition = itemPosition;
    this.cookingToolYOffset = cookingToolYOffset;
    this.player = player;
    this.item = null;

    if (spriteName) {
      // Cooking Tool Base Sprite
      this.sprite = scene.add.sprite(
        this.itemPosition.x,
        this.itemPosition.y,
        spriteName,
        frame,
      );

      // Events
      this.on("pointerdown", this.handleClick);

      this.setSize(this.sprite.width, this.sprite.height);
      this.setInteractive({ cursor: "pointer" });
      this.add(this.sprite);
    }

    const cookingTool = new CookingToolContainer({
      x: itemPosition.x,
      y: itemPosition.y + (cookingToolYOffset || 0),
      scene: scene,
      itemPosition: itemPosition,
      id: id,
      name: cookingToolName,
      player: player,
      ...COOKING_TOOLS_INFORMATION[cookingToolName],
    });

    this.add(cookingTool);

    scene.add.existing(this);
  }

  private handleClick() {
    if (this.item && !this.player?.hasItem) {
      // Transfer item from the Cooking tool base to the Bumpkin
      this.moveItemToPlayer();
    } else if (!this.item && this.player?.hasItem) {
      // Transfer item from the Bumpkin to the Cooking tool base
      this.moveItemToBase();
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

  private moveItemToBase() {
    if (!this.cookingToolYOffset) return;

    const item = this.player?.dropItem();
    item?.adjustDefault(
      this.itemPosition.x,
      this.itemPosition.y + this.cookingToolYOffset,
    );
    item && this.add(item);
    this.item = item as CookingToolContainer;
  }

  setItem(item: CookingToolContainer | null) {
    this.item = item;
  }
}
