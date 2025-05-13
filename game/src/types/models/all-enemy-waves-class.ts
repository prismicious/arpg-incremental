import type { IAllEnemyWaves } from "../interfaces/enemy-wave";
import type { EnemyWave } from "./enemy-wave-class";

export class AllEnemyWaves implements IAllEnemyWaves {
  allEnemyWaves: EnemyWave[];

  constructor() {
    this.allEnemyWaves = [];
  }

  addWave(wave: EnemyWave): void {
    this.allEnemyWaves.push(wave);
  }

  addWaves(waves: EnemyWave[]): void {
    this.allEnemyWaves.push(...waves);
  }
}
