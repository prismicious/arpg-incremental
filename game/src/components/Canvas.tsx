import React from "react";
import {
  createWeapon,
  createRing,
  createAmulet,
  createArmor,
} from "../game/factories/EquipmentFactory";

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
import LootBox from "./LootBox";

const wave1 = createEnemyWave([orcPrefab, orcPrefab, orcPrefab, goblinPrefab, slimePrefab]);
const allEnemyWaves = new AllEnemyWaves();
allEnemyWaves.addWave(wave1);

const enemyWaveManager = new EnemyWaveManager(allEnemyWaves);

// Example inventory for demonstration (replace with your real inventory logic)
const exampleInventory = {
  weapon: createWeapon("sword", 1, "iron"),
  helmet: createArmor("helmet", 1, "diamond"),
  ring1: createRing("wood", 1),
  ring2: createRing("iron", 1),
  amulet: createAmulet("wood"),
};

const spritePath = "/assets/sprites";

const Canvas: React.FC = () => {
  const [character, setCharacter] = React.useState(createDefaultCharacter());
  const effectiveStats = calculateEffectiveStats(character);

  // Get the current enemy from the wave manager
  const currentEnemy = enemyWaveManager.currentEnemy;
  const currentWave = enemyWaveManager.currentWave;
  const enemyIndex =
    currentWave && currentEnemy
      ? currentWave.enemies.findIndex((e) => e === currentEnemy)
      : 0;
  const enemyCount = currentWave ? currentWave.enemies.length : 0;

  // Equip functions now equip from inventory (example)
  const equipWeapon = () => {
    setCharacter((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        weapon: exampleInventory.weapon,
      },
    }));
  };
  const equipRing1 = () => {
    setCharacter((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        ring1: exampleInventory.ring1,
      },
    }));
  };
  const equipAmulet = () => {
    setCharacter((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        amulet: exampleInventory.amulet,
      },
    }));
  };
  const equipHelmet = () => {
    setCharacter((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        helmet: exampleInventory.helmet,
      },
    }));
  };

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
              effectiveStats={effectiveStats}
              equipWeapon={equipWeapon}
              equipRing1={equipRing1}
              equipAmulet={equipAmulet}
              equipHelmet={equipHelmet}
              spritePath={spritePath}
            />
            {/* Combat Box */}
            <CombatBox
              currentEnemy={currentEnemy}
              spritePath={spritePath}
              enemyIndex={enemyIndex}
              enemyCount={enemyCount}
            />
            {/* Loot Box */}
            <LootBox />
          </div>
        </section>
      </main>
    </section>
  );
};

export default Canvas;
