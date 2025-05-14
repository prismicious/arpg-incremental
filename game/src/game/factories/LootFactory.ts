import type { InventoryItem } from "../../types/interfaces/inventory-item";
import { createWeapon, createChestplate } from "./EquipmentFactory";
import { TiersEnum } from "../../types/interfaces/enums";

export function generateRandomLoot(): InventoryItem[] {
  const loot: InventoryItem[] = [];
  loot.push(createWeapon("sword", 5, TiersEnum.wood));
  loot.push(createChestplate(5, TiersEnum.wood));
  return loot;
}
