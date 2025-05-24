import React from "react";
import type { Character } from "../types/models/character-class";
import type { Stats } from "../types/interfaces/stats";
import { calculateEffectiveStats } from "../game/util";
import { Inventory } from "./Inventory";

interface CharacterBoxProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  effectiveStats: Stats;
  setEffectiveStats: React.Dispatch<React.SetStateAction<Stats>>;
  spritePath: string;
}

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
    console.log(character);
  }, [character, setEffectiveStats]);

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center max-w-xl w-full mx-auto">
      <h2 className="text-xl font-semibold mb-4">Character</h2>
      {/* Equipment slots as boxes */}
      <div className="flex flex-row flex-wrap gap-3 justify-center items-end w-full mb-4">
        {/* Helmet */}
        <div className="flex flex-col items-center">
          <div
            className="border-2 border-black rounded flex items-center justify-center p-1 bg-zinc-800"
            style={{ width: 40, height: 40 }}
          >
            {character.equipment.helmet && (
              <img
                src={`${spritePath}/${character.equipment.helmet.sprite}`}
                alt="Helmet"
                className="equipment-img"
                style={{ width: 32, height: 32 }}
              />
            )}
          </div>
          <div className="text-xs mt-1">Helmet</div>
        </div>
        {/* Amulet */}
        <div className="flex flex-col items-center">
          <div
            className="border-2 border-black rounded flex items-center justify-center p-1 bg-zinc-800"
            style={{ width: 40, height: 40 }}
          >
            {character.equipment.amulet && (
              <img
                src={`${spritePath}/${character.equipment.amulet.sprite}`}
                alt="Amulet"
                className="equipment-img"
                style={{ width: 32, height: 32 }}
              />
            )}
          </div>
          <div className="text-xs mt-1">Amulet</div>
        </div>
        {/* Ring 1 */}
        <div className="flex flex-col items-center">
          <div
            className="border-2 border-black rounded flex items-center justify-center p-1 bg-zinc-800"
            style={{ width: 40, height: 40 }}
          >
            {character.equipment.ring1 && (
              <img
                src={`${spritePath}/${character.equipment.ring1.sprite}`}
                alt="Ring 1"
                className="equipment-img"
                style={{ width: 32, height: 32 }}
              />
            )}
          </div>
          <div className="text-xs mt-1">Ring 1</div>
        </div>
        {/* Ring 2 */}
        <div className="flex flex-col items-center">
          <div
            className="border-2 border-black rounded flex items-center justify-center p-1 bg-zinc-800"
            style={{ width: 40, height: 40 }}
          >
            {character.equipment.ring2 && (
              <img
                src={`${spritePath}/${character.equipment.ring2.sprite}`}
                alt="Ring 2"
                className="equipment-img"
                style={{ width: 32, height: 32 }}
              />
            )}
          </div>
          <div className="text-xs mt-1">Ring 2</div>
        </div>
        {/* Chestplate */}
        <div className="flex flex-col items-center">
          <div
            className="border-2 border-black rounded flex items-center justify-center p-1 bg-zinc-800"
            style={{ width: 40, height: 40 }}
          >
            {character.equipment.chest && (
              <img
                src={`${spritePath}/${character.equipment.chest.sprite}`}
                alt="Chestplate"
                className="equipment-img"
                style={{ width: 32, height: 32 }}
              />
            )}
          </div>
          <div className="text-xs mt-1">Chest</div>
        </div>
        {/* Weapon */}
        <div className="flex flex-col items-center">
          <div
            className="border-2 border-black rounded flex items-center justify-center p-1 bg-zinc-800"
            style={{ width: 40, height: 40 }}
          >
            {character.equipment.weapon && (
              <img
                src={`${spritePath}/${character.equipment.weapon.sprite}`}
                alt="Weapon"
                className="equipment-img"
                style={{ width: 32, height: 32 }}
              />
            )}
          </div>
          <div className="text-xs mt-1">Weapon</div>
        </div>
      </div>
      {/* Stats below the equipment row */}
      <div className="mt-0 mb-2">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <div>HP: {effectiveStats.health}</div>
          <div>MP: {effectiveStats.mana}</div>
          <div>DMG: {effectiveStats.damage}</div>
          <div>ATKSpd: {effectiveStats.attackSpeed.toFixed(2)}</div>
          <div>ARMOR: {effectiveStats.armor}</div>
          <div>STR: {effectiveStats.strength}</div>
          <div>DEX: {effectiveStats.dexterity}</div>
          <div>INT: {effectiveStats.intelligence}</div>
        </div>
      </div>
      {character && (
        <div className="flex justify-center w-full">
          <Inventory
            character={character}
            setCharacter={setCharacter}
            spritePath={spritePath}
          />
        </div>
      )}
    </div>
  );
};

export default CharacterBox;
