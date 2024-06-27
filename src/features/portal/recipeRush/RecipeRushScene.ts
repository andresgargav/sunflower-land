import mapJson from "assets/map/recipe_rush.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene, NPCBumpkin } from "features/world/scenes/BaseScene";
import { MachineInterpreter } from "./lib/recipeRushMachine";
import { INGREDIENT_BOXES_POSITIONS } from "./recipeRushConstants";

export const NPCS: NPCBumpkin[] = [
  {
    x: 344,
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
  }

  async create() {
    this.map = this.make.tilemap({
      key: "recipe_rush",
    });

    super.create();

    this.addCropBoxes();

    this.initialiseNPCs(NPCS);
  }

  update() {
    if (!this.hasChefHat) {
      this.updateHat();
      return;
    }

    super.update();
  }

  private selectIngredient(ingredientIndex: number) {
    const item = this.add
      .sprite(0, -14, "ingredients", ingredientIndex)
      .setOrigin(0.5)
      .setScale(0.75);

    this.currentPlayer?.add(item);
  }

  private addCropBoxes() {
    const spriteName = "ingredient_boxes";

    INGREDIENT_BOXES_POSITIONS.forEach((ingredientBox) => {
      const box = this.add
        .sprite(
          ingredientBox.x,
          ingredientBox.y,
          spriteName,
          ingredientBox.index
        )
        .setOrigin(0)
        .setDepth(0);

      box.setInteractive({ cursor: "pointer" }).on("pointerdown", () => {
        if (this.checkDistanceToSprite(box, 40))
          this.selectIngredient(Number(box.frame.name));
        // } else {
        //   this.currentPlayer?.speak(translate("base.iam.far.away"));
        // }
      });
    });
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
