import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { INGREDIENTS, ITEM_BUMPKIN } from "../RecipeRushConstants";
import { BaseScene } from "features/world/scenes/BaseScene";
import { IngredientContainer } from "./IngredientContainer";
import { checkDistance } from "../lib/recipeRushUtils";

interface Props {
  x: number;
  y: number;
  frame: number;
  scene: BaseScene;
  player?: BumpkinContainer;
}

export class IngredientBoxContainer extends Phaser.GameObjects.Container {
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;

  scene: BaseScene;

  constructor({ x, y, frame, scene, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;

    // Ingredient Box Sprite
    const spriteName = "ingredient_boxes";
    this.sprite = scene.add.sprite(0, 0, spriteName, frame).setOrigin(0);

    // Events
    this.sprite
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", this.handleClick.bind(this));

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    scene.add.existing(this);
  }

  private handleClick() {
    checkDistance(this, this.player as BumpkinContainer, 30) &&
      this.selectIngredient(Number(this.sprite.frame.name));
  }

  private selectIngredient(ingredientFrame: number) {
    if (this.player?.hasItem) return;

    const ingredient = new IngredientContainer({
      x: ITEM_BUMPKIN.x,
      y: ITEM_BUMPKIN.y,
      frame: ingredientFrame,
      scene: this.scene,
      name: INGREDIENTS[ingredientFrame],
      player: this.player,
    });

    this.player?.pickUpItem(ingredient);
  }
}
