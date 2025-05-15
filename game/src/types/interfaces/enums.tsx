import type { Helmet, Chest} from "./inventory-item";

export type InventoryItemType = "weapon" | "armor" | "potion" | "trinket" | "misc";

export const TiersEnum = {
  wood: "wood",
  iron: "iron",
  diamond: "diamond",
  gold: "gold",
  crimson: "crimson",
} as const;

export type TiersEnum = typeof TiersEnum[keyof typeof TiersEnum];

export const TiersEnumValues = Object.values(TiersEnum);

export const WeaponTypes = {
    sword: "sword",
    axe: "axe",
    bow: "bow",
    dagger: "dagger",
} as const;

export type WeaponTypes = typeof WeaponTypes[keyof typeof WeaponTypes];

export interface ArmorTypeMapping {
    helmet: Helmet;
    chest: Chest;
}


