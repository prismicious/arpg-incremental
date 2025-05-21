import type { Stats } from "./stats";
import type { ItemTypeMapping } from "./inventory-item";
import type { Equipment } from "./equipment";

export type InventoryItemUnion = ItemTypeMapping[keyof ItemTypeMapping]

export interface ICharacter {
  stats: Stats;
  inventory: InventoryItemUnion[];
  equipment: Equipment;
  sprite: string;
  experience: number;
  level: number;
  gold: number;
  totalExperience: number;
}
