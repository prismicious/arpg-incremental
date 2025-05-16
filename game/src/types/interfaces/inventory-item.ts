import type { InventoryItemType, InventoryItemSlot, TiersEnum } from "./enums";

export interface ItemTypeMapping {
  weapon: Weapon;
  armor: Helmet | Chest;
  trinket: Amulet | Ring;
  potion: Potion;
}


export interface InventoryItem {
  type: InventoryItemType;
  slot: InventoryItemSlot;
  id: string;
  tier: TiersEnum;
  quantity?: number;
  sprite: string;
}

export interface Weapon extends InventoryItem {
  type: "weapon";
  weaponType: "sword" | "axe" | "bow" | "dagger";
  slot: "weapon";
  damage: number;
  attackSpeed: number;
  tier: TiersEnum;
}

export interface Armor extends InventoryItem {
  type: "armor";
  armor: number;
  tier: TiersEnum;
  health?: number;
}

export interface Trinket extends InventoryItem {
  type: "trinket";
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  tier: TiersEnum;
}

export interface Potion extends InventoryItem {
  type: "potion";
  slot: "potion";
  tier: "none";
  healAmount: number;
}

export interface Helmet extends Armor {
  slot: "helmet";
}

export interface Chest extends Armor {
  slot: "chest";
}

export interface Ring extends Trinket {
  slot: "ring";
}

export interface Amulet extends Trinket {
  slot: "amulet";
}
