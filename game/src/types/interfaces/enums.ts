import type { Helmet, Chest, Ring, Amulet } from "./inventory-item";

export type InventoryItemType =
  | "weapon"
  | "armor"
  | "potion"
  | "trinket"
  | "misc";
export type InventoryItemSlot =
  | "weapon"
  | "helmet"
  | "chest"
  | "amulet"
  | "ring"
  | "potion";

export const TiersEnum = {
  wood: "wood",
  iron: "iron",
  diamond: "diamond",
  gold: "gold",
  none: "none",
} as const;

export type TiersEnum = (typeof TiersEnum)[keyof typeof TiersEnum];

export const TiersEnumValues = Object.values(TiersEnum);

export const WeaponTypes = {
  sword: "sword",
  axe: "axe",
  bow: "bow",
  dagger: "dagger",
} as const;

export type WeaponTypes = (typeof WeaponTypes)[keyof typeof WeaponTypes];

export type ArmorTypeMapping = {
  helmet: Helmet;
  chest: Chest;
};
export const armorTypeKeys = ["helmet", "chest"] as const;

export type TrinketTypeMapping = {
  ring: Ring;
  amulet: Amulet;
};
