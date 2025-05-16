import React, { useReducer, useEffect } from "react";
import { reducer, initialState } from "../game/reducers";
import type { EnemyWave } from "../types/models/enemy-wave-class";
import type { Character } from "../types/interfaces/character";
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
  
  useEffect(() => {
    // Initialize combat state
    dispatch({
      type: "INIT_COMBAT",
      payload: { enemies: currentWave.enemies, effectiveStats, character },
    });
  }, [currentWave, effectiveStats, character]);

  useEffect(() => {
    function gameLoop() {
      if (isPaused) return;
      if (!currentEnemy) return;
      if (currentHealth <= 0) {
        dispatch({
          type: "END_COMBAT"})
        return;
      }
      if (currentEnemyHealth <= 0) {
        // Move to the next enemy
        dispatch({
          type: "NEXT_ENEMY",
          payload: { enemies: currentWave.enemies },
        });
      } else if (playerNextAttack > enemyNextAttack) {
        // Enemy attacks player
        dispatch({
          type: "UPDATE_PLAYER_HEALTH",
          payload: {
            damage: Math.max(currentEnemy.damage - effectiveStats.armor, 0),
          },
        });
        dispatch({
          type: "UPDATE_ATTACK_TIMERS",
          payload: { enemyDelay: 1 / currentEnemy.attackSpeed, playerDelay: 0 },
        });
      } else {
        // Player attacks enemy
        dispatch({
          type: "UPDATE_ENEMY_HEALTH",
          payload: {
            damage: Math.max(effectiveStats.damage - currentEnemy.armor, 0),
          },
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
    setIsPaused((prev) => !prev)

  }

  return (
    <div className="bg-gray-800 rounded-lg shadow p-10 flex flex-col items-center ">
      <h2 className="text-xl font-semibold mb-2">Combat</h2>
      {/* Enemy Counter */}
      <div className="mb-2 text-sm text-gray-300">
        Enemy {enemyIndex + 1} / {enemyCount}
      </div>
      <div className="flex flex-row gap-20 p-5">
        {/* Character Details */}
        <div>
          {character && effectiveStats ? (
            <>
              {isDead ? "Dead": 
              <img
                src={`${spritePath}/${character.sprite}`}
                alt={"Player"}
                className="equipment-img mb-2"
                width={32}
                height={32}
              />}
              <div className="font-bold">Player</div>
              <div>
                Health: {currentHealth} / {effectiveStats.health}
              </div>
              <div>Damage: {effectiveStats.damage}</div>
              <div>Armor: {effectiveStats.armor}</div>
              <div>Attack Speed: {effectiveStats.attackSpeed}</div>
            </>
          ) : (
            <div>No character!</div>
          )}
        </div>

        <div>
          {/* Enemy Details */}
          {currentEnemy ? (
            <>
              <img
                src={`${spritePath}/${currentEnemy.sprite}`}
                alt={currentEnemy.name}
                className="equipment-img mb-2"
                width={32}
                height={32}
              />
              <div className="font-bold">{currentEnemy.name}</div>
              <div>
                Health: {currentEnemyHealth} / {currentEnemy.health}
              </div>
              <div>Damage: {currentEnemy.damage}</div>
              <div>Armor: {currentEnemy.armor}</div>
              <div>Attack Speed: {currentEnemy.attackSpeed}</div>
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
        {isDead ? "Restart Combat": isPaused ? "Start Combat" : "Pause Combat"}
      </button>
    </div>
  );
};

export default CombatBox;
