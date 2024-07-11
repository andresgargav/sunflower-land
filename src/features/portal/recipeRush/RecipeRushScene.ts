import mapJson from "assets/map/recipe_rush.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene, NPCBumpkin } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "./lib/recipeRushMachine";
import {
  INGREDIENT_BOXES_CONFIGURATIONS,
  COUNTERTOPS_CONFIGURATIONS,
  POSITION_CONFIGURATIONS,
  TRASH_CANS_CONFIGURATIONS,
  CUTTING_BOARD,
  CUTTING_BOARDS_CONFIGURATIONS,
} from "./RecipeRushConstants";
import { CountertopContainer } from "./containers/CountertopContainer";
import { IngredientBoxContainer } from "./containers/IngredientBoxContainer";
import { TrashCanContainer } from "./containers/TrashCanContainer";
import { CookingToolContainer } from "./containers/CookingToolContainer";

export const NPCS: NPCBumpkin[] = [
  {
    x: 424,
    y: 117,
    // View NPCModals.tsx for implementation of pop up modal
    npc: "chef neon",
  },
];

export class RecipeRushScene extends BaseScene {
  sceneId: SceneId = "recipe_rush";

  private hasChefHat = false;

  constructor() {
    super({
      name: "recipe_rush",
      map: {
        json: mapJson,
        imageKey: "recipe-rush-tileset",
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet("ingredients", "world/ingredients.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("ingredient_boxes", "world/ingredient_boxes.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("highlights", "world/highlights.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Cooking tools and its actions
    this.load.spritesheet("cutting_board", "world/cutting_board.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "recipe_rush",
    });

    super.create();

    this.addCountertops();

    this.addTrashCans();

    this.addCropBoxes();

    // Cooking tools
    this.addCuttingBoards();

    this.initialiseNPCs(NPCS);
  }

  update() {
    if (!this.hasChefHat) {
      this.updateHat();
      return;
    }

    super.update();
  }

  private addCountertops() {
    COUNTERTOPS_CONFIGURATIONS.forEach(
      (config) =>
        new CountertopContainer({
          x: config.x,
          y: config.y,
          frame: config.frame,
          itemPosition: POSITION_CONFIGURATIONS[config.pos],
          scene: this,
          player: this.currentPlayer,
        })
    );
  }

  private addTrashCans() {
    TRASH_CANS_CONFIGURATIONS.forEach(
      (config) =>
        new TrashCanContainer({
          x: config.x,
          y: config.y,
          frame: config.frame,
          itemPosition: POSITION_CONFIGURATIONS[config.pos],
          scene: this,
          player: this.currentPlayer,
        })
    );
  }

  private addCropBoxes() {
    INGREDIENT_BOXES_CONFIGURATIONS.forEach(
      (config) =>
        new IngredientBoxContainer({
          x: config.x,
          y: config.y,
          frame: config.frame,
          scene: this,
          player: this.currentPlayer,
        })
    );
  }

  private addCuttingBoards() {
    CUTTING_BOARDS_CONFIGURATIONS.forEach(
      (config, id) =>
        new CookingToolContainer({
          x: config.x,
          y: config.y,
          frame: config.frame,
          animStart: CUTTING_BOARD.animStart,
          animEnd: CUTTING_BOARD.animEnd,
          id: id,
          spriteName: CUTTING_BOARD.spriteName,
          itemPosition: POSITION_CONFIGURATIONS[config.pos],
          scene: this,
          effect: CUTTING_BOARD.effect,
          player: this.currentPlayer,
        })
    );
  }

  private updateHat() {
    this.currentPlayer?.changeClothing({
      ...this.currentPlayer.clothing,
      hat: "Chef Hat",
      updatedAt: new Date().getTime(),
    });

    if (this.currentPlayer?.clothing.hat === "Chef Hat") this.hasChefHat = true;
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }
}