import type { InventoryItem } from "../../types/interfaces/inventory-item";
import { createWeapon, createArmor } from "./EquipmentFactory";
import { TiersEnum } from "../../types/interfaces/enums";

export function generateRandomLoot(): InventoryItem[] {
  // TODO: Implement a random loot generation thing, this is just a placeholder
  const loot: InventoryItem[] = [];
  loot.push(createWeapon("sword", 5, TiersEnum.wood));
  loot.push(createArmor("chest", 5, TiersEnum.wood));
  return loot;
}
