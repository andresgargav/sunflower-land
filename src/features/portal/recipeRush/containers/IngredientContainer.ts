import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { IngredientStates } from "../RecipeRushTypes";
import { BaseScene } from "features/world/scenes/BaseScene";
import {
  EXPRESSION_ITEM,
  INGREDIENT_STATE,
  ITEM_BUMPKIN,
} from "../RecipeRushConstants";
import { AlertContainer } from "./AlertContainer";
import { IngredientStateContainer } from "./IngredientStateContainer";
import { ItemContainer } from "./ItemContainer";

interface Props {
  x: number;
  y: number;
  frame: number;
  scene: BaseScene;
  name: string;
  player?: BumpkinContainer;
}

export class IngredientContainer extends ItemContainer {
  private player?: BumpkinContainer;
  private ingredientName: string;
  private alert: AlertContainer;
  private ingredientState: IngredientStateContainer;

  scene: BaseScene;
  sprite: Phaser.GameObjects.Sprite;

  constructor({ x, y, frame, scene, name, player }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;
    this.ingredientName = name;

    // Ingredient Sprite
    const spriteName = "ingredients";
    this.sprite = scene.add.sprite(0, 0, spriteName, frame);

    // Alert
    this.alert = new AlertContainer({
      x: EXPRESSION_ITEM.x,
      y: EXPRESSION_ITEM.y,
      scene: scene,
    });

    // State
    this.ingredientState = new IngredientStateContainer({
      x: INGREDIENT_STATE.x,
      y: INGREDIENT_STATE.y,
      scene: scene,
      stateName: "RAW",
    });

    this.setSize(this.sprite.width, this.sprite.height);
    this.add([this.sprite, this.ingredientState]);
  }

  applyHighlight() {
    this.sprite.setPipeline("WhitenPipeline");
    this.alert.createBuzzTween();
    this.add(this.alert);
  }

  removeHighlight() {
    this.sprite.resetPipeline();
    this.alert.destroyBuzzTween();
    this.remove(this.alert);
  }

  adjustWithPlayer(isInCookingTool = false) {
    const [directionMultiplier, ingredientStateX] =
      this.player?.directionFacing === "left"
        ? [-1, this.width + INGREDIENT_STATE.x * 2 - 1]
        : [1, INGREDIENT_STATE.x];

    const scaledItem = ITEM_BUMPKIN.scale * directionMultiplier;
    const scaledIngredientState = INGREDIENT_STATE.scale * directionMultiplier;

    !isInCookingTool &&
      this.setX(directionMultiplier).setScale(scaledItem, ITEM_BUMPKIN.scale);

    this.ingredientState
      .setX(ingredientStateX)
      .setScale(scaledIngredientState, INGREDIENT_STATE.scale);
  }

  adjustDefault(x: number, y: number) {
    this.setPosition(x, y).setScale(ITEM_BUMPKIN.scale);
    this.ingredientState
      .setX(INGREDIENT_STATE.x)
      .setScale(INGREDIENT_STATE.scale);
  }

  changeState(stateName: IngredientStates) {
    this.ingredientState?.changeState(stateName);
  }

  getState() {
    return this.ingredientState.getState();
  }
}
