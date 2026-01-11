import React, { useState, useCallback } from "react";
import { createDefaultCharacter } from "../game/factories/CharacterFactory";
import { createEnemyWave } from "../game/factories/EnemyFactory";
import { calculateEffectiveStats } from "../game/util";
import "../icons.css";
import { createWaveDefinitions, type WaveDefinition } from "../game/prefabs/prefabs";
import CharacterBox from "./CharacterBox";
import CombatBox from "./CombatBox";
import WaveSelector from "./WaveSelector";

const spritePath = `${import.meta.env.BASE_URL}assets/sprites`;

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

type TabType = "explore" | "character";

const Canvas: React.FC = () => {
  const [character, setCharacter] = useState(createDefaultCharacter());
  const [effectiveStats, setEffectiveStats] = useState(
    calculateEffectiveStats(character)
  );
  const [activeTab, setActiveTab] = useState<TabType>("explore");
  const [showSettings, setShowSettings] = useState(false);

  // Wave system state
  const [waveDefinitions, setWaveDefinitions] = useState<WaveDefinition[]>(() => createWaveDefinitions());
  const [selectedWaveId, setSelectedWaveId] = useState(1);
  const [completedWaves, setCompletedWaves] = useState<number[]>([]);
  const [inCombat, setInCombat] = useState(false);
  const [currentWave, setCurrentWave] = useState<ReturnType<typeof createEnemyWave> | null>(null);

  const handleStartWave = useCallback(() => {
    const waveDef = waveDefinitions.find(w => w.id === selectedWaveId);
    if (waveDef && waveDef.unlocked) {
      const enemyWave = createEnemyWave(waveDef.enemies);
      setCurrentWave(enemyWave);
      setInCombat(true);
    }
  }, [waveDefinitions, selectedWaveId]);

  const handleWaveComplete = useCallback(() => {
    // Mark wave as completed
    setCompletedWaves(prev =>
      prev.includes(selectedWaveId) ? prev : [...prev, selectedWaveId]
    );
    // Unlock next wave
    setWaveDefinitions(prev => prev.map(w =>
      w.id === selectedWaveId + 1 ? { ...w, unlocked: true } : w
    ));
    setInCombat(false);
    setCurrentWave(null);
  }, [selectedWaveId]);

  const handleReturnToWaveSelect = useCallback(() => {
    setInCombat(false);
    setCurrentWave(null);
  }, []);


  return (
    <section className="min-h-screen flex justify-center text-white">
      {/* Settings Modal */}
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

      {/* Main content column */}
      <div className="game-main-column">
        {/* Unified header bar */}
        <div className="unified-header">
          {/* Left: Tabs */}
          <div className="header-tabs">
            <button
              className={`header-tab ${activeTab === "explore" ? "active" : ""}`}
              onClick={() => setActiveTab("explore")}
            >
              Explore
            </button>
            <button
              className={`header-tab ${activeTab === "character" ? "active" : ""} relative`}
              onClick={() => setActiveTab("character")}
            >
              Character
              {character.unallocAttrPts > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white animate-pulse"
                  style={{ boxShadow: "0 0 8px 2px rgba(34, 197, 94, 0.6)" }}
                >
                  +
                </span>
              )}
            </button>
          </div>

          {/* Right: Gold & Settings */}
          <div className="header-actions">
            <div className="header-gold">
              <span className="text-yellow-400">&#x1FA99;</span>
              <span>{character.gold}</span>
            </div>
            <button
              className="header-icon-btn"
              onClick={() => setShowSettings((prev) => !prev)}
              title="Settings"
            >
              <CogIcon />
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div
          className="flex-1 flex flex-col overflow-hidden transition-all duration-500"
          style={{
            ...(activeTab === "explore" && (() => {
              const theme = waveDefinitions.find(w => w.id === selectedWaveId)?.theme;
              if (theme?.background) {
                return {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url('${theme.background}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center bottom',
                };
              }
              return { background: theme?.gradient };
            })()),
          }}
        >
          {activeTab === "explore" ? (
            inCombat && currentWave && effectiveStats ? (
              <CombatBox
                character={character}
                effectiveStats={effectiveStats}
                currentWave={currentWave}
                spritePath={spritePath}
                onWaveComplete={handleWaveComplete}
                onReturnToWaveSelect={handleReturnToWaveSelect}
              />
            ) : (
              <div className="flex-1 flex">
                <WaveSelector
                  waves={waveDefinitions}
                  selectedWave={selectedWaveId}
                  completedWaves={completedWaves}
                  onSelectWave={setSelectedWaveId}
                  onStartWave={handleStartWave}
                />
              </div>
            )
          ) : (
            <div className="flex-1 overflow-y-auto">
              <CharacterBox
                character={character}
                setCharacter={setCharacter}
                effectiveStats={effectiveStats}
                setEffectiveStats={setEffectiveStats}
                spritePath={spritePath}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Canvas;
