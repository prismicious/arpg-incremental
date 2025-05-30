import {
  armorTypeKeys,
  TiersEnum,
  WeaponTypes,
} from "../../types/interfaces/enums";
import type {
  ArmorTypeMapping,
  TrinketTypeMapping,
} from "../../types/interfaces/enums";
import { WeaponStats } from "./WeaponStatCreator";
import { ArmorStats } from "./ArmorStatCreator";
import { TrinketStats } from "./TrinketStatCreator";
import { generateUniqueId } from "../utils/generateUniqueId";
import type {
  Weapon,
  Potion,
  Armor,
} from "../../types/interfaces/inventory-item";
import { spriteTileToNameMap } from "../spriteMap";
import type { InventoryItemUnion } from "../../types/interfaces/character";

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
  tier: TiersEnum
): Weapon {
  const { damage, attackSpeed } = WeaponStats(weaponType, tier, level);
  const mapping = `${tier}_${weaponType}`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `${tileIndex}.png` : "missing.png";
  return {
    type: "weapon",
    id: generateUniqueId(`${weaponType}`),
    weaponType,
    tier,
    slot: "weapon",
    damage,
    attackSpeed,
    quantity: 1,
    sprite,
  };
}

export function createAllWeapons() {
  const weapons: Weapon[] = [];
  for (const weaponType of Object.values(WeaponTypes)) {
    for (const tier of Object.values(TiersEnum)) {
      if (tier === TiersEnum.none) continue;
      weapons.push(createWeapon(weaponType, 1, tier));
    }
  }
  return weapons;
}

export function createArmor<T extends keyof ArmorTypeMapping>(
  armorType: T,
  level: number,
  tier: TiersEnum
): ArmorTypeMapping[T] {
  const { armor, health } = ArmorStats(armorType, tier, level);
  const mapping = `${tier}_${armorType}`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `${tileIndex}.png` : "missing.png";
  return {
    tier,
    type: "armor",
    id: generateUniqueId(`${armorType}`),
    slot: armorType,
    armor,
    health,
    sprite,
  } as ArmorTypeMapping[T];
}

export function createAllArmors() {
  const armors: Armor[] = [];
  for (const armorType of armorTypeKeys) {
    for (const tier of Object.values(TiersEnum)) {
      if (tier === TiersEnum.none) continue;
      armors.push(createArmor(armorType, 1, tier));
    }
  }
  return armors;
}

export function createAllTrinkets() {
  console.log("First trigger")
  const trinkets: TrinketTypeMapping[keyof TrinketTypeMapping][] = [];
  const trinketTypes: (keyof TrinketTypeMapping)[] = ["ring", "amulet"];
  for (const trinketType of trinketTypes) {
    for (const tier of Object.values(TiersEnum)) {
      if (tier === TiersEnum.none) continue;
      trinkets.push(createTrinket(trinketType, 1, tier));
    }
  }
  return trinkets;
}

export function debugCreateAllItems(): InventoryItemUnion[] {
  const weapons = createAllWeapons();
  const armors = createAllArmors();
  const trinkets = createAllTrinkets();
  return [...weapons, ...armors, ...trinkets] as InventoryItemUnion[];
}

export function createTrinket<T extends keyof TrinketTypeMapping>(
  trinketType: T,
  level: number,
  tier: TiersEnum
): TrinketTypeMapping[T] {
  console.log(`Creating trinket: ${trinketType}, Level: ${level}, Tier: ${tier}`);
  const { strength, dexterity, intelligence } = TrinketStats(
    trinketType,
    tier,
    level
  );
  const mapping = `${tier}_${trinketType}`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `${tileIndex}.png` : "missing.png";
  return {
    type: "trinket",
    id: generateUniqueId(`${trinketType}`),
    slot: trinketType,
    strength,
    dexterity,
    intelligence,
    sprite,
    tier,
  } as TrinketTypeMapping[T];
}

export function createPotion(healAmount: number, quantity?: number): Potion {
  return {
    id: generateUniqueId("potion"),
    type: "potion",
    slot: "potion",
    tier: "none",
    healAmount,
    quantity,
    sprite: "potion.png",
  };
}
