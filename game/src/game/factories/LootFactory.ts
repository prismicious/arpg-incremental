import { createWeapon, createArmor } from "./EquipmentFactory";
import { TiersEnum } from "../../types/interfaces/enums";
import type { InventoryItemUnion } from "../../types/interfaces/character";

export function generateRandomLoot(): InventoryItemUnion[] {
  // TODO: Implement a random loot generation thing, this is just a placeholder
  const loot: InventoryItemUnion[] = [];
  loot.push(createWeapon("sword", 5, TiersEnum.wood));
  loot.push(createArmor("chest", 5, TiersEnum.wood));
  return loot;
}
