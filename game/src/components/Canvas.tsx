import React from "react";

import { createDefaultCharacter } from "../game/factories/CharacterFactory";
import { createEnemyWave } from "../game/factories/EnemyFactory";

import { calculateEffectiveStats } from "../game/util";
import "../icons.css";
import { AllEnemyWaves } from "../types/models/all-enemy-waves-class";
import { EnemyWaveManager } from "../types/models/enemy-wave-manager";
import { goblinPrefab, orcPrefab, slimePrefab } from "../game/prefabs/prefabs";
import {
  createAllWeapons,
} from "../game/factories/EquipmentFactory";

// Import new components
import CharacterBox from "./CharacterBox";
import CombatBox from "./CombatBox";
import type { InventoryItemUnion } from "../types/interfaces/character";
// import LootBox from "./LootBox";

const wave1 = createEnemyWave([
  orcPrefab,
  slimePrefab,
  orcPrefab,
  goblinPrefab,
  slimePrefab,
]);
const allEnemyWaves = new AllEnemyWaves();
allEnemyWaves.addWave(wave1);

const weapons = createAllWeapons();

const exampleInventory: InventoryItemUnion[] = weapons

const enemyWaveManager = new EnemyWaveManager(allEnemyWaves);

// Example inventory for demonstration (replace with your real inventory logic)

const spritePath = "/assets/sprites";

const Canvas: React.FC = () => {
  const [character, setCharacter] = React.useState(createDefaultCharacter());
  const [effectiveStats, setEffectiveStats] = React.useState(
    calculateEffectiveStats(character)
  );
  const [isCharacterModalOpen, setCharacterModalOpen] = React.useState(false);
  // Get the current enemy from the wave manager
  const currentWave = enemyWaveManager.currentWave;

  React.useEffect(() => {
    character.addItemToInventory(exampleInventory);
  }, []);

  return (
    <section className="min-h-screen flex flex-col bg-black bg-opacity-60 text-white">
      {/* Header */}
      <header className="py-4 px-8 bg-gray-900/80 flex items-center shadow-lg rounded-b-xl border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-wide">ARPG Incremental</h1>
        <button
          className="ml-4 px-6 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white font-bold uppercase tracking-wide shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
          onClick={() => setCharacterModalOpen((prev) => !prev)}
        >
          Character
        </button>
      </header>
      {/* Main Content */}
      <main className="flex flex-1 container mx-auto px-4 py-8 gap-6">
        <section className="flex-1 flex flex-col gap-6">
          {/* Character Modal */}
          {isCharacterModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
              onClick={() => setCharacterModalOpen(false)}
            >
              <div
                className="bg-gray-900/90 p-6 rounded-xl shadow-2xl relative border-2 border-gray-700 min-w-[350px] max-w-[95vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-white hover:text-red-400 text-xl bg-gray-700/80 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={() => setCharacterModalOpen(false)}
                  title="Close"
                >
                  ✕
                </button>
                <CharacterBox
                  character={character}
                  setCharacter={setCharacter}
                  effectiveStats={effectiveStats}
                  setEffectiveStats={setEffectiveStats}
                  spritePath={spritePath}
                />
              </div>
            </div>
          )}

          {/* Combat Box */}
          {currentWave && effectiveStats ? (
            <div className="flex justify-center">
              <CombatBox
                character={character}
                effectiveStats={effectiveStats}
                currentWave={currentWave}
                spritePath={spritePath}
              />
            </div>
          ) : (
            <div className="text-center text-gray-400">No wave or effective stats!</div>
          )}

          {/* Loot Box */}
          {/* <LootBox /> */}
        </section>
      </main>
    </section>
  );
};

export default Canvas;
