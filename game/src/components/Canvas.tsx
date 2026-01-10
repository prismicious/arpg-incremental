import React from "react";
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

// Cog/Settings icon component (filled)
const CogIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 512 512"
    fill="currentColor"
  >
    <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
  </svg>
);

const Canvas: React.FC = () => {
  const enemyWaveManager = React.useMemo(() => new EnemyWaveManager(allEnemyWaves), []);
  const [character, setCharacter] = React.useState(createDefaultCharacter());
  const [effectiveStats, setEffectiveStats] = React.useState(
    calculateEffectiveStats(character)
  );
  const [isCharacterModalOpen, setCharacterModalOpen] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const currentWave = enemyWaveManager.currentWave;

  React.useEffect(() => {
    if (character.inventory.length === 0) {
      const items = debugCreateAllItems() as InventoryItemUnion[];
      character.addItemToInventory(items);
    }
  }, []);

  return (
    <section className="min-h-screen flex flex-col bg-black bg-opacity-60 text-white">
      <header
        className="py-3 px-8 flex items-center justify-between"
        style={{ background: "rgba(15, 12, 10, 0.7)" }}
      >
        <button
          className="game-button"
          onClick={() => setCharacterModalOpen((prev) => !prev)}
        >
          Character
        </button>
        <button
          className="game-button-icon"
          onClick={() => setShowSettings((prev) => !prev)}
          title="Settings"
        >
          <CogIcon />
        </button>
      </header>
      <main className="flex flex-1 container mx-auto px-4 py-4">
        {showSettings && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <div
              className="game-panel p-6 rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <p className="text-gray-400">Settings coming soon...</p>
            </div>
          </div>
        )}
        {isCharacterModalOpen && (
          <div
            className="fixed inset-0 flex items-center z-50 justify-start pl-4"
            onClick={() => setCharacterModalOpen(false)}
          >
            <div
              className="game-panel p-1 rounded-xl relative min-w-[350px] max-w-[95vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-white hover:text-red-400 text-xl bg-zinc-800 hover:bg-zinc-700 rounded w-8 h-8 flex items-center justify-center transition-all duration-150 border border-zinc-600"
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
