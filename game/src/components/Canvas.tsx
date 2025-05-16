import React from "react";

import { createDefaultCharacter } from "../game/factories/CharacterFactory";
import { createEnemyWave } from "../game/factories/EnemyFactory";

import { calculateEffectiveStats } from "../game/util";
import "../icons.css";
import { AllEnemyWaves } from "../types/models/all-enemy-waves-class";
import { EnemyWaveManager } from "../types/models/enemy-wave-manager";
import { goblinPrefab, orcPrefab, slimePrefab } from "../game/prefabs/prefabs";
import {
  createWeapon,
  createArmor,
  createTrinket,
} from "../game/factories/EquipmentFactory";

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

const exampleInventory = {
  weapon: createWeapon("dagger", 1, "iron"),
  helmet: createArmor("helmet", 1, "diamond"),
  ring1: createTrinket("ring", 1, "wood"),
  ring2: createTrinket("ring", 1, "wood"),
  amulet: createTrinket("amulet", 1, "wood"),
};

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
    setCharacter((prev) => ({
      ...prev,
      inventory: [
        exampleInventory.weapon,
        exampleInventory.helmet,
        exampleInventory.ring1,
        exampleInventory.ring2,
        exampleInventory.amulet,
      ],
    }));
  }, []);

  return (
    <section className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="py-4 px-8 bg-gray-900 flex items-center">
        <h1 className="text-2xl font-bold">ARPG Incremental</h1>
        <button
          className="ml-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          onClick={() => setCharacterModalOpen((prev) => !prev)}
        ></button>
      </header>
      {/* Main Content */}
      <main className="flex flex-1 container mx-auto px-4 py-8 gap-6">
        <section className="flex-1 flex flex-col gap-6">
          {/* Character Box */}
          {isCharacterModalOpen && (
            <div
              className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
              onClick={() => setCharacterModalOpen(false)}
            >
              <div
                className="bg-gray-800 p-6 rounded shadow-lg relative border-2 border-gray-500"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-2 right-2 text-white"
                  onClick={() => setCharacterModalOpen(false)}
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
        </section>
      </main>
    </section>
  );
};

export default Canvas;
