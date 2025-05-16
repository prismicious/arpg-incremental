import { createWeapon } from "../factories/EquipmentFactory";
import { TiersEnum } from "../../types/interfaces/enums";
import type { InventoryItem } from "../../types/interfaces/inventory-item";

export interface EnemyPrefab {
  name: string;
  health: number;
  damage: number;
  attackSpeed: number;
  sprite: string;
  loot: InventoryItem[];
  armor?: number;
}

export const goblinPrefab: EnemyPrefab = {
  name: "Goblin",
  health: 50,
  damage: 10,
  attackSpeed: 1,
  sprite: "_na.png",
  loot: [createWeapon("sword", 3, TiersEnum.wood)],
  armor: 2,
};

export const orcPrefab: EnemyPrefab = {
  name: "Orc",
  health: 120,
  damage: 20,
  attackSpeed: 0.8,
  sprite: "../../../assets/temp/orc.png",
  loot: [createWeapon("sword", 7, TiersEnum.iron)],
  armor: 5,
};

export const slimePrefab: EnemyPrefab = {
  name: "Slime",
  health: 30,
  damage: 5,
  attackSpeed: 1.5,
  sprite: "_na.png",
  loot: [createWeapon("sword", 2, TiersEnum.iron)],
};
