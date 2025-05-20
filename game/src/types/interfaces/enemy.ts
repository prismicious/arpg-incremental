import type { InventoryItem } from "./inventory-item";

export interface IEnemy {
  name: string;
  health: number;
  damage: number;
  armor: number;
  loot: InventoryItem[];
  attackSpeed: number; // Attacks per second
  sprite: string;
  experienceGranted: number;
  monsterLevel?: number; // Optional property for monster level
}
