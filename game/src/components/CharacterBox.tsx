import React from "react";
import type { Character } from "../types/interfaces/character";
import type { Stats } from "../types/interfaces/stats";
import { calculateEffectiveStats } from "../game/util";
import {
  createWeapon,
  createArmor,
  createRing,
  createAmulet,
} from "../game/factories/EquipmentFactory";

interface CharacterBoxProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  effectiveStats: Stats;
  setEffectiveStats: React.Dispatch<React.SetStateAction<Stats>>;
  spritePath: string;
}

const exampleInventory = {
  weapon: createWeapon("dagger", 1, "iron"),
  helmet: createArmor("helmet", 1, "diamond"),
  ring1: createRing("wood", 1),
  ring2: createRing("iron", 1),
  amulet: createAmulet("wood"),
};

export const CharacterBox: React.FC<CharacterBoxProps> = ({
  character,
  setCharacter,
  effectiveStats,
  setEffectiveStats,
  spritePath,
}) => {
  // Update effective stats when character changes
  React.useEffect(() => {
    setEffectiveStats(calculateEffectiveStats(character));
  }, [character, setEffectiveStats]);

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
    <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Character</h2>
      {/* Horizontal equipment row */}
      <div className="flex flex-row flex-wrap gap-4 justify-center items-end w-full mb-6">
        {/* Helmet */}
        <div className="flex flex-col items-center">
          {character.equipment.helmet && (
            <img
              src={`${spritePath}/${character.equipment.helmet.sprite}`}
              alt="Helmet"
              className="equipment-img mb-1"
            />
          )}
          <div className="text-xs">Helmet</div>
          <div className="text-xs">
            {character.equipment.helmet
              ? `${character.equipment.helmet.tier}`
              : "None"}
          </div>
          <button
            className="mt-1 bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
            onClick={equipHelmet}
          >
            Equip
          </button>
        </div>
        {/* Amulet */}
        <div className="flex flex-col items-center">
          {character.equipment.amulet && (
            <img
              src={`${spritePath}/${character.equipment.amulet.sprite}`}
              alt="Amulet"
              className="equipment-img mb-1"
            />
          )}
          <div className="text-xs">Amulet</div>
          <div className="text-xs">
            {character.equipment.amulet
              ? `${character.equipment.amulet.slot}`
              : "None"}
          </div>
          <button
            className="mt-1 bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
            onClick={equipAmulet}
          >
            Equip
          </button>
        </div>
        {/* Ring 1 */}
        <div className="flex flex-col items-center">
          {character.equipment.ring1 && (
            <img
              src={`${spritePath}/${character.equipment.ring1.sprite}`}
              alt="Ring 1"
              className="equipment-img mb-1"
            />
          )}
          <div className="text-xs">Ring 1</div>
          <div className="text-xs">
            {character.equipment.ring1
              ? `${character.equipment.ring1.slot}`
              : "None"}
          </div>
          <button
            className="mt-1 bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
            onClick={equipRing1}
          >
            Equip
          </button>
        </div>
        {/* Ring 2 */}
        <div className="flex flex-col items-center">
          {character.equipment.ring2 && (
            <img
              src={`${spritePath}/${character.equipment.ring2.sprite}`}
              alt="Ring 2"
              className="equipment-img mb-1"
            />
          )}
          <div className="text-xs">Ring 2</div>
          <div className="text-xs">
            {character.equipment.ring2
              ? `${character.equipment.ring2.slot}`
              : "None"}
          </div>
        </div>
        {/* Armor */}
        <div className="flex flex-col items-center">
          {character.equipment.chest && (
            <img
              src={`${spritePath}/${character.equipment.chest.sprite}`}
              alt="Chestplate"
              className="equipment-img mb-1"
            />
          )}
          <div className="text-xs">Chestplate</div>
          <div className="text-xs">
            {character.equipment.chest
              ? `${character.equipment.chest.tier}`
              : "None"}
          </div>
        </div>
        {/* Weapon */}
        <div className="flex flex-col items-center">
          {character.equipment.weapon && (
            <img
              src={`${spritePath}/${character.equipment.weapon.sprite}`}
              alt="Weapon"
              className="equipment-img mb-1"
            />
          )}
          <div className="text-xs">Weapon</div>
          <div className="text-xs">
            {character.equipment.weapon
              ? `${character.equipment.weapon.tier}`
              : "None"}
          </div>
          <button
            className="mt-1 bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
            onClick={equipWeapon}
          >
            Equip
          </button>
        </div>
      </div>
      {/* Stats below the equipment row */}
      <div className="mt-2">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <div>Health: {effectiveStats.health}</div>
          <div>Mana: {effectiveStats.mana}</div>
          <div>Damage: {effectiveStats.damage}</div>
          <div>Attack Speed: {effectiveStats.attackSpeed}</div>
          <div>Armor: {effectiveStats.armor}</div>
          <div>Strength: {effectiveStats.strength}</div>
          <div>Dexterity: {effectiveStats.dexterity}</div>
          <div>Intelligence: {effectiveStats.intelligence}</div>
        </div>
      </div>
    </div>
  );
};

export default CharacterBox;
