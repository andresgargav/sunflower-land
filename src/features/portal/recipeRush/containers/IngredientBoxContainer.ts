import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { ITEM_BUMPKIN } from "../RecipeRushConstants";
import { BaseScene } from "features/world/scenes/BaseScene";

interface Props {
  x: number;
  y: number;
  frame: number;
  scene: BaseScene;
  player?: BumpkinContainer;
}

export class IngredientBoxContainer extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;

  constructor({ x, y, frame, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    // Ingredient Box Sprite
    const spriteName = "ingredient_boxes";
    const ingredientBox = scene.add
      .sprite(0, 0, spriteName, frame)
      .setOrigin(0);

    // Events
    ingredientBox
      .setInteractive({ cursor: "pointer" })
      .on(
        "pointerdown",
        () =>
          this.checkDistanceToPlayer(this, 30) &&
          this.selectIngredient(Number(ingredientBox.frame.name))
      );

    this.setSize(ingredientBox.width, ingredientBox.height);
    this.add(ingredientBox);

    scene.add.existing(this);
  }

  private checkDistanceToPlayer(
    container: Phaser.GameObjects.Container,
    maxDistance: number
  ) {
    const distance = Phaser.Math.Distance.BetweenPoints(
      container,
      this.player as BumpkinContainer
    );

    if (distance > maxDistance) return false;
    return true;
  }

  private selectIngredient(ingredientFrame: number) {
    if (!this.player?.hasItem) {
      const spriteName = "ingredients";
      const ingredient = this.scene.add
        .sprite(ITEM_BUMPKIN.x, ITEM_BUMPKIN.y, spriteName, ingredientFrame)
        .setScale(ITEM_BUMPKIN.scale);

      this.player?.pickUpItem(ingredient);
    }
  }
}
