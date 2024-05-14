import {
  EXPANSION_REQUIREMENTS,
  Land,
} from "features/game/expansion/lib/expansionRequirements";
import { BumpkinLevel } from "features/game/lib/level";
import { IslandType } from "features/game/types/game";

export interface Nodes {
  "Crop Plot": number;
  Tree: number;
  "Stone Rock": number;
  "Iron Rock": number;
  "Gold Rock": number;
  "Crimstone Rock": number;
  "Sunstone Rock": number;
  "Fruit Patch": number;
  "Flower Bed": number;
  Beehive: number;
  "Oil Reserve": number;
}

export function getEnabledNodeCount(
  bumpkinLevel: BumpkinLevel,
  nodeType: string
): number {
  const key = nodeType as keyof Nodes;

  for (let expansions = 4; expansions <= 23; ++expansions) {
    if (EXPANSION_REQUIREMENTS[expansions as Land].bumpkinLevel > bumpkinLevel)
      return TOTAL_EXPANSION_NODES.basic[expansions as Land][key];
  }

  return 0;
}

type ExpansionNode = Record<IslandType, Record<number, Nodes>>;

export const TOTAL_EXPANSION_NODES: ExpansionNode = {
  basic: {
    3: {
      "Crop Plot": 9,
      Tree: 3,
      "Stone Rock": 2,
      "Iron Rock": 0,
      "Gold Rock": 0,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    4: {
      "Crop Plot": 17,
      Tree: 5,
      "Stone Rock": 3,
      "Iron Rock": 1,
      "Gold Rock": 0,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    5: {
      "Crop Plot": 21,
      Tree: 6,
      "Stone Rock": 4,
      "Iron Rock": 2,
      "Gold Rock": 1,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    6: {
      "Crop Plot": 25,
      Tree: 7,
      "Stone Rock": 5,
      "Iron Rock": 2,
      "Gold Rock": 1,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    7: {
      "Crop Plot": 27,
      Tree: 8,
      "Stone Rock": 6,
      "Iron Rock": 3,
      "Gold Rock": 1,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    8: {
      "Crop Plot": 29,
      Tree: 9,
      "Stone Rock": 7,
      "Iron Rock": 3,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    9: {
      "Crop Plot": 31,
      Tree: 9,
      "Stone Rock": 7,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 0,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    10: {
      "Crop Plot": 31,
      Tree: 9,
      "Stone Rock": 7,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 2,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    11: {
      "Crop Plot": 33,
      Tree: 11,
      "Stone Rock": 9,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 3,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    12: {
      "Crop Plot": 33,
      Tree: 12,
      "Stone Rock": 10,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 4,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    13: {
      "Crop Plot": 35,
      Tree: 13,
      "Stone Rock": 11,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 4,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    14: {
      "Crop Plot": 37,
      Tree: 13,
      "Stone Rock": 12,
      "Iron Rock": 6,
      "Gold Rock": 4,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 5,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    15: {
      "Crop Plot": 37,
      Tree: 14,
      "Stone Rock": 12,
      "Iron Rock": 6,
      "Gold Rock": 4,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 6,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    16: {
      "Crop Plot": 37,
      Tree: 14,
      "Stone Rock": 12,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 7,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    17: {
      "Crop Plot": 39,
      Tree: 15,
      "Stone Rock": 13,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 8,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    18: {
      "Crop Plot": 41,
      Tree: 15,
      "Stone Rock": 13,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 8,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    19: {
      "Crop Plot": 41,
      Tree: 16,
      "Stone Rock": 14,
      "Iron Rock": 8,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 9,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    20: {
      "Crop Plot": 43,
      Tree: 16,
      "Stone Rock": 14,
      "Iron Rock": 8,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 10,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    21: {
      "Crop Plot": 44,
      Tree: 17,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 5,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 11,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    22: {
      "Crop Plot": 45,
      Tree: 18,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 6,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 11,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
    23: {
      "Crop Plot": 46,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      "Fruit Patch": 12,
      "Flower Bed": 0,
      Beehive: 0,
      "Oil Reserve": 0,
    },
  },
  spring: {
    // Basic Expansion 10
    4: {
      "Crop Plot": 31,
      "Fruit Patch": 2,
      Tree: 9,
      "Stone Rock": 7,
      "Iron Rock": 4,
      "Gold Rock": 2,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 0,
      "Oil Reserve": 0,
      "Flower Bed": 0,
    },
    5: {
      "Crop Plot": 33,
      "Fruit Patch": 3,
      Tree: 11,
      "Stone Rock": 9,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 0,
      "Oil Reserve": 0,
      "Flower Bed": 0,
    },
    6: {
      "Crop Plot": 33,
      "Fruit Patch": 4,
      Tree: 12,
      "Stone Rock": 10,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 0,
      "Sunstone Rock": 0,
      Beehive: 1,
      "Flower Bed": 1,
      "Oil Reserve": 0,
    },
    7: {
      "Crop Plot": 35,
      "Fruit Patch": 4,
      Tree: 13,
      "Stone Rock": 11,
      "Iron Rock": 5,
      "Gold Rock": 3,
      "Crimstone Rock": 1,
      "Sunstone Rock": 0,
      Beehive: 1,
      "Flower Bed": 1,
      "Oil Reserve": 0,
    },
    8: {
      "Crop Plot": 37,
      "Fruit Patch": 5,
      Tree: 13,
      "Stone Rock": 12,
      "Iron Rock": 6,
      "Gold Rock": 4,
      "Crimstone Rock": 1,
      "Sunstone Rock": 0,
      Beehive: 1,
      "Flower Bed": 1,
      "Oil Reserve": 0,
    },
    9: {
      "Crop Plot": 37,
      "Fruit Patch": 6,
      Tree: 14,
      "Stone Rock": 12,
      "Iron Rock": 6,
      "Gold Rock": 4,
      "Crimstone Rock": 1,
      "Sunstone Rock": 1,
      Beehive: 1,
      "Flower Bed": 1,
      "Oil Reserve": 0,
    },
    10: {
      "Crop Plot": 37,
      "Fruit Patch": 7,
      Tree: 14,
      "Stone Rock": 12,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 1,
      "Sunstone Rock": 1,
      Beehive: 2,
      "Flower Bed": 2,
      "Oil Reserve": 0,
    },
    11: {
      "Crop Plot": 39,
      "Fruit Patch": 8,
      Tree: 15,
      "Stone Rock": 13,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 1,
      "Sunstone Rock": 1,
      Beehive: 2,
      "Flower Bed": 2,
      "Oil Reserve": 0,
    },
    12: {
      "Crop Plot": 41,
      "Fruit Patch": 8,
      Tree: 15,
      "Stone Rock": 13,
      "Iron Rock": 7,
      "Gold Rock": 5,
      "Crimstone Rock": 1,
      "Sunstone Rock": 1,
      Beehive: 2,
      "Flower Bed": 2,
      "Oil Reserve": 0,
    },
    13: {
      "Crop Plot": 41,
      "Fruit Patch": 9,
      Tree: 16,
      "Stone Rock": 14,
      "Iron Rock": 8,
      "Gold Rock": 5,
      "Crimstone Rock": 1,
      "Sunstone Rock": 2,
      Beehive: 2,
      "Flower Bed": 2,
      "Oil Reserve": 0,
    },
    14: {
      "Crop Plot": 43,
      "Fruit Patch": 10,
      Tree: 16,
      "Stone Rock": 14,
      "Iron Rock": 8,
      "Gold Rock": 5,
      "Crimstone Rock": 1,
      "Sunstone Rock": 2,
      Beehive: 2,
      "Flower Bed": 2,
      "Oil Reserve": 0,
    },
    15: {
      "Crop Plot": 44,
      "Fruit Patch": 11,
      Tree: 17,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 5,
      "Crimstone Rock": 2,
      "Sunstone Rock": 2,
      Beehive: 2,
      "Flower Bed": 2,
      "Oil Reserve": 0,
    },
    16: {
      "Crop Plot": 45,
      "Fruit Patch": 11,
      Tree: 18,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 6,
      "Crimstone Rock": 2,
      "Sunstone Rock": 2,
      Beehive: 3,
      "Flower Bed": 3,
      "Oil Reserve": 0,
    },
    17: {
      "Crop Plot": 46,
      "Fruit Patch": 12,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Crimstone Rock": 2,
      "Sunstone Rock": 2,
      Beehive: 3,
      "Flower Bed": 3,
      "Oil Reserve": 0,
    },
    18: {
      "Crop Plot": 46,
      "Fruit Patch": 12,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Crimstone Rock": 2,
      "Sunstone Rock": 3,
      Beehive: 3,
      "Flower Bed": 3,
      "Oil Reserve": 0,
    },
    19: {
      "Crop Plot": 48,
      "Fruit Patch": 12,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Crimstone Rock": 3,
      "Sunstone Rock": 3,
      Beehive: 3,
      "Flower Bed": 3,
      "Oil Reserve": 0,
    },
    20: {
      "Crop Plot": 50,
      "Fruit Patch": 12,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      Beehive: 3,
      "Flower Bed": 3,
      "Oil Reserve": 0,
    },
  },
  desert: {
    // Spring island level 16
    4: {
      "Crop Plot": 45,
      "Fruit Patch": 11,
      Tree: 18,
      "Stone Rock": 15,
      "Iron Rock": 9,
      "Gold Rock": 6,
      "Crimstone Rock": 2,
      "Sunstone Rock": 2,
      "Oil Reserve": 0,
      Beehive: 3,
      "Flower Bed": 3,
    },
    5: {
      "Crop Plot": 46,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Fruit Patch": 11,
      "Crimstone Rock": 2,
      "Sunstone Rock": 2,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    6: {
      "Crop Plot": 46,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Fruit Patch": 12,
      "Crimstone Rock": 2,
      "Sunstone Rock": 3,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    7: {
      "Crop Plot": 46,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Fruit Patch": 12,
      "Crimstone Rock": 3,
      "Sunstone Rock": 3,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    8: {
      "Crop Plot": 50,
      Tree: 18,
      "Stone Rock": 16,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Fruit Patch": 12,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    9: {
      "Crop Plot": 50,
      Tree: 19,
      "Stone Rock": 17,
      "Iron Rock": 10,
      "Gold Rock": 6,
      "Fruit Patch": 12,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    10: {
      "Crop Plot": 51,
      Tree: 19,
      "Stone Rock": 17,
      "Iron Rock": 11,
      "Gold Rock": 6,
      "Fruit Patch": 12,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    11: {
      "Crop Plot": 52,
      Tree: 19,
      "Stone Rock": 17,
      "Iron Rock": 11,
      "Gold Rock": 6,
      "Fruit Patch": 13,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    12: {
      "Crop Plot": 54,
      Tree: 19,
      "Stone Rock": 17,
      "Iron Rock": 11,
      "Gold Rock": 6,
      "Fruit Patch": 13,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    13: {
      "Crop Plot": 54,
      Tree: 20,
      "Stone Rock": 17,
      "Iron Rock": 11,
      "Gold Rock": 6,
      "Fruit Patch": 13,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    14: {
      "Crop Plot": 55,
      Tree: 20,
      "Stone Rock": 18,
      "Iron Rock": 11,
      "Gold Rock": 6,
      "Fruit Patch": 13,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 1,
      Beehive: 3,
      "Flower Bed": 3,
    },
    15: {
      "Crop Plot": 56,
      Tree: 20,
      "Stone Rock": 18,
      "Iron Rock": 11,
      "Gold Rock": 6,
      "Fruit Patch": 13,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 2,
      Beehive: 3,
      "Flower Bed": 3,
    },
    16: {
      "Crop Plot": 57,
      Tree: 21,
      "Stone Rock": 18,
      "Iron Rock": 11,
      "Gold Rock": 6,
      "Fruit Patch": 13,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 2,
      Beehive: 3,
      "Flower Bed": 3,
    },
    17: {
      "Crop Plot": 59,
      Tree: 21,
      "Stone Rock": 18,
      "Iron Rock": 11,
      "Gold Rock": 6,
      "Fruit Patch": 13,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 2,
      Beehive: 3,
      "Flower Bed": 3,
    },
    18: {
      "Crop Plot": 60,
      Tree: 21,
      "Stone Rock": 18,
      "Iron Rock": 11,
      "Gold Rock": 7,
      "Fruit Patch": 13,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 2,
      Beehive: 3,
      "Flower Bed": 3,
    },
    19: {
      "Crop Plot": 61,
      Tree: 21,
      "Stone Rock": 18,
      "Iron Rock": 11,
      "Gold Rock": 7,
      "Fruit Patch": 14,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 2,
      Beehive: 3,
      "Flower Bed": 3,
    },
    20: {
      "Crop Plot": 61,
      Tree: 22,
      "Stone Rock": 19,
      "Iron Rock": 11,
      "Gold Rock": 7,
      "Fruit Patch": 14,
      "Crimstone Rock": 3,
      "Sunstone Rock": 4,
      "Oil Reserve": 3,
      Beehive: 3,
      "Flower Bed": 3,
    },
    21: {
      "Crop Plot": 62,
      Tree: 22,
      "Stone Rock": 19,
      "Iron Rock": 12,
      "Gold Rock": 7,
      "Fruit Patch": 14,
      "Crimstone Rock": 3,
      "Sunstone Rock": 5,
      "Oil Reserve": 3,
      Beehive: 3,
      "Flower Bed": 3,
    },
    22: {
      "Crop Plot": 62,
      Tree: 23,
      "Stone Rock": 19,
      "Iron Rock": 12,
      "Gold Rock": 7,
      "Fruit Patch": 15,
      "Crimstone Rock": 3,
      "Sunstone Rock": 5,
      "Oil Reserve": 3,
      Beehive: 3,
      "Flower Bed": 3,
    },
    23: {
      "Crop Plot": 63,
      Tree: 23,
      "Stone Rock": 19,
      "Iron Rock": 12,
      "Gold Rock": 7,
      "Fruit Patch": 15,
      "Crimstone Rock": 4,
      "Sunstone Rock": 5,
      "Oil Reserve": 3,
      Beehive: 3,
      "Flower Bed": 3,
    },
    24: {
      "Crop Plot": 64,
      Tree: 23,
      "Stone Rock": 19,
      "Iron Rock": 12,
      "Gold Rock": 7,
      "Fruit Patch": 15,
      "Crimstone Rock": 4,
      "Sunstone Rock": 6,
      "Oil Reserve": 3,
      Beehive: 3,
      "Flower Bed": 3,
    },
    25: {
      "Crop Plot": 65,
      Tree: 23,
      "Stone Rock": 20,
      "Iron Rock": 12,
      "Gold Rock": 7,
      "Fruit Patch": 15,
      "Crimstone Rock": 4,
      "Sunstone Rock": 6,
      "Oil Reserve": 3,
      Beehive: 3,
      "Flower Bed": 3,
    },
  },
};
