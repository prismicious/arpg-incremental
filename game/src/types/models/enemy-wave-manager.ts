import type { IEnemy } from "../interfaces/enemy";
import type { Enemy } from "./enemy-class";
import type { EnemyWave } from "./enemy-wave-class";
import type { AllEnemyWaves } from "./all-enemy-waves-class";

export class EnemyWaveManager {
  allWaves: AllEnemyWaves;
  currentWave: EnemyWave | null = null;
  currentEnemy: IEnemy | null = null;
  defeatedWaves: EnemyWave[] = [];
  defeatedEnemies: Enemy[] = [];

  constructor(allWaves: AllEnemyWaves) {
    this.allWaves = allWaves;
    this.currentWave = this.allWaves.allEnemyWaves[0]; // Start with the first wave
    this.currentEnemy = this.currentWave.enemies[0] || null;
  }

  getCurrentWave(): EnemyWave | null {
    return this.currentWave;
  }

  getCurrentEnemy(): IEnemy | null {
    return this.currentEnemy;
  }

  setCurrentWave(waveIndex: number): void {
    if (waveIndex < 0 || waveIndex >= this.allWaves.allEnemyWaves.length) {
      throw new Error("Invalid wave index.");
    }

    this.currentWave = this.allWaves.allEnemyWaves[waveIndex];
    this.currentEnemy = this.currentWave.enemies[0] || null;
  }

  manageWaves() {
    if (!this.currentWave) throw new Error("Please set a current wave first.");

    while (this.currentWave.enemies.length > 0) {
      if (this.currentEnemy) {
        if (this.currentEnemy.health <= 0) {
          this.defeatedEnemies.push(this.currentEnemy as Enemy);
          this.currentWave.enemies = this.currentWave.enemies.filter(
            (enemy) => enemy !== this.currentEnemy
          );
          this.currentEnemy = this.currentWave.enemies[0] || null;
        }
      }
    }

    if (this.currentWave.enemies.length === 0) {
      this.defeatedWaves.push(this.currentWave);
      this.currentWave = null; // Move to the next wave
      this.currentEnemy = null;
    }
  }
}
