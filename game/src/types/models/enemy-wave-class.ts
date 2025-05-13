import type { IEnemyWave } from "../interfaces/enemy-wave";
import type { IEnemy } from "../interfaces/enemy";

export class EnemyWave implements IEnemyWave {
  enemies: IEnemy[];

  constructor(enemies: IEnemy[]) {
    this.enemies = enemies;
  }
}
