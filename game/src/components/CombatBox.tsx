import React, { useReducer, useEffect, useRef, useState } from "react";
import { reducer, initialState } from "../game/reducers";
import type { EnemyWave } from "../types/models/enemy-wave-class";
import { Character } from "../types/models/character-class";
import type { Stats } from "../types/interfaces/stats";
import "./CombatBox.css"; // Ensure CSS is imported

interface CombatBoxProps {
  character: Character;
  effectiveStats: Stats;
  currentWave: EnemyWave;
  spritePath: string;
}

export const CombatBox: React.FC<CombatBoxProps> = ({
  character,
  effectiveStats,
  currentWave,
  spritePath,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    currentEnemy,
    currentEnemyHealth,
    currentHealth,
    playerNextAttack,
    enemyNextAttack,
    enemyIndex,
    isDead,
  } = state;

  const enemyCount = currentWave.enemies.length;
  const [isPaused, setIsPaused] = React.useState(true);

  // Damage number state
  const [playerDamage, setPlayerDamage] = useState<number | null>(null);
  const [enemyDamage, setEnemyDamage] = useState<number | null>(null);
  const playerDamageTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const enemyDamageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Level up glow effect state
  const [expGlow, setExpGlow] = useState(false);
  const prevLevel = useRef(character.level);

  useEffect(() => {
    // Initialize combat state
    dispatch({
      type: "INIT_COMBAT",
      payload: { enemies: currentWave.enemies, effectiveStats, character },
    });
  }, [currentWave, effectiveStats, character]);

  useEffect(() => {
    // Cleanup timeouts on unmount
    return () => {
      if (playerDamageTimeout.current)
        clearTimeout(playerDamageTimeout.current);
      if (enemyDamageTimeout.current) clearTimeout(enemyDamageTimeout.current);
    };
  }, []);

  useEffect(() => {
    function gameLoop() {
      if (isPaused) return;
      if (!currentEnemy) return;
      if (currentHealth <= 0) {
        dispatch({
          type: "END_COMBAT",
        });
        return;
      }
      if (currentEnemyHealth <= 0) {
        character.handleFightEnd(
          currentEnemy.experienceGranted,
          currentEnemy.loot
        );
        dispatch({
          type: "NEXT_ENEMY",
          payload: { enemies: currentWave.enemies },
        });
      } else if (playerNextAttack > enemyNextAttack) {
        // Enemy attacks player
        const dmg = Math.max(currentEnemy.damage - effectiveStats.armor, 0);
        setPlayerDamage(dmg);
        if (playerDamageTimeout.current)
          clearTimeout(playerDamageTimeout.current);
        playerDamageTimeout.current = setTimeout(
          () => setPlayerDamage(null),
          120 // was 250
        );

        dispatch({
          type: "UPDATE_PLAYER_HEALTH",
          payload: { damage: dmg },
        });
        dispatch({
          type: "UPDATE_ATTACK_TIMERS",
          payload: { enemyDelay: 1 / currentEnemy.attackSpeed, playerDelay: 0 },
        });
      } else {
        // Player attacks enemy
        const dmg = Math.max(effectiveStats.damage - currentEnemy.armor, 0);
        setEnemyDamage(dmg);
        if (enemyDamageTimeout.current)
          clearTimeout(enemyDamageTimeout.current);
        enemyDamageTimeout.current = setTimeout(
          () => setEnemyDamage(null),
          120 // was 250
        );

        dispatch({
          type: "UPDATE_ENEMY_HEALTH",
          payload: { damage: dmg },
        });
        dispatch({
          type: "UPDATE_ATTACK_TIMERS",
          payload: {
            playerDelay: 1 / effectiveStats.attackSpeed,
            enemyDelay: 0,
          },
        });
      }
    }

    const interval = setInterval(() => {
      gameLoop();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    isPaused,
    currentEnemyHealth,
    playerNextAttack,
    enemyNextAttack,
    currentWave.enemies,
    effectiveStats,
    character,
    currentEnemy,
    currentHealth,
  ]);

  useEffect(() => {
    if (character.level > prevLevel.current) {
      setExpGlow(true);
      prevLevel.current = character.level;
      setTimeout(() => setExpGlow(false), 900);
    }
  }, [character.level]);

  const handleButtonClick = () => {
    if (isDead) {
      // Restart combat
      dispatch({
        type: "RESTART_COMBAT",
        payload: { enemies: currentWave.enemies, effectiveStats, character },
      });
      setIsPaused(true);
      return;
    }
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="game-panel rounded-xl p-10 flex flex-col items-center max-w-xl w-lg relative">
      {/* EXP Bar at the very top, embedded into the box */}
      <div className="absolute left-0 top-0 w-full">
        <div
          className={
            "w-full h-9 bg-zinc-800 rounded-t-xl border-b border-[rgba(180,140,80,0.2)] overflow-hidden relative" +
            (expGlow ? " ring-4 ring-violet-300/60 ring-offset-0 animate-pulse" : "")
          }
        >
          {/* XP Bar gradient (no animation/particles) */}
          <div
            className="h-8"
            style={{
              width: `${Math.min(
                100,
                (character.experience / character.getExperienceToNextLevel()) * 100
              )}%`,
              transition: "width 0.3s",
              position: "relative",
              zIndex: 1,
              background: "linear-gradient(to right, #3b185f, #6d28d9)",
              boxShadow: expGlow
                ? "0 0 24px 8px #a78bfa, 0 0 48px 16px #f0abfc"
                : undefined,
              filter: "contrast(1.25) brightness(1.1)",
            }}
          />
          {/* Subtle noise overlay */}
          <div
            className="xpbar-noise-overlay"
          />
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold"
            style={{
              color: "rgba(255,255,255,0.7)",
              textShadow: "0 1px 4px rgba(0,0,0,0.25)",
              mixBlendMode: "screen",
              background: "rgba(0,0,0,0.08)",
              borderRadius: "0.25rem",
              padding: "0.1rem 0.5rem",
              zIndex: 4,
            }}
          >
            {character.experience} / {character.getExperienceToNextLevel()} (Level {character.level})
          </div>
        </div>
      </div>
      {/* Remove top padding from combat content */}
      <div className="w-full flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-1 tracking-wide">Combat</h2>
        {/* Enemy Counter */}
        <div className="mb-2 text-sm text-gray-300">
          Enemy {enemyIndex + 1} / {enemyCount}
        </div>
        <div className="flex flex-row gap-20 p-5">
          {/* Character Details */}
          <div className="flex flex-col items-center">
            {character && effectiveStats ? (
              <>
                {/* Health Numbers Above Bar */}
                <div className="mb-0.5 text-xs text-white font-bold">
                  {Math.floor(currentHealth)} /{" "}
                  {Math.floor(effectiveStats.health)}
                </div>
                {/* Thin Health Bar */}
                <div className="w-28 h-2.5 health-bar-container mb-1 relative">
                  <div
                    className="h-full health-bar-fill-player"
                    style={{
                      width: `${Math.max(
                        0,
                        (currentHealth / effectiveStats.health) * 100
                      )}%`,
                      transition: "width 0.3s",
                    }}
                  />
                  {/* Player Damage Number */}
                  {playerDamage !== null && (
                    <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-red-300 text-xs font-bold pointer-events-none select-none animate-damage-float">
                      {playerDamage}
                    </span>
                  )}
                </div>
                {isDead ? (
                  "Dead"
                ) : (
                  <div className="flex justify-center">
                    <img
                      src={`${spritePath}/${character.sprite}`}
                      alt={"Player"}
                      className={`equipment-img mb-2 transition-filter duration-200 ${
                        playerDamage !== null ? "red-hit" : ""
                      }`}
                      width={32}
                      height={32}
                    />
                  </div>
                )}
                <div className="font-bold text-center">Player</div>
                <div>Damage: {effectiveStats.damage}</div>
                <div>Armor: {effectiveStats.armor}</div>
                <div>Attack Speed: {effectiveStats.attackSpeed.toFixed(1)}</div>
              </>
            ) : (
              <div>No character!</div>
            )}
          </div>

          <div className="flex flex-col items-center">
            {/* Enemy Details */}
            {currentEnemy ? (
              <>
                {/* Health Numbers Above Bar */}
                <div className="mb-0.5 text-xs text-white font-bold">
                  {Math.floor(currentEnemyHealth)} /{" "}
                  {Math.floor(currentEnemy.health)}
                </div>
                {/* Thin Health Bar */}
                <div className="w-32 h-2.5 health-bar-container mb-1 relative">
                  <div
                    className="h-full health-bar-fill-enemy"
                    style={{
                      width: `${Math.max(
                        0,
                        (currentEnemyHealth / currentEnemy.health) * 100
                      )}%`,
                      transition: "width 0.3s",
                    }}
                  />
                  {/* Enemy Damage Number */}
                  {enemyDamage !== null && (
                    <span className="absolute left-1/2 -translate-x-1/2 -top-7 text-yellow-200 text-xs font-bold pointer-events-none select-none animate-damage-float">
                      {enemyDamage}
                    </span>
                  )}
                </div>
                <div className="flex justify-center">
                  <img
                    src={`${spritePath}/${currentEnemy.sprite}`}
                    alt={currentEnemy.name}
                    className={`equipment-img mb-2 transition-filter duration-200 ${
                      enemyDamage !== null ? "red-hit" : ""
                    }`}
                    width={32}
                    height={32}
                  />
                </div>
                <div className="font-bold text-center">{currentEnemy.name}</div>
                <div>Damage: {currentEnemy.damage}</div>
                <div>Armor: {currentEnemy.armor}</div>
                <div>Attack Speed: {currentEnemy.attackSpeed.toFixed(1)}</div>
              </>
            ) : (
              <div>No enemy!</div>
            )}
          </div>
        </div>
        {/* Pause / Resume button */}
        <button
          className="game-button mt-4"
          onClick={() => handleButtonClick()}
        >
          {isDead ? "Restart Combat" : isPaused ? "Start Combat" : "Pause Combat"}
        </button>
      </div>
    </div>
  );
};

export default CombatBox;
