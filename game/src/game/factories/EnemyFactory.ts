import type { IEnemy } from "../../types/interfaces/enemy";
import { Enemy } from "../../types/models/enemy-class";
import { EnemyWave } from "../../types/models/enemy-wave-class";
import type { EnemyPrefab } from "../prefabs/prefabs";

export function createEnemy(prefab: EnemyPrefab): IEnemy {
  return new Enemy(prefab);
}

export function createEnemyWave(prefabs: EnemyPrefab[]): EnemyWave {
  const enemies = [];
  for (const prefab in prefabs) {
    const enemy = createEnemy(prefabs[prefab]);
    enemies.push(enemy);
  }
  return new EnemyWave(enemies);
}
