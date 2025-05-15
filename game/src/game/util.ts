/* eslint-disable @typescript-eslint/no-explicit-any */
import { TiersEnumValues } from "../types/interfaces/enums";
import type { Character } from "../types/interfaces/character";
import type { InventoryItem, Weapon, Chest, Helmet, Ring, Amulet } from "../types/interfaces/inventory-item";
import type { Stats } from "../types/interfaces/stats";
import type { AllCoords, StartGridPos } from "../types/types";

function isWeapon(item: InventoryItem): item is Weapon {
  return item.type === "weapon";
}
function isChest(item: InventoryItem): item is Chest {
  return item.type === "armor" && (item as any).slot === "chest";
}
function isHelmet(item: InventoryItem): item is Helmet {
  return item.type === "armor" && (item as any).slot === "helmet";
}
function isRing(item: InventoryItem): item is Ring {
  return item.type === "trinket" && (item as any).slot === "ring";
}
function isAmulet(item: InventoryItem): item is Amulet {
  return item.type === "trinket" && (item as any).slot === "amulet";
}

export function calculateEffectiveStats(character: Character): Stats {
  const effective: Stats = { ...character.Stats };

  function applyItemStats(item: InventoryItem | null) {
    if (!item) return;
    if (isWeapon(item)) {
      effective.damage += item.damage;
    }
    if (isChest(item)) {
      effective.armor += item.armor;
      if (item.health) effective.damage += 0; // or handle health elsewhere
    }
    if (isHelmet(item)) {
      effective.armor += item.armor;
      if (item.health) effective.damage += 0; // or handle health elsewhere
    }
    if (isRing(item) || isAmulet(item)) {
      if (item.strength) effective.strength += item.strength;
      if (item.dexterity) effective.dexterity += item.dexterity;
      if (item.intelligence) effective.intelligence += item.intelligence;
    }
  }

  const eq = character.equipment;

  for (const equip of Object.values(eq)) {
    if (equip) {
      applyItemStats(equip);
    }
  }

  return effective;
}


export const getAllSpriteCoords = () => {
  const startGridPos = {
    chest: { col: 0, row: 0 },
    helmet: { col: 12, row: 7 },
    sword: { col: 3, row: 22 },
    ring: { col: 3, row: 17 },
    amulet: { col: 0, row: 14 },
  };

  const allCoords: AllCoords = calcAllCoords(startGridPos);

  return allCoords;
};

const calcAllCoords = (startGridPos: StartGridPos) => {
  const result: {
    [type: string]: { [tier: string]: { x: number; y: number, col: number, row: number } };
  } = {};

  Object.keys(startGridPos).forEach((type) => {
    // eslint-disable-next-line prefer-const
    let { col, row } = startGridPos[type];
    result[type] = {};

    for (let i = 0; i < TiersEnumValues.length; i++) {
      const tier = TiersEnumValues[i];
      result[type][tier] = { x: col * 32, y: row * 32, col: col, row: row };
      col++;
    }
  });

  return result;
};
