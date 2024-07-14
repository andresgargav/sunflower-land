import { CookingStates } from "../RecipeRushTypes";
import { BaseScene } from "features/world/scenes/BaseScene";

interface Props {
  x: number;
  y: number;
  frame: number;
  scene: BaseScene;
  name: string;
}

export class IngredientContainer extends Phaser.GameObjects.Container {
  private ingredientName: string;
  private ingredientState: CookingStates;

  sprite: Phaser.GameObjects.Sprite;
  scene: BaseScene;

  constructor({ x, y, frame, scene, name }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.ingredientName = name;
    this.ingredientState = "RAW";

    // Ingredient Sprite
    const spriteName = "ingredients";
    this.sprite = scene.add.sprite(0, 0, spriteName, frame);

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);
  }
}
