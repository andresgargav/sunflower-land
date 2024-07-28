import { BaseScene } from "features/world/scenes/BaseScene";
import {
  ITEM_BUMPKIN,
  ITEM_IDLE_ANIMATION,
  ITEM_WALK_ANIMATION,
} from "../RecipeRushConstants";

export abstract class ItemContainer extends Phaser.GameObjects.Container {
  private verticalMove: Phaser.Tweens.Tween | null;

  scene: BaseScene;

  constructor(scene: BaseScene, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;
    this.verticalMove = null;
  }

  abstract adjustWithPlayer(): void;

  abstract adjustDefault(x: number, y: number): void;

  private getFramePosition = (
    elapsed: number,
    frames: Record<string, number>[]
  ) => {
    let accumulatedDuration = 0;
    for (const frame of frames) {
      if (elapsed <= accumulatedDuration + frame.duration) {
        return frame.y;
      }
      accumulatedDuration += frame.duration;
    }
    return frames[frames.length - 1].y;
  };

  playVerticalMove() {
    if (this.verticalMove) return;

    let startTime = 0;

    const getTotalDuration = (animation: { duration: number }[]) => {
      return animation.reduce((sum, frame) => sum + frame.duration, 0);
    };

    const createTween = (animation: { duration: number; y: number }[]) => {
      const totalDuration = getTotalDuration(animation);

      return this.scene.tweens.add({
        targets: this,
        repeat: -1,
        y: this.y + 3,
        yoyo: true,
        duration: totalDuration / 2,
        onStart: () => (startTime = this.scene.time.now),
        onUpdate: () => {
          const elapsed = this.scene.time.now - startTime;
          this.setY(this.getFramePosition(elapsed, animation));
        },
        onRepeat: () => (startTime = this.scene.time.now),
      });
    };

    const animation = this.scene.isMoving
      ? ITEM_WALK_ANIMATION
      : ITEM_IDLE_ANIMATION;
    this.verticalMove = createTween(animation);
  }

  removeVerticalMove() {
    if (!this.verticalMove) return;

    this.verticalMove.stop();
    this.setY(ITEM_BUMPKIN.y);
    this.verticalMove.destroy();
    this.verticalMove = null;
  }
}
