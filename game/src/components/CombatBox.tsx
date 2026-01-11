import React, { useReducer, useEffect, useRef, useState, useCallback } from "react";
import { reducer, initialState } from "../game/reducers";
import type { EnemyWave } from "../types/models/enemy-wave-class";
import { Character } from "../types/models/character-class";
import type { Stats } from "../types/interfaces/stats";
import type { InventoryItemUnion } from "../types/interfaces/character";
import { CombatLog, type CombatLogEntry } from "./CombatLog";
import { LootPopup } from "./LootPopup";
import { PostGameScreen } from "./PostGameScreen";
import "./CombatBox.css";

interface CombatBoxProps {
  character: Character;
  effectiveStats: Stats;
  currentWave: EnemyWave;
  spritePath: string;
  onWaveComplete?: () => void;
  onReturnToWaveSelect?: () => void;
}

export const CombatBox: React.FC<CombatBoxProps> = ({
  character,
  effectiveStats,
  currentWave,
  spritePath,
  onWaveComplete,
  onReturnToWaveSelect,
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
  const [waveComplete, setWaveComplete] = useState(false);

  // Wave stats tracking
  const [waveLoot, setWaveLoot] = useState<InventoryItemUnion[]>([]);
  const [waveGold, setWaveGold] = useState(0);
  const [initialLevel] = useState(character.level); // Track level at start of wave

  // Damage number state
  const [playerDamage, setPlayerDamage] = useState<number | null>(null);
  const [enemyDamage, setEnemyDamage] = useState<number | null>(null);
  const [isEnemyCrit, setIsEnemyCrit] = useState(false);
  const playerDamageTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const enemyDamageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Level up glow effect state
  const [expGlow, setExpGlow] = useState(false);
  const prevLevel = useRef(character.level);

  // Combat log state
  const [combatLog, setCombatLog] = useState<CombatLogEntry[]>([]);
  const logIdRef = useRef(0);

  // Loot popup state
  const [lootItems, setLootItems] = useState<InventoryItemUnion[]>([]);

  const addLogEntry = useCallback((type: CombatLogEntry["type"], message: string, damage?: number) => {
    setCombatLog(prev => [...prev.slice(-49), {
      id: ++logIdRef.current,
      type,
      message,
      damage
    }]);
  }, []);

  const handleLootComplete = useCallback(() => {
    setLootItems([]);
  }, []);


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
      if (waveComplete) return;
      if (!currentEnemy) return;
      if (currentHealth <= 0) {
        addLogEntry("player-died", "You have been defeated!");
        dispatch({
          type: "END_COMBAT",
        });
        // Auto-return to wave select after short delay
        setTimeout(() => {
          onReturnToWaveSelect?.();
        }, 1500);
        return;
      }
      if (currentEnemyHealth <= 0) {
        // Log enemy killed
        addLogEntry("enemy-killed", `${currentEnemy.name} defeated!`);

        // Track wave stats
        setWaveGold(prev => prev + currentEnemy.goldDropped);
        if (currentEnemy.loot.length > 0) {
          setWaveLoot(prev => [...prev, ...currentEnemy.loot]);
        }

        // Log gold gained
        if (currentEnemy.goldDropped > 0) {
          addLogEntry("gold", `+${currentEnemy.goldDropped} gold`);
        }

        // Show loot popup and log if there's loot
        if (currentEnemy.loot.length > 0) {
          setLootItems(currentEnemy.loot);

          // Log each loot item
          currentEnemy.loot.forEach(item => {
            const tierStr = item.tier && item.tier !== "none"
              ? item.tier.charAt(0).toUpperCase() + item.tier.slice(1) + " "
              : "";
            const itemName = "weaponType" in item
              ? tierStr + item.weaponType.charAt(0).toUpperCase() + item.weaponType.slice(1)
              : tierStr + item.slot.charAt(0).toUpperCase() + item.slot.slice(1);
            addLogEntry("loot", `Acquired: ${itemName}`);
          });
        }

        character.handleFightEnd(
          currentEnemy.experienceGranted,
          currentEnemy.loot,
          currentEnemy.goldDropped
        );

        // Check if this was the last enemy
        if (enemyIndex + 1 >= currentWave.enemies.length) {
          addLogEntry("enemy-killed", "Wave Complete! All enemies defeated!");
          setWaveComplete(true);
          return;
        }

        dispatch({
          type: "NEXT_ENEMY",
          payload: { enemies: currentWave.enemies },
        });
      } else if (playerNextAttack > enemyNextAttack) {
        // Enemy attacks player
        const dmg = Math.max(currentEnemy.damage - effectiveStats.armor, 0);
        setPlayerDamage(dmg);
        addLogEntry("enemy-attack", `${currentEnemy.name} hit you for ${dmg} damage`, dmg);
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
        const baseDmg = Math.max(effectiveStats.damage - currentEnemy.armor, 0);
        // Crit chance: 10% base + 1% per DEX
        const critChance = 0.10 + (effectiveStats.dexterity * 0.01);
        const isCrit = Math.random() < critChance;
        const dmg = isCrit ? baseDmg * 2 : baseDmg;

        setEnemyDamage(dmg);
        setIsEnemyCrit(isCrit);

        if (isCrit) {
          addLogEntry("crit", `CRITICAL! You hit ${currentEnemy.name} for ${dmg} damage!`, dmg);
        } else {
          addLogEntry("player-attack", `You hit ${currentEnemy.name} for ${dmg} damage`, dmg);
        }

        if (enemyDamageTimeout.current)
          clearTimeout(enemyDamageTimeout.current);
        enemyDamageTimeout.current = setTimeout(() => {
          setEnemyDamage(null);
          setIsEnemyCrit(false);
        }, 120);

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
    waveComplete,
    currentEnemyHealth,
    playerNextAttack,
    enemyNextAttack,
    currentWave.enemies,
    effectiveStats,
    character,
    currentEnemy,
    currentHealth,
    addLogEntry,
    onReturnToWaveSelect,
  ]);

  useEffect(() => {
    if (character.level > prevLevel.current) {
      setExpGlow(true);
      prevLevel.current = character.level;
      setTimeout(() => setExpGlow(false), 900);
    }
  }, [character.level]);


  // Show post-game screen when wave is complete
  if (waveComplete) {
    return (
      <div className="game-combat-panel flex items-center justify-center">
        <PostGameScreen
          lootCollected={waveLoot}
          goldEarned={waveGold}
          character={character}
          previousLevel={initialLevel}
          onContinue={() => onWaveComplete?.()}
          onWaveSelect={() => onReturnToWaveSelect?.()}
          spritePath={spritePath}
        />
      </div>
    );
  }

  return (
    <div className="game-combat-panel flex flex-col">
      <div className="flex-1 flex flex-col p-6 relative">
        {/* Loot Popup Overlay */}
        {lootItems.length > 0 && (
          <LootPopup
            items={lootItems}
            spritePath={spritePath}
            onComplete={handleLootComplete}
          />
        )}
        {/* EXP Bar at the very top, embedded into the box */}
        <div className="absolute left-0 top-0 w-full">
        <div
          className={
            "w-full h-9 bg-zinc-800 border-b-3 border-[rgba(180,140,80,0.3)] overflow-hidden relative" +
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
      {/* Add top padding to account for absolute XP bar */}
      <div className="w-full flex flex-col items-center pt-12">
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
                  <div className="text-red-500 font-bold text-2xl">DEAD</div>
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
                    <span className={`absolute left-1/2 -translate-x-1/2 -top-7 font-bold pointer-events-none select-none animate-damage-float ${
                      isEnemyCrit ? "text-orange-400 text-sm" : "text-yellow-200 text-xs"
                    }`}>
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
        {/* Combat buttons */}
        <div className="flex gap-3 mt-4">
          {waveComplete ? (
            <>
              <button
                className="game-button"
                onClick={() => onWaveComplete?.()}
              >
                Continue (Unlock Next)
              </button>
              <button
                className="game-button"
                onClick={() => onReturnToWaveSelect?.()}
              >
                Wave Select
              </button>
            </>
          ) : !isDead && (
            (() => {
              const potion = character.inventory.find(item => item.type === "potion");
              const potionCount = character.inventory.filter(item => item.type === "potion").length;
              return (
                <button
                  className={`game-button ${!potion ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={!potion}
                  onClick={() => {
                    if (potion && "healAmount" in potion) {
                      dispatch({
                        type: "HEAL_PLAYER",
                        payload: { amount: potion.healAmount, maxHealth: effectiveStats.health },
                      });
                      character.inventory = character.inventory.filter(i => i.id !== potion.id);
                      addLogEntry("loot", `Used potion: +${potion.healAmount} HP`);
                    }
                  }}
                >
                  Potion ({potionCount})
                </button>
              );
            })()
          )}
        </div>
      </div>
      </div>
      {/* Combat Log below combat area */}
      <CombatLog entries={combatLog} />
    </div>
  );
};

export default CombatBox;
