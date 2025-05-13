import type { IEnemy } from "./enemy";

export interface IEnemyWave {
  enemies: IEnemy[];
}

export interface IAllEnemyWaves {
  allEnemyWaves: IEnemyWave[];
}
