import type { InventoryItemUnion } from "./character";

export interface IEnemy {
  name: string;
  health: number;
  damage: number;
  armor: number;
  loot: InventoryItemUnion[];
  attackSpeed: number; // Attacks per second
  sprite: string;
  experienceGranted: number;
  goldDropped: number;
  monsterLevel?: number; // Optional property for monster level
}
