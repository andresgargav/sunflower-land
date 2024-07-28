import mapJSON from "assets/map/beach.json";

import { SceneId } from "../mmoMachine";
import { BaseScene, NPCBumpkin } from "./BaseScene";
import { SUNNYSIDE } from "assets/sunnyside";
import { FishermanContainer } from "../containers/FishermanContainer";
import { interactableModalManager } from "../ui/InteractableModals";
import { translate } from "lib/i18n/translate";
import { InventoryItemName } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { gameAnalytics } from "lib/gameAnalytics";
import {
  BeachBountyTreasure,
  SELLABLE_TREASURE,
} from "features/game/types/treasure";
import { getUTCDateString } from "lib/utils/time";
import { BumpkinContainer } from "../containers/BumpkinContainer";
import { getKeys } from "features/game/types/decorations";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  DESERT_GRID_HEIGHT,
  DESERT_GRID_WIDTH,
  DIGGING_FORMATIONS,
  secondsTillDesertStorm,
} from "features/game/types/desert";
import { ProgressBarContainer } from "../containers/ProgressBarContainer";
import { npcModalManager } from "../ui/NPCModals";
import { hasReadDesertNotice as hasReadDesertNotice } from "../ui/beach/DesertNoticeboard";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import Decimal from "decimal.js-light";
import { isTouchDevice } from "../lib/device";

const convertToSnakeCase = (str: string) => {
  return str.replace(" ", "_").toLowerCase();
};

const BUMPKINS: NPCBumpkin[] = [
  {
    npc: "pharaoh",
    x: 36,
    y: 86,
  },
  {
    npc: "petro",
    x: 480,
    y: 80,
    direction: "left",
  },
  {
    npc: "old salty",
    x: 38,
    y: 262,
  },
  {
    npc: "digby",
    x: 336,
    y: 219,
    direction: "left",
  },
  {
    npc: "finn",
    x: 174,
    y: 598,
  },
  {
    npc: "finley",
    x: 202,
    y: 470,
    direction: "left",
  },
  {
    npc: "tango",
    x: 496,
    y: 401,
  },
  {
    npc: "jafar",
    x: 478,
    y: 220,
    direction: "left",
  },
  {
    // To remove on digging release
    npc: "goldtooth",
    x: 384,
    y: 335,
  },
  {
    npc: "corale",
    x: 215,
    y: 750,
  },
  {
    x: 418,
    y: 487,
    npc: "miranda",
  },
];

export type DigAnalytics = {
  outputCoins: number;
  percentageFound: number;
};

const TOTAL_DIGS = 25;
const SITE_COLS = DESERT_GRID_WIDTH;
const SITE_ROWS = DESERT_GRID_HEIGHT;

export class BeachScene extends BaseScene {
  sceneId: SceneId = "beach";
  archeologicalData: (InventoryItemName | undefined)[][] = [];
  hoverBox: Phaser.GameObjects.Image | undefined;
  confirmBox: Phaser.GameObjects.Image | undefined;
  drillHoverBox: Phaser.GameObjects.Image | undefined;
  drillConfirmBox: Phaser.GameObjects.Image | undefined;
  noShovelHoverBox: Phaser.GameObjects.Image | undefined;
  treasureContainer: Phaser.GameObjects.Container | undefined;
  selectedToolLabel: Phaser.GameObjects.Text | undefined;
  gridX = 160;
  gridY = 128;
  cellSize = 16;
  digOffsetX = 7;
  digOffsetY = 3;
  drillOffsetX = 2;
  drillOffsetY = -6;
  digsRemainingLabel: Phaser.GameObjects.Text | undefined;
  percentageFoundLabel: Phaser.GameObjects.Text | undefined;
  digStatistics: DigAnalytics | undefined;
  isPlayerTweening = false;
  digbyProgressBar: ProgressBarContainer | undefined;
  desertStormTimer: NodeJS.Timeout | undefined;
  dugItems: Phaser.GameObjects.Image[] = [];
  currentSelectedItem: InventoryItemName | undefined;
  isRevealing = false;
  coordsToDig:
    | { x: number; y: number }
    | { x: number; y: number }[]
    | undefined = [];

  constructor() {
    super({ name: "beach", map: { json: mapJSON } });
  }

  preload() {
    super.preload();

    this.load.image("question_disc", "world/question_disc.png");

    this.load.image("empty_progress_bar", "world/empty_bar.png");

    this.load.image("heart", SUNNYSIDE.icons.heart);
    this.load.image("palm_tree", "world/palm_tree.webp");

    this.load.image("wooden_chest", "world/wooden_chest.png");
    this.load.image("locked_disc", "world/locked_disc.png");
    this.load.image("rare_key_disc", "world/rare_key_disc.png");

    this.load.spritesheet("beach_bud", "world/turtle.png", {
      frameWidth: 15,
      frameHeight: 17,
    });

    this.load.spritesheet("beach_bud_2", "world/beach_bud_2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("beach_bud_3", "world/beach_bud_3.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("bird", SUNNYSIDE.animals.bird, {
      frameWidth: 16,
      frameHeight: 17,
    });

    this.load.spritesheet("blinking", SUNNYSIDE.vfx.blinking, {
      frameWidth: 16,
      frameHeight: 16,
    });

    // "misty" NPC fisher
    this.load.spritesheet("fisher", SUNNYSIDE.npcs.fishing_sheet, {
      frameWidth: 58,
      frameHeight: 50,
    });

    // fishing weather icons
    this.load.image("fish_frenzy", "world/lightning.png");
    this.load.image("full_moon", "world/full_moon.png");
    // Treasures
    this.load.image("sea_cucumber", SUNNYSIDE.resource.sea_cucumber);
    this.load.image("starfish", SUNNYSIDE.resource.starfish);
    this.load.image("coral", SUNNYSIDE.resource.coral);
    this.load.image("pearl", "world/pearl.webp");
    this.load.image("pirate_bounty", SUNNYSIDE.resource.pirate_bounty);
    this.load.image("seaweed", "world/seaweed.webp");
    this.load.image("pipi", "world/pipi.webp");
    this.load.image("crab", SUNNYSIDE.resource.crab);
    this.load.image("nothing", SUNNYSIDE.icons.close);
    this.load.image("clam_shell", SUNNYSIDE.resource.clam_shell);
    this.load.image("wood", SUNNYSIDE.resource.wood);
    this.load.image("wooden_compass", "world/wooden_compass.webp");
    this.load.image("old_bottle", "world/old_bottle.png");
    this.load.image("camel_bone", "world/camel_bone.webp");
    this.load.image("cockle_shell", "world/cockle_shell.webp");
    this.load.image("hieroglyph", "world/hieroglyph.webp");
    this.load.image("vase", "world/vase.webp");
    this.load.image("scarab", "world/scarab.webp");
    this.load.image("sand", "world/sand.webp");

    this.load.image("select_box", "world/select_box.png");
    this.load.image("shovel_select", "world/shovel_select.webp");
    this.load.image("confirm_select", "world/confirm_select.webp");
    this.load.image("drill_confirm", "world/drill_confirm.webp");
    this.load.image("drill_select", "world/drill_select.webp");
    this.load.image("button", "world/button.webp");
    this.load.image("shovel", "world/shovel.png");
    this.load.image("treasure_shop", "world/treasure_shop.png");
    this.load.image("shop_icon", "world/shop_disc.png");
  }

  async create() {
    this.map = this.make.tilemap({
      key: "beach",
    });
    super.create();

    const filteredBumpkins = BUMPKINS.filter((bumpkin) => {
      // Show new NPC(Desert Merchant) if you're beta tester
      if (bumpkin.npc === "jafar") {
        return hasFeatureAccess(
          this.gameService.state.context.state,
          "TEST_DIGGING"
        );
      }
      if (bumpkin.npc === "goldtooth") {
        return !hasFeatureAccess(
          this.gameService.state.context.state,
          "TEST_DIGGING"
        );
      }
      return true;
    });

    this.initialiseNPCs(filteredBumpkins);

    this.digbyProgressBar = new ProgressBarContainer(this, 337, 234);

    const fisher = new FishermanContainer({
      x: 402,
      y: 791,
      scene: this,
      weather: this.gameState.fishing.weather,
    });
    fisher.setDepth(100000000);
    this.physics.world.enable(fisher);
    this.colliders?.add(fisher);
    this.triggerColliders?.add(fisher);
    (fisher.body as Phaser.Physics.Arcade.Body)
      .setSize(12, 16)
      .setOffset(12, 11)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    const turtle = this.add.sprite(408, 595, "beach_bud");
    turtle.setScale(-1, 1);
    this.anims.create({
      key: "turtle_bud_anim",
      frames: this.anims.generateFrameNumbers("beach_bud", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    turtle.play("turtle_bud_anim", true);

    const treasureShop = this.add.sprite(464, 194, "treasure_shop");
    this.physics.world.enable(treasureShop);
    this.colliders?.add(treasureShop);
    this.triggerColliders?.add(treasureShop);
    (treasureShop.body as Phaser.Physics.Arcade.Body)
      .setSize(69, 50)
      .setOffset(0, 0)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    this.add.sprite(464, 174, "shop_icon");
    treasureShop.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(treasureShop, 75)) {
        npcModalManager.open("jafar");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    const beachBud2 = this.add.sprite(348, 397, "beach_bud_2");
    // turtle.setScale(-1, 1);
    this.anims.create({
      key: "beach_bud_2_anim",
      frames: this.anims.generateFrameNumbers("beach_bud_2", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    beachBud2.play("beach_bud_2_anim", true);

    const beachBud3 = this.add.sprite(500, 652, "beach_bud_3");
    this.anims.create({
      key: "beach_bud_3_anim",
      frames: this.anims.generateFrameNumbers("beach_bud_3", {
        start: 0,
        end: 8,
      }),
      repeat: -1,
      frameRate: 10,
    });
    beachBud3.play("beach_bud_3_anim", true);

    const blinking = this.add.sprite(399, 36, "blinking");
    this.anims.create({
      key: "blinking_anim",
      frames: this.anims.generateFrameNumbers("blinking", {
        start: 0,
        end: 12,
      }),
      repeat: -1,
      frameRate: 5,
    });
    blinking.play("blinking_anim", true);

    const bird = this.add.sprite(398, 540, "bird");
    bird.setDepth(1000000000);
    this.anims.create({
      key: "bird_anim",
      frames: this.anims.generateFrameNumbers("bird", {
        start: 0,
        end: 4,
      }),
      repeat: -1,
      frameRate: 5,
    });
    bird.play("bird_anim", true);

    if (this.gameState.inventory["Rare Key"]) {
      this.add.sprite(400, 660, "rare_key_disc").setDepth(1000000000);
    } else {
      this.add.sprite(400, 660, "locked_disc").setDepth(1000000000);
    }

    const chest = this.add.sprite(400, 680, "wooden_chest");
    chest.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
      if (this.checkDistanceToSprite(chest, 75)) {
        interactableModalManager.open("rare_chest");
      } else {
        this.currentPlayer?.speak(translate("base.iam.far.away"));
      }
    });

    if (
      hasFeatureAccess(this.gameService.state.context.state, "TEST_DIGGING")
    ) {
      this.setUpDigSite();
    } else {
      const blockingTree = this.add.sprite(384, 322, "palm_tree");
      this.physics.world.enable(blockingTree);
      this.colliders?.add(blockingTree);
      (blockingTree.body as Phaser.Physics.Arcade.Body)
        .setSize(32, 16)
        .setOffset(0, 16)
        .setImmovable(true)
        .setCollideWorldBounds(true);
    }

    if (!hasReadDesertNotice()) {
      this.add.image(424, 267, "question_disc").setDepth(1000000);
    }

    this.desertStormTimer = setTimeout(() => {
      // Trigger a no op save event to fetch latest patterns
      this.gameService.send("kingdomChores.refreshed");
      this.gameService.send("SAVE");

      this.resetSite();
    }, secondsTillDesertStorm() * 1000);

    // Shut down the sound when the scene changes
    this.events.once("shutdown", () => {
      this.sound.getAllPlaying().forEach((sound) => {
        sound.destroy();
      });

      if (this.desertStormTimer) {
        clearTimeout(this.desertStormTimer);
      }
    });
    this.currentSelectedItem = this.selectedItem;
  }

  public setUpDigSite = () => {
    // set up visual grid overlay
    this.add
      .grid(
        this.gridX,
        this.gridY,
        SITE_COLS * this.cellSize,
        SITE_ROWS * this.cellSize,
        this.cellSize,
        this.cellSize
      )
      .setOrigin(0);

    // set up cells
    for (let row = 0; row < SITE_ROWS; row++) {
      for (let col = 0; col < SITE_COLS; col++) {
        const rectX = this.gridX + col * this.cellSize;
        const rectY = this.gridY + row * this.cellSize;

        // Remove interactive while revealing??
        this.add
          .rectangle(rectX, rectY, this.cellSize, this.cellSize, 0xfff, 0)
          .setStrokeStyle(1, 0xe3d672)
          .setOrigin(0)
          .setInteractive({ cursor: "pointer" })
          .on("pointerdown", (e: any) => {
            // Touch devices have a different interaction for the sand drill
            if (isTouchDevice() && this.selectedItem === "Sand Drill") {
              this.handleMobileTouchDrill({
                mouseX: e.worldX,
                mouseY: e.worldY,
                rectX,
                rectY,
              });

              return;
            }

            if (this.selectedItem === "Sand Drill") {
              this.handleDrillPointerDown(rectX, rectY);
            } else {
              this.handlePointerDown({ rectX, rectY, row, col });
            }
          })
          .on("pointermove", (e: any) => {
            if (isTouchDevice()) return;

            if (this.selectedItem === "Sand Drill") {
              return this.handleDrillPointerOver({
                mouseX: e.worldX,
                mouseY: e.worldY,
              });
            }

            // If the selected item is not a shovel then set it as the selected itm
            // If the player does not have any shovels then trigger the npc to say something about this

            if (this.selectedItem !== "Sand Shovel") {
              this.shortcutItem("Sand Shovel");
            }

            this.handlePointerOver({ rectX, rectY, row, col });
          })
          .on("pointerout", () => this.handlePointOut());
      }
    }

    this.populateDugItems();
    this.updateDiggingLabels();
    // Add the hover and selected select boxes
    this.hoverBox = this.add
      .image(0, 0, "shovel_select")
      .setOrigin(0)
      .setDisplaySize(16, 16)
      .setVisible(false);

    this.confirmBox = this.add
      .image(0, 0, "confirm_select")
      .setOrigin(0)
      .setDisplaySize(16, 16)
      .setVisible(false);

    this.drillHoverBox = this.add
      .image(0, 0, "drill_select")
      .setOrigin(0)
      .setDisplaySize(32, 32)
      .setVisible(false);

    this.drillConfirmBox = this.add
      .image(0, 0, "drill_confirm")
      .setOrigin(0)
      .setDisplaySize(32, 32)
      .setVisible(false);

    this.noShovelHoverBox = this.add
      .image(0, 0, "nothing")
      .setOrigin(0)
      .setDisplaySize(8, 8)
      .setVisible(false);

    // Add testing metric labels
    this.digsRemainingLabel = this.add.text(
      188,
      111,
      `Digs remaining: ${this.allowedDigs - this.holesDugCount}`,
      {
        fontSize: "6px",
        fontFamily: "monospace",
        padding: { x: 0, y: 2 },
        resolution: 4,
        color: "black",
      }
    );
    this.percentageFoundLabel = this.add.text(
      188,
      120,
      `Treasure found: ${this.percentageTreasuresFound}%`,
      {
        fontSize: "4px",
        fontFamily: "monospace",
        padding: { x: 0, y: 2 },
        resolution: 4,
        color: "black",
      }
    );

    // Add a digging sound effect

    // Allow click through of bumpkin
    const player = this.currentPlayer as BumpkinContainer;

    player.on("pointerover", () => {
      this.handlePointerOver({ rectX: player.x, rectY: player.y });
    });
  };

  private resetSite = async () => {
    // Remove dug items
    this.dugItems.forEach((item) => {
      this.showPoof({ x: item.x, y: item.y });
      item.destroy();
    });

    this.dugItems = [];
  };

  showPoof({ x, y }: Coordinates) {
    const poof = this.add.sprite(x, y, "poof").setDepth(1000000);

    this.anims.create({
      key: `poof_anim`,
      frames: this.anims.generateFrameNumbers("poof", {
        start: 0,
        // TODO - buds with longer animation frames?
        end: 8,
      }),
      repeat: 0,
      frameRate: 10,
    });

    poof.play(`poof_anim`, true);

    // Listen for the animation complete event
    poof.on("animationcomplete", function (animation: { key: string }) {
      if (animation.key === "poof_anim" && poof.active) {
        // Animation 'poof_anim' has completed, destroy the sprite
        poof.destroy();
      }
    });
  }

  public populateDugItems = () => {
    const { grid: revealed } =
      this.gameService.state.context.state.desert.digging ?? [];

    revealed.flat().forEach((hole) => {
      const { x, y, items } = hole;

      const offsetX = x * this.cellSize + this.gridX + this.cellSize / 2;
      const offsetY = y * this.cellSize + this.gridY + this.cellSize / 2;

      const foundItem = getKeys(items)[0];
      const key = convertToSnakeCase(foundItem);

      const existing = this.dugItems.find(
        (item) => item.x === offsetX && item.y === offsetY
      );
      if (existing) {
        existing.setTexture(key);
      } else {
        const image = this.add.image(offsetX, offsetY, key).setScale(0.8);
        this.dugItems.push(image);
      }
    });

    // Clean up any sprites that are no longer in game state
    this.dugItems
      .filter((item) => {
        return !revealed.flat().some((hole) => {
          const offsetX =
            hole.x * this.cellSize + this.gridX + this.cellSize / 2;
          const offsetY =
            hole.y * this.cellSize + this.gridY + this.cellSize / 2;
          return offsetX === item.x && offsetY === item.y;
        });
      })
      .forEach((item) => {
        this.showPoof({ x: item.x, y: item.y });
        item.destroy();
      });
  };

  public walkToLocation = (
    x: number,
    y: number,
    offsetX: number,
    offsetY: number,
    onComplete: () => void
  ) => {
    if (!this.currentPlayer) return;

    const xDiff = this.currentPlayer.x - x;
    const yDiff = this.currentPlayer.y - y;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    const speed = 75;

    const duration = (distance / speed) * 1000;

    if (xDiff > 0) {
      this.currentPlayer.faceLeft();
    } else {
      this.currentPlayer.faceRight();
    }

    const xPosition =
      this.currentPlayer.x <= x
        ? x - this.cellSize + offsetX
        : x + this.cellSize + offsetX;
    const yPosition = y + offsetY;

    this.tweens.add({
      targets: this.currentPlayer,
      x: xPosition,
      y: yPosition,
      duration,
      ease: "Linear",
      onStart: () => {
        this.isPlayerTweening = true;
      },
      onComplete: () => {
        this.isPlayerTweening = false;
        onComplete();
      },
    });
  };

  public disableControls() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = false;
    }

    if (this.joystick) {
      this.joystick.setEnable(false);
    }
  }

  public enableControls() {
    if (this.input.keyboard) {
      this.input.keyboard.enabled = true;
    }

    if (this.joystick) {
      this.joystick.setEnable(true);
    }
  }

  public cannotDig = ({
    rectX,
    rectY,
    row,
    col,
  }: {
    rectX: number;
    rectY: number;
    row?: number;
    col?: number;
  }) => {
    const sandShovelsCount = (
      this.gameService.state.context.state.inventory["Sand Shovel"] ??
      new Decimal(0)
    ).toNumber();
    const sandDrillsCount = (
      this.gameService.state.context.state.inventory["Sand Drill"] ??
      new Decimal(0)
    ).toNumber();

    let hasDugHere = false;

    if (row !== undefined && col !== undefined) {
      const dug = this.gameService.state.context.state.desert.digging.grid;

      hasDugHere = dug.flat().some((hole) => {
        return hole.x === col && hole.y === row;
      });
    }

    if (
      (this.selectedItem === "Sand Drill" && sandDrillsCount === 0) ||
      sandShovelsCount === 0 ||
      !this.hasDigsLeft
    ) {
      if (!hasDugHere) {
        this.noShovelHoverBox
          ?.setPosition(rectX + 4, rectY + 4)
          .setOrigin(0)
          .setVisible(true);
      }

      this.handleDigbyWarnings();

      return true;
    }

    return hasDugHere;
  };

  public handlePointerOver = ({
    rectX,
    rectY,
    row,
    col,
  }: {
    rectX: number;
    rectY: number;
    row?: number;
    col?: number;
  }) => {
    this.drillHoverBox?.setVisible(false);
    this.drillConfirmBox?.setVisible(false);

    if (this.cannotDig({ rectX, rectY, row, col })) return;

    let hasDugHere = false;

    if (row !== undefined && col !== undefined) {
      const dug = this.gameService.state.context.state.desert.digging.grid;

      hasDugHere = dug.flat().some((hole) => {
        return hole.x === col && hole.y === row;
      });
    }

    if (
      !this.currentPlayer ||
      this.isRevealing ||
      this.isPlayerTweening ||
      hasDugHere
    ) {
      return;
    }

    this.hoverBox?.setDepth(this.currentPlayer.y - this.cellSize);
    this.confirmBox?.setDepth(this.currentPlayer.y - this.cellSize);

    const selectedBox = this.confirmBox as Phaser.GameObjects.Image;

    if (rectX === selectedBox.x && rectY === selectedBox.y) {
      this.hoverBox?.setVisible(false);
      return;
    }

    this.hoverBox?.setOrigin(0).setPosition(rectX, rectY).setVisible(true);
  };

  public handleMobileTouchDrill = ({
    mouseX,
    mouseY,
    rectX,
    rectY,
  }: {
    mouseX: number;
    mouseY: number;
    rectX: number;
    rectY: number;
  }) => {
    const x =
      Math.round((mouseX - this.cellSize) / this.cellSize) * this.cellSize;
    const y =
      Math.round((mouseY - this.cellSize) / this.cellSize) * this.cellSize;

    if (this.selectedItem === "Sand Drill") {
      if (!this.drillConfirmBox?.visible) {
        // set selected box
        this.drillConfirmBox?.setPosition(x, y).setVisible(true);
        // remove hover box
        this.drillHoverBox?.setVisible(false);

        return;
      }
      // Figure out what the hover box position would have been

      // Calculate the starting cell (top-left corner)
      const startCol = Math.floor((x - this.gridX) / this.cellSize);
      const startRow = Math.floor((y - this.gridY) / this.cellSize);

      const drillCoords: { x: number; y: number }[] = [
        { x: startCol, y: startRow },
        { x: startCol + 1, y: startRow },
        { x: startCol, y: startRow + 1 },
        { x: startCol + 1, y: startRow + 1 },
      ];

      if (
        drillCoords.every(({ x, y }) =>
          this.cannotDig({ rectX, rectY, col: x, row: y })
        )
      ) {
        return;
      }

      // remove selected box
      this.drillConfirmBox?.setVisible(false);
      // move player to dig spot
      const drillX = x + this.cellSize;
      const drillY = y + this.cellSize;

      this.walkToLocation(
        drillX,
        drillY,
        this.drillOffsetX,
        this.drillOffsetY,
        () => this.handleDrill(drillCoords)
      );
    }
  };

  public handleDrillPointerOver = ({
    mouseX,
    mouseY,
  }: {
    mouseX: number;
    mouseY: number;
  }) => {
    this.hoverBox?.setVisible(false);
    this.confirmBox?.setVisible(false);

    const hoverX =
      Math.round((mouseX - this.cellSize) / this.cellSize) * this.cellSize;
    const hoverY =
      Math.round((mouseY - this.cellSize) / this.cellSize) * this.cellSize;

    // Calculate the starting cell (top-left corner)
    const startCol = Math.floor((hoverX - this.gridX) / this.cellSize);
    const startRow = Math.floor((hoverY - this.gridY) / this.cellSize);

    const drillCoords: { x: number; y: number }[] = [
      { x: startCol, y: startRow },
      { x: startCol + 1, y: startRow },
      { x: startCol, y: startRow + 1 },
      { x: startCol + 1, y: startRow + 1 },
    ];

    const availableHoles = drillCoords.some(({ x, y }) => {
      const dugAt = this.gameService.state.context.state.desert.digging.grid
        .flat()
        .find((hole) => hole.x === x && hole.y === y);

      return !dugAt;
    });

    if (!availableHoles || this.isPlayerTweening || this.isRevealing) {
      this.drillHoverBox?.setVisible(false);

      return;
    }

    const maxX = this.gridX + SITE_COLS * this.cellSize - this.cellSize * 2;
    const maxY = this.gridY + SITE_ROWS * this.cellSize - this.cellSize * 2;

    const x = Math.min(Math.max(hoverX, this.gridX), maxX);
    const y = Math.min(Math.max(hoverY, this.gridY), maxY);

    const selectBox = this.drillConfirmBox as Phaser.GameObjects.Image;

    if (selectBox.getBounds().contains(mouseX, mouseY)) {
      this.drillHoverBox?.setVisible(false);
      return;
    }

    this.drillHoverBox?.setPosition(x, y).setVisible(true);
  };

  public handleDrillPointerDown = (rectX: number, rectY: number) => {
    if (!this.drillHoverBox) return;

    // Get the position of the hover box
    const hoverX = this.drillHoverBox.x;
    const hoverY = this.drillHoverBox.y;

    // Calculate the starting cell (top-left corner)
    const startCol = Math.floor((hoverX - this.gridX) / this.cellSize);
    const startRow = Math.floor((hoverY - this.gridY) / this.cellSize);

    const drillCoords: { x: number; y: number }[] = [
      { x: startCol, y: startRow },
      { x: startCol + 1, y: startRow },
      { x: startCol, y: startRow + 1 },
      { x: startCol + 1, y: startRow + 1 },
    ];

    if (
      drillCoords.every(({ x, y }) =>
        this.cannotDig({ rectX, rectY, col: x, row: y })
      )
    ) {
      return;
    }
    // check if this rectangle is currently the selected one
    if (
      this.drillConfirmBox?.x === hoverX &&
      this.drillConfirmBox?.y === hoverY
    ) {
      // remove selected box
      this.drillConfirmBox?.setVisible(false);
      // move player to dig spot
      const drillX = hoverX + this.cellSize;
      const drillY = hoverY + this.cellSize;

      this.walkToLocation(
        drillX,
        drillY,
        this.drillOffsetX,
        this.drillOffsetY,
        () => this.handleDrill(drillCoords)
      );
    } else {
      // set selected box
      this.drillConfirmBox?.setPosition(hoverX, hoverY).setVisible(true);
      // remove hover box
      this.drillHoverBox?.setVisible(false);
    }
  };

  public handlePointerDown = ({
    rectX,
    rectY,
    row,
    col,
  }: {
    rectX: number;
    rectY: number;
    row: number;
    col: number;
  }) => {
    if (this.cannotDig({ rectX, rectY, row, col })) return;

    // check if this rectangle is currently the selected one
    if (this.confirmBox?.x === rectX && this.confirmBox?.y === rectY) {
      this.confirmBox?.setVisible(false);
      // move player to dig spot
      this.walkToLocation(rectX, rectY, this.digOffsetX, this.digOffsetY, () =>
        this.handleDig(row, col)
      );
    } else {
      // set selected box
      this.confirmBox?.setPosition(rectX, rectY).setVisible(true);
      // remove hover box
      this.hoverBox?.setVisible(false);
    }
  };

  public handlePointOut = () => {
    this.hoverBox?.setVisible(false);
    this.noShovelHoverBox?.setVisible(false);
  };

  public updateDiggingLabels = () => {
    if (!this.hasDigsLeft) {
      this.digsRemainingLabel?.setText("No digs remaining");
    } else {
      this.digsRemainingLabel?.setText(
        `Digs remaining: ${this.allowedDigs - this.holesDugCount}`
      );
    }

    this.percentageFoundLabel?.setText(
      `Treasures found: ${this.percentageTreasuresFound}%`
    );

    this.digbyProgressBar?.updateBar(this.percentageTreasuresFound);
  };

  get treasuresFound() {
    return this.gameService.state.context.state.desert.digging.grid
      .flat()
      .filter((hole) => {
        return (
          getKeys(hole.items)[0] !== "Sand" && getKeys(hole.items)[0] !== "Crab"
        );
      })
      .map((hole) => getKeys(hole.items)[0]);
  }

  get totalBuriedTreasure() {
    const { patterns } = this.gameService.state.context.state.desert.digging;

    const count = patterns.reduce(
      (total, pattern) => DIGGING_FORMATIONS[pattern].length + total,
      0
    );

    return count;
  }
  get percentageTreasuresFound() {
    return Math.round(
      (this.treasuresFound.length / this.totalBuriedTreasure) * 100
    );
  }

  get holesDugCount() {
    return this.gameService.state.context.state.desert.digging.grid.length ?? 0;
  }

  get allowedDigs() {
    let allowedDigs = TOTAL_DIGS;

    if (
      isCollectibleBuilt({
        name: "Heart of Davy Jones",
        game: this.gameService.state.context.state,
      })
    ) {
      allowedDigs += 20;
    }

    if (
      isCollectibleBuilt({
        name: "Pharaoh Chicken",
        game: this.gameService.state.context.state,
      })
    ) {
      allowedDigs += 1;
    }

    return allowedDigs;
  }

  get hasDigsLeft() {
    const totalHolesDug =
      this.gameService.state.context.state.desert.digging.grid.length ?? 0;

    return totalHolesDug < this.allowedDigs;
  }

  public handleDig = async (row: number, col: number) => {
    this.isRevealing = true;
    this.coordsToDig = { x: col, y: row };
    // Send off reveal game event
    this.gameService.send("REVEAL", {
      event: {
        type: "desert.dug",
        x: col,
        y: row,
        createdAt: new Date(),
      },
    });
  };

  public handleDrill = async (coords: { x: number; y: number }[]) => {
    this.isRevealing = true;
    this.coordsToDig = coords;
    // Send off reveal game event
    this.gameService.send("REVEAL", {
      event: {
        type: "desert.drilled",
        coords,
        createdAt: new Date(),
      },
    });
  };

  public recordDigAnalytics = () => {
    const day = getUTCDateString();
    const stored = localStorage.getItem("beachDigAttempts");

    let attemptsToday = 0;

    if (stored) {
      attemptsToday = JSON.parse(stored)[day];

      localStorage.setItem(
        "beachDigAttempts",
        JSON.stringify({ ...JSON.parse(stored), [day]: attemptsToday + 1 })
      );
    } else {
      localStorage.setItem(
        "beachDigAttempts",
        JSON.stringify({ [day]: attemptsToday + 1 })
      );
    }

    if (attemptsToday + 1 < 4) {
      const totalCoins = this.treasuresFound.reduce((acc, item) => {
        return (acc +=
          SELLABLE_TREASURE[item as BeachBountyTreasure].sellPrice);
      }, 0);

      const percentageFound = Math.floor(
        (this.totalBuriedTreasure / this.treasuresFound.length) * 100
      );

      gameAnalytics.trackBeachDiggingAttempt({
        outputCoins: totalCoins,
        percentageFound,
      });
    }
  };

  public handleNameTagVisibility = () => {
    const currentPlayerBounds = this.currentPlayer?.getBounds();
    const nameTag = this.currentPlayer?.getByName("nameTag");
    const factionTag = this.currentPlayer?.getByName("factionTag");
    // Create a grid for the dig site with a buffer of 1 tile
    const gridRect = new Phaser.Geom.Rectangle(
      this.gridX,
      this.gridY,
      this.cellSize * SITE_COLS,
      this.cellSize * SITE_ROWS - (this.currentPlayer?.height ?? 0)
    );

    if (!currentPlayerBounds || !gridRect) return;

    if (Phaser.Geom.Rectangle.Overlaps(currentPlayerBounds, gridRect)) {
      if (nameTag) {
        (nameTag as Phaser.GameObjects.Text).setVisible(false);
      }

      if (factionTag) {
        (factionTag as Phaser.GameObjects.Text).setVisible(false);
      }
    } else {
      if (nameTag) {
        (nameTag as Phaser.GameObjects.Text).setVisible(true);
      }

      if (factionTag) {
        (factionTag as Phaser.GameObjects.Text).setVisible(true);
      }
    }
  };

  public handleOtherDiggersPositions() {
    // If any other players are inside of the dig area, move them to the perimeter
    this.mmoServer?.state?.players.forEach((player, sessionId) => {
      if (this.isPlayerInDigArea(player.x, player.y)) {
        this.playerEntities[sessionId]?.teleport(256, 111);
      }
    });
  }

  public isPlayerInDigArea = (playerX: number, playerY: number) => {
    const gridRect = new Phaser.Geom.Rectangle(
      this.gridX,
      this.gridY,
      this.cellSize * SITE_COLS,
      this.cellSize * SITE_ROWS
    );

    return (
      playerX > gridRect.x &&
      playerX < gridRect.right &&
      playerY > gridRect.y &&
      playerY < gridRect.bottom
    );
  };

  public handleDigbyWarnings = () => {
    if (!this.currentPlayer) return;

    if (!this.hasDigsLeft) {
      this.npcs.digby?.speak(translate("digby.noDigsLeft"));

      return;
    }

    const sandShovels =
      this.gameService.state.context.state.inventory["Sand Shovel"] ??
      new Decimal(0);
    const sandDrills =
      this.gameService.state.context.state.inventory["Sand Drill"] ??
      new Decimal(0);

    if (sandShovels.lt(1) && this.selectedItem !== "Sand Drill") {
      this.npcs.digby?.speak(translate("digby.noShovels"));

      return;
    }

    if (this.selectedItem === "Sand Drill" && sandDrills.lt(1)) {
      this.npcs.digby?.speak(translate("digby.noDrills"));

      return;
    }
  };

  public updatePlayer() {
    // Don't allow movement while digging
    if (!this.currentPlayer) return;

    // Allow mouse events to pass through the player
    this.currentPlayer.disableInteractive();
    this.currentPlayer?.setDepth(this.currentPlayer.y);

    // If there is key movement for the player then play walking animation
    // joystick is active if force is greater than zero
    this.movementAngle =
      this.joystick?.enable && this.joystick?.force
        ? this.joystick?.angle
        : undefined;

    // use keyboard control if joystick is not active
    if (this.movementAngle === undefined) {
      if (document.activeElement?.tagName === "INPUT") return;

      const left =
        (this.cursorKeys?.left.isDown || this.cursorKeys?.a?.isDown) ?? false;
      const right =
        (this.cursorKeys?.right.isDown || this.cursorKeys?.d?.isDown) ?? false;
      const up =
        (this.cursorKeys?.up.isDown || this.cursorKeys?.w?.isDown) ?? false;
      const down =
        (this.cursorKeys?.down.isDown || this.cursorKeys?.s?.isDown) ?? false;

      this.movementAngle = this.keysToAngle(left, right, up, down);
    }

    // change player direction if angle is changed from left to right or vise versa
    if (
      this.movementAngle !== undefined &&
      Math.abs(this.movementAngle) !== 90 &&
      !this.isPlayerTweening &&
      !this.isRevealing
    ) {
      this.isFacingLeft = Math.abs(this.movementAngle) > 90;
      this.isFacingLeft
        ? this.currentPlayer.faceLeft()
        : this.currentPlayer.faceRight();
    }

    // set player velocity
    const currentPlayerBody = this.currentPlayer
      .body as Phaser.Physics.Arcade.Body;
    if (this.movementAngle !== undefined) {
      currentPlayerBody.setVelocity(
        this.walkingSpeed * Math.cos((this.movementAngle * Math.PI) / 180),
        this.walkingSpeed * Math.sin((this.movementAngle * Math.PI) / 180)
      );
    } else {
      currentPlayerBody.setVelocity(0, 0);
    }

    this.sendPositionToServer();

    const isMoving =
      this.movementAngle !== undefined && this.walkingSpeed !== 0;

    if (this.soundEffects) {
      this.soundEffects.forEach((audio) =>
        audio.setVolumeAndPan(
          this.currentPlayer?.x ?? 0,
          this.currentPlayer?.y ?? 0
        )
      );
    } else {
      // eslint-disable-next-line no-console
      console.error("audioController is undefined");
    }

    if (this.walkAudioController) {
      this.walkAudioController.handleWalkSound(
        isMoving || this.isPlayerTweening
      );
    } else {
      // eslint-disable-next-line no-console
      console.error("walkAudioController is undefined");
    }

    if (isMoving || this.isPlayerTweening) {
      this.currentPlayer.walk();
    } else if (this.gameService.state.matches("revealed")) {
      // Only run this code once
      if (!this.isRevealing) return;

      this.coordsToDig = undefined;
      this.enableControls();
      this.currentPlayer.sprite?.anims?.stopAfterRepeat(0);
      this.isRevealing = false;

      // Ideally should be done at the end of the animation
      // Potentially have animation of the item??
      this.populateDugItems();
      this.updateDiggingLabels();

      if (!this.hasDigsLeft) {
        this.recordDigAnalytics();
      }

      const onComplete = () => {
        // Move out of revealed state
        this.gameService.send("CONTINUE");
        this.currentPlayer?.sprite?.off("animationstop", onComplete);
      };

      this.currentPlayer?.sprite?.on("animationstop", onComplete);
    } else if (this.isRevealing) {
      const currentAnimation = this.currentPlayer.sprite?.anims?.currentAnim;

      if (
        currentAnimation?.key.includes("dig") &&
        currentAnimation?.key.includes("drill")
      ) {
        return;
      }

      // If we are in this condition and the game service state
      // is not revealing then it indicates we attempted to dig
      // while the machine was in the autosaving state.
      // Continue trying to send the REVEAL event until we get through
      if (!this.gameService.state.matches("revealing") && !!this.coordsToDig) {
        if (Array.isArray(this.coordsToDig)) {
          this.handleDrill(this.coordsToDig);
        } else {
          this.handleDig(this.coordsToDig.y, this.coordsToDig.x);
        }
      }
      // Stop player movement while the animation is playing
      this.disableControls();
      // Set player to digging/drilling while we are revealing the reward
      if (this.selectedItem === "Sand Drill") {
        this.currentPlayer.drill();
      } else {
        this.currentPlayer.dig();
      }
    } else {
      this.currentPlayer.idle();
    }
  }

  public handleUpdateSelectedItem = () => {
    if (this.currentSelectedItem === this.selectedItem) return;

    this.currentSelectedItem = this.selectedItem;

    this.hoverBox?.setVisible(false);
    this.confirmBox?.setVisible(false);
    this.drillConfirmBox?.setVisible(false);
    this.drillHoverBox?.setVisible(false);

    const sandDrills = this.gameState.inventory["Sand Drill"] ?? new Decimal(0);

    if (
      this.selectedItem === "Sand Drill" &&
      sandDrills.gt(0) &&
      this.npcs.digby?.isSpeaking
    ) {
      this.npcs.digby?.stopSpeaking();
    }
  };

  public update() {
    if (!this.currentPlayer) return;

    this.handleUpdateSelectedItem();

    if (this.isPlayerInDigArea(this.currentPlayer.x, this.currentPlayer.y)) {
      this.updatePlayer();
      this.updateOtherPlayers();
      this.handleNameTagVisibility();
      this.handleOtherDiggersPositions();
      this.handleDigbyWarnings();
    } else {
      super.update();
    }
  }
}

// PubSub.ts

type Callback = (...args: any[]) => void;

class BeachPubSub {
  private events: Record<string, Callback[]> = {};

  subscribe(event: string, callback: Callback): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  publish(event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(...args);
      });
    }
  }

  unsubscribe(event: string, callback: Callback): void {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

export const beachEvents = new BeachPubSub();
