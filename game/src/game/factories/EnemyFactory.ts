import type { IEnemy } from "../../types/interfaces/enemy";
import { Enemy } from "../../types/models/enemy-class";
import { EnemyWave } from "../../types/models/enemy-wave-class";
import type { EnemyPrefab } from "../prefabs/prefabs";

export function createEnemy(prefab: EnemyPrefab): IEnemy {
  // Added so we can see the prefab in the console
  const enemy = new Enemy(prefab);
  console.log("Enemy created:", enemy);
  return enemy;
}

export function createEnemyWave(prefabs: EnemyPrefab[]): EnemyWave {
  const enemies = [];
  for (const prefab in prefabs) {
    const enemy = createEnemy(prefabs[prefab]);
    enemies.push(enemy);
  }
  return new EnemyWave(enemies);
}
