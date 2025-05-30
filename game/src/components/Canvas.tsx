import React, { useRef } from "react";
import { createDefaultCharacter } from "../game/factories/CharacterFactory";
import { createEnemyWave } from "../game/factories/EnemyFactory";
import { calculateEffectiveStats } from "../game/util";
import "../icons.css";
import { AllEnemyWaves } from "../types/models/all-enemy-waves-class";
import { EnemyWaveManager } from "../types/models/enemy-wave-manager";
import { goblinPrefab, orcPrefab, slimePrefab } from "../game/prefabs/prefabs";
import {
  debugCreateAllItems,
} from "../game/factories/EquipmentFactory";
import CharacterBox from "./CharacterBox";
import CombatBox from "./CombatBox";
import TitleScreen from "./TitleScreen";
import type { InventoryItemUnion } from "../types/interfaces/character";

const wave1 = createEnemyWave([
  orcPrefab,
  slimePrefab,
  orcPrefab,
  goblinPrefab,
  slimePrefab,
]);
const allEnemyWaves = new AllEnemyWaves();
allEnemyWaves.addWave(wave1);

const spritePath = "/assets/sprites";

const Canvas: React.FC = () => {
  const enemyWaveManager = React.useMemo(() => new EnemyWaveManager(allEnemyWaves), []);
  const [character, setCharacter] = React.useState(createDefaultCharacter());
  const [effectiveStats, setEffectiveStats] = React.useState(
    calculateEffectiveStats(character)
  );
  const [isCharacterModalOpen, setCharacterModalOpen] = React.useState(false);
  const [showTitle, setShowTitle] = React.useState(true);
  const [showOptions, setShowOptions] = React.useState(false);
  const currentWave = enemyWaveManager.currentWave;

  React.useEffect(() => {
    if (character.inventory.length === 0) {
      const items = debugCreateAllItems() as InventoryItemUnion[];
      character.addItemToInventory(items);
    }
  }, []);

  const exp = character.experience;
  const expToNext = character.getExperienceToNextLevel();
  const expPercent = Math.min(100, (exp / expToNext) * 100);

  if (showTitle) {
    return (
      <TitleScreen
        onStart={() => setShowTitle(false)}
        onOptions={() => setShowOptions(true)}
      />
    );
  }

  return (
    <section className="min-h-screen flex flex-col bg-black bg-opacity-60 text-white">
      <header
        className="py-4 px-8 flex flex-col gap-2"
        style={{ background: "rgba(24, 24, 27, 0.6)" }}
      >
        <div className="flex items-center w-full justify-start">
          <button
            className="px-6 py-2 bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-700 text-gray-200 font-bold uppercase tracking-wide shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-none border border-gray-600"
            onClick={() => setCharacterModalOpen((prev) => !prev)}
          >
            Character
          </button>
        </div>
      </header>
      <main className="flex flex-1 container mx-auto px-4 py-4">
        {isCharacterModalOpen && (
          <div
            className="fixed inset-0 flex items-center z-50 justify-start pl-4"
            onClick={() => setCharacterModalOpen(false)}
          >
            <div
              className="bg-gray-900 p-1 rounded-xl shadow-2xl relative border-2 border-gray-700 min-w-[350px] max-w-[95vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-white hover:text-red-400 text-xl bg-gray-700/80 rounded-none w-8 h-8 flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
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
        <div className="flex justify-center w-full">
          {currentWave && effectiveStats ? (
            <CombatBox
              character={character}
              effectiveStats={effectiveStats}
              currentWave={currentWave}
              spritePath={spritePath}
            />
          ) : (
            <div className="text-center text-gray-400">No wave or effective stats!</div>
          )}
        </div>
      </main>
    </section>
  );
};

export default Canvas;
