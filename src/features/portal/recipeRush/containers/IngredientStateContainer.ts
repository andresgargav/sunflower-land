import { BaseScene } from "features/world/scenes/BaseScene";
import { IngredientStates } from "../RecipeRushTypes";
import { INGREDIENT_STATES } from "../RecipeRushConstants";
import { findKeyByValue } from "../lib/recipeRushUtils";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
  stateName: IngredientStates;
}

export class IngredientStateContainer extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private stateName: IngredientStates;

  scene: BaseScene;

  constructor({ x, y, scene, stateName }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.stateName = stateName;

    // State Sprite
    const spriteName = "ingredient_states";
    this.sprite = scene.add.sprite(0, 0, spriteName, 0);

    this.add(this.sprite);

    scene.add.existing(this);
  }

  changeState(stateName: IngredientStates) {
    this.stateName = stateName;

    const frame = findKeyByValue(INGREDIENT_STATES, stateName) ?? 0;
    this.sprite.setFrame(frame);
  }

  getState() {
    return this.stateName;
  }
}
