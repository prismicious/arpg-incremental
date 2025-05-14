import type { InventoryItemType, TiersEnum } from "./enums";

export interface InventoryItem {
  type: InventoryItemType;
  quantity?: number;
  sprite: string;
}

export interface Weapon extends InventoryItem {
  type: "weapon";
  weaponType: "sword" | "axe" | "bow" | "dagger";
  slot: "weapon";
  damage: number;
  attackSpeed?: number;
  tier: string;
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
  slot: "potion1" | "potion2" | "potion3";
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
