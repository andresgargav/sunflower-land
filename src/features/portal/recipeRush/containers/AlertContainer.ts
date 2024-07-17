import { BaseScene } from "features/world/scenes/BaseScene";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
}

const DURATION = 50;
const DISTANCE = 1;
const DELAY = 5000;

export class AlertContainer extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Image;
  private buzzTween: Phaser.Tweens.TweenChain | null;

  constructor({ x, y, scene }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.buzzTween = null;

    // Alert Sprite
    const spriteName = "expression_alerted";
    this.sprite = scene.add.image(0, 0, spriteName);

    this.add(this.sprite);

    scene.add.existing(this);
  }

  createBuzzTween() {
    this.buzzTween = this.scene.tweens.chain({
      targets: this.sprite,
      tweens: [
        {
          x: this.sprite.x - DISTANCE,
          duration: DURATION,
          ease: "Sine.easeInOut",
        },
        {
          x: this.sprite.x + DISTANCE,
          duration: DURATION,
          ease: "Sine.easeInOut",
        },
        {
          x: this.sprite.x,
          duration: DURATION,
          ease: "Sine.easeInOut",
        },
      ],
      repeat: -1,
      repeatDelay: DELAY,
    });
  }

  destroyBuzzTween() {
    this.buzzTween?.destroy();
    this.buzzTween = null;
  }
}
