import type { IEnemy } from "../interfaces/enemy";
import type { InventoryItem } from "../interfaces/inventory-item";
import type { EnemyPrefab } from "../../game/prefabs/prefabs";
import { generateRandomLoot } from "../../game/factories/LootFactory";

export class Enemy implements IEnemy {
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  attackSpeed: number;
  sprite: string;
  loot: InventoryItem[];
  armor: number;
  experienceGranted: number;
  monsterLevel?: number; // Optional property for monster level

  constructor(enemyPrefab: EnemyPrefab) {
    this.name = enemyPrefab.name;
    this.health = enemyPrefab.health;
    this.maxHealth = enemyPrefab.health;
    this.damage = enemyPrefab.damage;
    this.attackSpeed = enemyPrefab.attackSpeed;
    this.sprite = enemyPrefab.sprite;
    this.loot = generateRandomLoot();
    this.armor = enemyPrefab.armor || 0;
    this.experienceGranted = enemyPrefab.experienceGranted;
    this.monsterLevel = enemyPrefab.monsterLevel;
  }

  setLoot() {
    this.loot = generateRandomLoot()
  }
}
