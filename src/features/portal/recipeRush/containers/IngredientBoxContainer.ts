import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { INGREDIENTS, ITEM_BUMPKIN } from "../RecipeRushConstants";
import { BaseScene } from "features/world/scenes/BaseScene";
import { IngredientContainer } from "./IngredientContainer";

interface Props {
  x: number;
  y: number;
  frame: number;
  scene: BaseScene;
  player?: BumpkinContainer;
}

export class IngredientBoxContainer extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;

  scene: BaseScene;

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
    if (this.player?.hasItem) return;

    const ingredient = new IngredientContainer({
      x: ITEM_BUMPKIN.x,
      y: ITEM_BUMPKIN.y,
      frame: ingredientFrame,
      scene: this.scene,
      name: INGREDIENTS[ingredientFrame],
    });

    this.player?.pickUpItem(ingredient);
  }
}
