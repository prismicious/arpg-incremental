import { TiersEnum, WeaponTypes } from "../../types/interfaces/enums";
import { WeaponStats } from "./WeaponStatCreator";
import type {
  Weapon,
  Chestplate,
  Helmet,
  Ring,
  Amulet,
  Potion,
} from "../../types/interfaces/inventory-item";
import { spriteTileToNameMap } from "../spriteMap";

// Helper
function getKeyByValue(
  map: Record<number, string>,
  value: string
): number | undefined {
  return Number(Object.keys(map).find((key) => map[Number(key)] === value));
}

export function createWeapon(
  weaponType: WeaponTypes,
  level: number,
  tier: TiersEnum,
): Weapon {
  const { damage, attackSpeed } = WeaponStats(weaponType, tier, level);
  const mapping = `${tier}_${weaponType}`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `_${tileIndex}.png` : "missing.png";
  return {
    type: "weapon",
    weaponType,
    tier,
    slot: "weapon",
    damage,
    attackSpeed,
    quantity: 1,
    sprite,
  };
}

export function createChestplate(
  armor: number,
  tier: TiersEnum,
  health?: number
): Chestplate {
  const mapping = `${tier}_chest`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `_${tileIndex}.png` : "missing.png";
  return {
    type: "armor",
    slot: "chestplate",
    tier,
    armor,
    health,
    quantity: 1,
    sprite,
  };
}

export function createHelmet(
  tier: TiersEnum,
  armor: number,
  health?: number
): Helmet {
  const mapping = `${tier}_helmet`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `_${tileIndex}.png` : "missing.png";
  return {
    tier,
    type: "armor",
    slot: "helmet",
    armor,
    health,
    quantity: 1,
    sprite,
  };
}

export function createRing(
  tier: TiersEnum,
  strength?: number,
  dexterity?: number,
  intelligence?: number
): Ring {
  const mapping = `${tier}_ring`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `_${tileIndex}.png` : "missing.png";
  return {
    type: "trinket",
    slot: "ring",
    strength,
    dexterity,
    intelligence,
    quantity: 1,
    sprite,
    tier,
  };
}

export function createAmulet(
  tier: TiersEnum,
  strength?: number,
  dexterity?: number,
  intelligence?: number,
  quantity?: number
): Amulet {
  const mapping = `${tier}_amulet`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `_${tileIndex}.png` : "missing.png";
  return {
    type: "trinket",
    slot: "amulet",
    strength,
    dexterity,
    intelligence,
    quantity,
    sprite,
    tier,
  };
}

export function createPotion(healAmount: number, quantity?: number): Potion {
  return {
    type: "potion",
    slot: "potion1",
    healAmount,
    quantity,
    sprite: "potion.png",
  };
}
