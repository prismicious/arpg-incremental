import type { IEnemy } from "../interfaces/enemy";
import type { InventoryItem } from "../interfaces/inventory-item";
import type { EnemyPrefab } from "../../game/prefabs/prefabs";

export class Enemy implements IEnemy {
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  attackSpeed: number;
  sprite: string;
  loot: InventoryItem[];
  armor: number;

  constructor(enemyPrefab: EnemyPrefab) {
    this.name = enemyPrefab.name;
    this.health = enemyPrefab.health;
    this.maxHealth = enemyPrefab.health;
    this.damage = enemyPrefab.damage;
    this.attackSpeed = enemyPrefab.attackSpeed;
    this.sprite = enemyPrefab.sprite;
    this.loot = enemyPrefab.loot;
    this.armor = enemyPrefab.armor || 0;
  }
}
