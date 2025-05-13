import type { Stats } from "./stats";
import type { InventoryItem } from "./inventory-item";
import type { Equipment } from "./equipment";

export interface Character {
  health: number;
  currentHealth: number;
  mana: number;
  currentMana: number;
  Stats: Stats;
  inventory: InventoryItem[];
  attackSpeed: number; // Attacks per second
  equipment: Equipment;
}
