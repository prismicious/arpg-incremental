import React, { useReducer, useEffect, useRef, useState } from "react";
import { reducer, initialState } from "../game/reducers";
import type { EnemyWave } from "../types/models/enemy-wave-class";
import { Character } from "../types/models/character-class";
import type { Stats } from "../types/interfaces/stats";

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
        // Move to the next enemy
        // WHY IS THIS NOT WORKING!?
        character.handleCombatEnd(currentEnemy.experienceGranted, currentEnemy.loot);
        dispatch({
          type: "END_COMBAT",
          payload: {
            enemies: currentWave.enemies,
            character,
          },
        });
        return;
      }
      if (currentEnemyHealth <= 0) {
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
          700
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
          700
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
    <div className="bg-gray-800 rounded-lg shadow p-10 flex flex-col items-center ">
      <h2 className="text-xl font-semibold mb-2">Combat</h2>
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
              <div className="w-24 h-1 bg-gray-700 rounded mb-1 relative">
                <div
                  className="h-1 bg-green-500 rounded"
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
                    className="equipment-img mb-2"
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
              <div className="w-32 h-1 bg-gray-700 rounded mb-1 relative">
                <div
                  className="h-1 bg-red-500 rounded"
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
                  className="equipment-img mb-2"
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
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        onClick={() => handleButtonClick()}
      >
        {isDead ? "Restart Combat" : isPaused ? "Start Combat" : "Pause Combat"}
      </button>
    </div>
  );
};

export default CombatBox;
