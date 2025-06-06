import { TiersEnum, WeaponTypes} from "../../types/interfaces/enums";
import type { ArmorTypeMapping, TrinketTypeMapping } from "../../types/interfaces/enums";
import { WeaponStats } from "./WeaponStatCreator";
import { ArmorStats } from "./ArmorStatCreator";
import { TrinketStats } from "./TrinketStatCreator";
import { generateUniqueId } from "../utils/generateUniqueId";
import type {
  Weapon,
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

export function createArmor<T extends keyof ArmorTypeMapping>(
  armorType: T,
  level: number,
  tier: TiersEnum,
): ArmorTypeMapping[T] {
  const { armor, health } = ArmorStats(armorType, tier, level);
  const mapping = `${tier}_${armorType}`;
  const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
  const sprite = tileIndex !== undefined ? `_${tileIndex}.png` : "missing.png";
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

export function createTrinket<T extends keyof TrinketTypeMapping>(
  trinketType: T, level: number, tier: TiersEnum,): TrinketTypeMapping[T] {
    const { strength, dexterity, intelligence } = TrinketStats(trinketType, tier, level);
    const mapping = `${tier}_${trinketType}`;
    const tileIndex = getKeyByValue(spriteTileToNameMap, mapping);
    const sprite = tileIndex !== undefined ? `_${tileIndex}.png` : "missing.png";
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
