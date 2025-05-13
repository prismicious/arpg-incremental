import { EnemyWave } from "../../types/models/enemy-wave-class";
import { createEnemy } from "./EnemyFactory";
import type { EnemyPrefab } from "../prefabs/prefabs";

export function createEnemyWave(prefabs: EnemyPrefab[]): EnemyWave {
  const enemies = [];
  for (const prefab in prefabs) {
    const enemy = createEnemy(prefabs[prefab]);
    enemies.push(enemy);
  }
  return new EnemyWave(enemies);
}
