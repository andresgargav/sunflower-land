import { SQUARE_WIDTH } from "features/game/lib/constants";
import { SpeechBubble } from "./SpeechBubble";
import { tokenUriBuilder } from "lib/utils/tokenUriBuilder";
import { Label } from "./Label";
import debounce from "lodash.debounce";
import { Player } from "../types/Room";
import { NPCName, acknowledgedNPCs } from "lib/npcs";
import { ReactionName } from "features/pumpkinPlaza/components/Reactions";
import { getAnimationUrl } from "../lib/animations";
import { ItemContainer } from "../../portal/recipeRush/RecipeRushTypes";

const NAME_ALIASES: Partial<Record<NPCName, string>> = {
  "pumpkin' pete": "pete",
  "hammerin harry": "auctioneer",
};
const NPCS_WITH_ALERTS: Partial<Record<NPCName, boolean>> = {
  "pumpkin' pete": true,
  hank: true,
  santa: true,
};

export class BumpkinContainer extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite | undefined;
  public shadow: Phaser.GameObjects.Sprite | undefined;
  public alert: Phaser.GameObjects.Sprite | undefined;
  public silhouette: Phaser.GameObjects.Sprite | undefined;
  public skull: Phaser.GameObjects.Sprite | undefined;

  public speech: SpeechBubble | undefined;
  public reaction: Phaser.GameObjects.Sprite | undefined;
  public invincible = false;

  public icon: Phaser.GameObjects.Sprite | undefined;
  public fx: Phaser.GameObjects.Sprite | undefined;

  public clothing: Player["clothing"];
  private ready = false;

  // Animation Keys
  private idleSpriteKey: string | undefined;
  private walkingSpriteKey: string | undefined;
  private cookingSpriteKey: string | undefined;
  private carryingSpriteKey: string | undefined;
  private carryingIdleSpriteKey: string | undefined;
  private idleAnimationKey: string | undefined;
  private walkingAnimationKey: string | undefined;
  private cookingAnimationKey: string | undefined;
  private carryingAnimationKey: string | undefined;
  private carryingIdleAnimationKey: string | undefined;
  private direction: "left" | "right" = "right";

  // Recipe Rush
  public hasItem = false;
  public item: ItemContainer | null;
  private _isCooking = false;

  constructor({
    scene,
    x,
    y,
    clothing,
    onClick,
    name,
    direction,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    clothing: Player["clothing"];
    onClick?: () => void;
    onCollide?: () => void;
    name?: string;
    direction?: "left" | "right";
  }) {
    super(scene, x, y);
    this.scene = scene;
    this.clothing = clothing;
    this.direction = direction ?? "right";
    scene.physics.add.existing(this);

    this.silhouette = scene.add.sprite(0, 0, "silhouette");
    this.add(this.silhouette);
    this.sprite = this.silhouette;
    this.item = null;

    this.loadSprites(scene);

    this.shadow = this.scene.add
      .sprite(0.5, 8, "shadow")
      .setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    this.add(this.shadow);

    this.setSize(SQUARE_WIDTH, SQUARE_WIDTH);

    if (name) {
      const text = NAME_ALIASES[name as NPCName] ?? name;
      const label = new Label(this.scene, text.toUpperCase());
      this.add(label);
      label.setPosition(label.width / 2, -16);
      if (
        !!NPCS_WITH_ALERTS[name as NPCName] &&
        !acknowledgedNPCs()[name as NPCName] &&
        this.scene.textures.exists("alert")
      ) {
        this.alert = this.scene.add.sprite(1, -23, "alert").setSize(4, 10);
        this.add(this.alert);
      }
    }

    this.scene.add.existing(this);

    if (onClick) {
      this.setInteractive({ cursor: "pointer" }).on(
        "pointerdown",
        (p: Phaser.Input.Pointer) => {
          if (p.downElement.nodeName === "CANVAS") {
            onClick();

            if (name && this.alert?.active) {
              this.alert?.destroy();
            }
          }
        }
      );
    }

    if (clothing.shirt === "Gift Giver") {
      this.showGift();
    }
  }

  public teleport(x: number, y: number) {
    this.setPosition(x, y);
  }

  get directionFacing() {
    return this.direction;
  }

  get isWalking() {
    return !!this.sprite?.anims?.currentAnim?.key?.includes("bumpkin-walking");
  }

  private async loadSprites(scene: Phaser.Scene) {
    const keyName = tokenUriBuilder(this.clothing);
    this.idleSpriteKey = `${keyName}-bumpkin-idle-sheet`;
    this.walkingSpriteKey = `${keyName}-bumpkin-walking-sheet`;
    this.cookingSpriteKey = `${keyName}-bumpkin-cooking-sheet`;
    this.carryingSpriteKey = `${keyName}-bumpkin-carrying-sheet`;
    this.carryingIdleSpriteKey = `${keyName}-bumpkin-carrying-idle-sheet`;
    this.idleAnimationKey = `${keyName}-bumpkin-idle`;
    this.walkingAnimationKey = `${keyName}-bumpkin-walking`;
    this.cookingAnimationKey = `${keyName}-bumpkin-cooking`;
    this.carryingAnimationKey = `${keyName}-bumpkin-carrying`;
    this.carryingIdleAnimationKey = `${keyName}-bumpkin-carrying-idle`;

    // const { sheets } = await buildNPCSheets({
    //   parts: this.clothing,
    // });

    // Idle
    if (scene.textures.exists(this.idleSpriteKey)) {
      const idle = scene.add.sprite(0, 0, this.idleSpriteKey).setOrigin(0.5);
      this.add(idle);
      this.sprite = idle;

      if (this.direction === "left") {
        this.faceLeft();
      }

      this.sprite.play(this.idleAnimationKey, true);

      if (this.silhouette?.active) {
        this.silhouette?.destroy();
      }

      this.ready = true;
    } else {
      const url = getAnimationUrl(this.clothing, "idle");
      const idleLoader = scene.load.spritesheet(this.idleSpriteKey, url, {
        frameWidth: 96,
        frameHeight: 64,
      });

      idleLoader.addListener(Phaser.Loader.Events.COMPLETE, () => {
        if (
          !scene.textures.exists(this.idleSpriteKey as string) ||
          this.ready
        ) {
          return;
        }

        const idle = scene.add
          .sprite(0, 2, this.idleSpriteKey as string)
          .setOrigin(0.5);
        this.add(idle);
        this.sprite = idle;

        if (this.direction === "left") {
          this.faceLeft();
        }

        this.createIdleAnimation();
        this.sprite.play(this.idleAnimationKey as string, true);

        this.ready = true;
        if (this.silhouette?.active) {
          this.silhouette?.destroy();
        }

        idleLoader.removeAllListeners();
      });
    }

    // Walk
    if (scene.textures.exists(this.walkingSpriteKey)) {
      this.createWalkingAnimation();
    } else {
      const url = getAnimationUrl(this.clothing, "walking");
      const walkingLoader = scene.load.spritesheet(this.walkingSpriteKey, url, {
        frameWidth: 96,
        frameHeight: 64,
      });

      walkingLoader.on(Phaser.Loader.Events.COMPLETE, () => {
        this.createWalkingAnimation();
        walkingLoader.removeAllListeners();
      });
    }

    // Cook
    if (scene.textures.exists(this.cookingSpriteKey)) {
      this.createCookingAnimation();
    } else {
      const url = getAnimationUrl(this.clothing, "doing");
      const cookingLoader = scene.load.spritesheet(this.cookingSpriteKey, url, {
        frameWidth: 96,
        frameHeight: 64,
      });

      cookingLoader.on(Phaser.Loader.Events.COMPLETE, () => {
        this.createCookingAnimation();
        cookingLoader.removeAllListeners();
      });
    }

    // Carry
    if (scene.textures.exists(this.carryingSpriteKey)) {
      this.createCarryingAnimation();
    } else {
      const url = getAnimationUrl(this.clothing, "carry_none");
      const carryingLoader = scene.load.spritesheet(
        this.carryingSpriteKey,
        url,
        {
          frameWidth: 96,
          frameHeight: 64,
        }
      );

      carryingLoader.on(Phaser.Loader.Events.COMPLETE, () => {
        this.createCarryingAnimation();
        carryingLoader.removeAllListeners();
      });
    }

    // Carry idle
    if (scene.textures.exists(this.carryingIdleSpriteKey)) {
      this.createCarryingIdleAnimation();
    } else {
      const url = getAnimationUrl(this.clothing, "carry_none");
      const carryingIdleLoader = scene.load.spritesheet(
        this.carryingIdleSpriteKey,
        url,
        {
          frameWidth: 96,
          frameHeight: 64,
        }
      );

      carryingIdleLoader.on(Phaser.Loader.Events.COMPLETE, () => {
        this.createCarryingIdleAnimation();
        carryingIdleLoader.removeAllListeners();
      });
    }

    scene.load.start();
  }

  private createIdleAnimation() {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.idleAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(
        this.idleSpriteKey as string,
        {
          start: 0,
          end: 8,
        }
      ),
      repeat: -1,
      frameRate: 10,
    });
  }

  private createWalkingAnimation() {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.walkingAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(
        this.walkingSpriteKey as string,
        {
          start: 0,
          end: 7,
        }
      ),
      repeat: -1,
      frameRate: 10,
    });
  }

  private createCookingAnimation() {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.cookingAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(
        this.cookingSpriteKey as string,
        {
          start: 0,
          end: 7,
        }
      ),
      repeat: -1,
      frameRate: 10,
    });
  }

  private createCarryingAnimation() {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.carryingAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(
        this.carryingSpriteKey as string,
        {
          start: 0,
          end: 7,
        }
      ),
      repeat: -1,
      frameRate: 10,
    });
  }

  private createCarryingIdleAnimation() {
    if (!this.scene || !this.scene.anims) return;

    this.scene.anims.create({
      key: this.carryingIdleAnimationKey,
      frames: this.scene.anims.generateFrameNumbers(
        this.carryingIdleSpriteKey as string,
        {
          start: 0,
          end: 1,
        }
      ),
      repeat: -1,
      frameRate: 3,
    });
  }

  public changeClothing(clothing: Player["clothing"]) {
    if (!this.ready) return;
    if (this.clothing.updatedAt === clothing.updatedAt) return;
    this.clothing.updatedAt = clothing.updatedAt;

    if (tokenUriBuilder(clothing) === tokenUriBuilder(this.clothing)) return;

    this.ready = false;
    if (this.sprite?.active) {
      this.sprite?.destroy();
    }

    if (
      this.clothing.shirt !== "Gift Giver" &&
      clothing.shirt === "Gift Giver"
    ) {
      this.showGift();
    }

    if (
      this.clothing.shirt === "Gift Giver" &&
      clothing.shirt !== "Gift Giver"
    ) {
      this.removeGift();
    }

    this.clothing = clothing;
    this.loadSprites(this.scene);

    this.showSmoke();
  }

  public showGift() {
    if (this.icon) {
      this.removeGift();
    }

    this.icon = this.scene.add.sprite(0, -12, "gift_icon").setOrigin(0.5);
    this.add(this.icon);

    if (this.scene.textures.exists("sparkle")) {
      this.fx = this.scene.add.sprite(0, -8, "sparkle").setOrigin(0.5).setZ(10);
      this.add(this.fx);

      this.scene.anims.create({
        key: `sparkel_anim`,
        frames: this.scene.anims.generateFrameNumbers("sparkle", {
          start: 0,
          end: 20,
        }),
        repeat: -1,
        frameRate: 10,
      });

      this.fx.play(`sparkel_anim`, true);
    }
  }

  private removeGift() {
    if (this.icon?.active) {
      this.icon.destroy();
    }

    this.icon = undefined;

    if (this.fx?.active) {
      this.fx.destroy();
    }

    this.fx = undefined;
  }

  public faceRight() {
    if (this.sprite?.scaleX === 1) return;

    this.direction = "right";
    this.sprite?.setScale(1, 1);

    if (this.speech) {
      this.speech.setScale(1, 1);
      this.speech.changeDirection("right");
    }
  }

  public faceLeft() {
    if (this.sprite?.scaleX === -1) return;

    this.direction = "left";
    this.sprite?.setScale(-1, 1);

    if (this.speech) {
      this.speech.changeDirection("left");
    }
  }

  /**
   * Use a debouncer to allow players new messages not to be destroyed by old timeouts
   */
  destroySpeechBubble = debounce(() => {
    this.stopSpeaking();
  }, 5000);

  /**
   * Use a debouncer to allow players new messages not to be destroyed by old timeouts
   */
  destroyReaction = debounce(() => {
    this.stopReaction();
  }, 5000);

  public stopReaction() {
    if (this.reaction?.active) {
      this.reaction?.destroy();
    }
    this.reaction = undefined;

    this.destroyReaction.cancel();
  }
  public stopSpeaking() {
    if (this.speech?.active) {
      this.speech?.destroy();
    }
    this.speech = undefined;

    this.destroySpeechBubble.cancel();
  }

  public speak(text: string) {
    this.stopReaction();

    if (this.speech?.active) {
      this.speech.destroy();
    }

    this.speech = new SpeechBubble(
      this.scene,
      text,
      this.sprite?.scaleX === 1 ? "right" : "left"
    );
    this.add(this.speech);

    this.destroySpeechBubble();
  }

  public react(react: ReactionName) {
    this.stopSpeaking();

    if (this.reaction?.active) {
      this.reaction.destroy();
    }

    if (!this.scene.textures.exists(react)) {
      return;
    }

    this.reaction = this.scene.add.sprite(0, -14, react);

    this.add(this.reaction);

    this.destroyReaction();
  }

  public walk() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.walkingAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.walkingAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.walkingAnimationKey as string, true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Bumpkin Container: Error playing walk animation: ", e);
      }
    }
  }

  public idle() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.idleAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.idleAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.idleAnimationKey as string, true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Bumpkin Container: Error playing idle animation: ", e);
      }
    }
  }

  public hitPlayer() {
    this.invincible = true;

    // make sprite flash opacity
    const tween = this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      duration: 100,
      ease: "Linear",
      repeat: -1,
      yoyo: true,
    });

    setTimeout(() => {
      this.invincible = false;

      if (tween && tween.isPlaying()) {
        tween.remove();
      }
    }, 2000);
  }

  private destroyed = false;
  public disappear() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const container = this;

    if (container.destroyed || !container.scene || !container.active) {
      return;
    }

    this.destroyed = true;

    if (this.sprite?.active) {
      this.sprite?.destroy();
    }
    if (this.shadow?.active) {
      this.shadow?.destroy();
    }

    const poof = this.scene.add.sprite(0, 4, "poof").setOrigin(0.5);
    this.add(poof);

    this.scene.anims.create({
      key: `poof_anim`,
      frames: this.scene.anims.generateFrameNumbers("poof", {
        start: 0,
        end: 8,
      }),
      repeat: 0,
      frameRate: 10,
    });

    poof.play(`poof_anim`, true);

    // Listen for the animation complete event
    poof.on("animationcomplete", function (animation: { key: string }) {
      if (animation.key === "poof_anim" && container.active) {
        container.destroy();
      }
    });
  }

  public showSmoke() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const container = this;

    if (container.destroyed || !container.scene) {
      return;
    }

    if (container.scene.textures.exists("smoke")) {
      const poof = this.scene.add.sprite(0, 4, "smoke").setOrigin(0.5);
      this.add(poof);

      this.scene.anims.create({
        key: `smoke_anim`,
        frames: this.scene.anims.generateFrameNumbers("smoke", {
          start: 0,
          end: 20,
        }),
        repeat: -1,
        frameRate: 10,
      });

      poof.play(`smoke_anim`, true);

      // Listen for the animation complete loop event
      poof.on("animationrepeat", function (animation: { key: string }) {
        if (animation.key === "smoke_anim" && container.ready && poof.active) {
          // This block will execute every time the animation loop completes
          poof.destroy();
        }
      });
    }
  }

  public addOnClick(onClick: () => void) {
    this.setInteractive({ cursor: "pointer" }).on(
      "pointerdown",
      (p: Phaser.Input.Pointer) => {
        if (p.downElement.nodeName === "CANVAS") {
          onClick();
        }
      }
    );
  }

  // Recipe Rush
  get isCooking(): boolean {
    return this._isCooking;
  }

  set isCooking(value: boolean) {
    this._isCooking = value;
  }

  public cook() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.cookingAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.cookingAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.cookingAnimationKey as string, true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Bumpkin Container: Error playing cook animation: ", e);
      }
    }
  }

  public carry() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.carryingAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.carryingAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.carryingAnimationKey as string, true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("Bumpkin Container: Error playing carry animation: ", e);
      }
    }
  }

  public carryIdle() {
    if (
      this.sprite?.anims &&
      this.scene?.anims.exists(this.carryingIdleAnimationKey as string) &&
      this.sprite?.anims.getName() !== this.carryingIdleAnimationKey
    ) {
      try {
        this.sprite.anims.play(this.carryingIdleAnimationKey as string, true);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(
          "Bumpkin Container: Error playing carry idle animation: ",
          e
        );
      }
    }
  }

  public pickUpItem(item: ItemContainer) {
    this.item = item;
    this.add(item);
    this.hasItem = true;
  }

  public dropItem() {
    const item = this.item;
    this.item = null;
    this.hasItem = false;
    return item;
  }
}
