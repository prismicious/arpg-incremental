import type { IEnemy } from "../interfaces/enemy";
import type { InventoryItemUnion } from "../interfaces/character";
import type { EnemyPrefab } from "../../game/prefabs/prefabs";
import { generateRandomLoot } from "../../game/factories/LootFactory";

export class Enemy implements IEnemy {
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  attackSpeed: number;
  sprite: string;
  loot: InventoryItemUnion[];
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
    this.loot = generateRandomLoot({ level: enemyPrefab.monsterLevel ?? 1 });
    this.armor = enemyPrefab.armor || 0;
    this.experienceGranted = enemyPrefab.experienceGranted;
    this.monsterLevel = enemyPrefab.monsterLevel;
  }

  setLoot() {
    this.loot = generateRandomLoot({ level: this.monsterLevel ?? 1 });
  }
}
