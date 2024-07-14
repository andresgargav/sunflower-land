import { BaseScene } from "features/world/scenes/BaseScene";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
}

export class RecipeContainer extends Phaser.GameObjects.Container {
  constructor({ x, y, scene }: Props) {
    super(scene, x, y);
    this.scene = scene;
  }
}
