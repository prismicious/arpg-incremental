import type { Stats } from "./stats";
import type { ItemTypeMapping } from "./inventory-item";
import type { Equipment } from "./equipment";

type InventoryItemUnion = ItemTypeMapping[keyof ItemTypeMapping]

export interface Character {
  Stats: Stats;
  inventory: InventoryItemUnion[];
  equipment: Equipment;
  sprite: string;
  experience: number;
  level: number;
}
