import React from "react";

import { createDefaultCharacter } from "../game/factories/CharacterFactory";
import { createEnemyWave } from "../game/factories/EnemyFactory";

import { calculateEffectiveStats } from "../game/util";
import "../icons.css";
import { AllEnemyWaves } from "../types/models/all-enemy-waves-class";
import { EnemyWaveManager } from "../types/models/enemy-wave-manager";
import { goblinPrefab, orcPrefab, slimePrefab } from "../game/prefabs/prefabs";

// Import new components
import CharacterBox from "./CharacterBox";
import CombatBox from "./CombatBox";
// import LootBox from "./LootBox";

const wave1 = createEnemyWave([
  orcPrefab,
  orcPrefab,
  orcPrefab,
  goblinPrefab,
  slimePrefab,
]);
const allEnemyWaves = new AllEnemyWaves();
allEnemyWaves.addWave(wave1);

const enemyWaveManager = new EnemyWaveManager(allEnemyWaves);

// Example inventory for demonstration (replace with your real inventory logic)

const spritePath = "/assets/sprites";

const Canvas: React.FC = () => {
  const [character, setCharacter] = React.useState(createDefaultCharacter());
  const [effectiveStats, setEffectiveStats] = React.useState(
    calculateEffectiveStats(character)
  );

  // Get the current enemy from the wave manager
  const currentWave = enemyWaveManager.currentWave;

  return (
    <section className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="py-4 px-8 bg-gray-900 flex items-center">
        <h1 className="text-2xl font-bold">ARPG Incremental</h1>
      </header>
      {/* Main Content */}
      <main className="flex flex-1 container mx-auto px-4 py-8 gap-6">
        <section className="flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Character Box */}
              <CharacterBox
                character={character}
                setCharacter={setCharacter}
                effectiveStats={effectiveStats}
                setEffectiveStats={setEffectiveStats}
                spritePath={spritePath}
              />

            {/* Combat Box */}
              {currentWave && effectiveStats ? (
                <CombatBox
                  character={character}
                  effectiveStats={effectiveStats}
                  currentWave={currentWave}
                  spritePath={spritePath}
                />
              ) : (
                <div>No wave or effective stats!</div>
              )}

            {/* Loot Box */}
            {/* <LootBox /> */}
          </div>
        </section>
      </main>
    </section>
  );
};

export default Canvas;
