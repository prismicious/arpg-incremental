import type { InventoryItem } from "./inventory-item";

export interface IEnemy {
  name: string;
  health: number;
  damage: number;
  armor: number;
  loot: InventoryItem[];
  attackSpeed: number; // Attacks per second
  sprite: string;
  maxHealth: number;
}
