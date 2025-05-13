import React from "react";
import type { IEnemy } from "../types/interfaces/enemy";

interface CombatBoxProps {
  currentEnemy: IEnemy | null;
  spritePath: string;
  enemyIndex: number;
  enemyCount: number;
}

export const CombatBox: React.FC<CombatBoxProps> = ({
  currentEnemy,
  spritePath,
  enemyIndex,
  enemyCount,
}) => (
  <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
    <h2 className="text-xl font-semibold mb-2">Combat</h2>
    {/* Enemy Counter */}
    <div className="mb-2 text-sm text-gray-300">
      Enemy {enemyIndex + 1} / {enemyCount}
    </div>
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
          Health: {currentEnemy.health} / {currentEnemy.maxHealth}
        </div>
        <div>Damage: {currentEnemy.damage}</div>
        <div>Armor: {currentEnemy.armor}</div>
        <div>Attack Speed: {currentEnemy.attackSpeed}</div>
      </>
    ) : (
      <div>No enemy!</div>
    )}
    <button className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
      Attack
    </button>
  </div>
);

export default CombatBox;
