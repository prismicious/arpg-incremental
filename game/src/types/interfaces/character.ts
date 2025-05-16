import type { Stats } from "./stats";
import type { InventoryItem } from "./inventory-item";
import type { Equipment } from "./equipment";

export interface Character {
  Stats: Stats;
  inventory: InventoryItem[];
  equipment: Equipment;
  sprite: string;
}
