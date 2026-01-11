import React from "react";
import { Character } from "../types/models/character-class";
import type { Equipment } from "../types/interfaces/equipment";
import type { Stats } from "../types/interfaces/stats";
import { calculateEffectiveStats, getItemBorderColorClass } from "../game/util";
import { Inventory } from "./Inventory";

// Tooltip component (copied from Inventory for consistency)
const Tooltip: React.FC<{ item: any; children: React.ReactNode }> = ({ item, children }) => {
  const [visible, setVisible] = React.useState(false);
  const [pos, setPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const renderStats = () => {
    if (!item) return null;
    const stats: React.ReactNode[] = [];
    if (item.type === "weapon") {
      if (item.damage) stats.push(<div key="damage">{`${item.damage} damage`}</div>);
      if (item.attackSpeed) stats.push(<div key="attackSpeed">{`+${item.attackSpeed.toFixed(2)} attack speed`}</div>);
    }
    if (item.type === "armor") {
      if (item.armor) stats.push(<div key="armor">{`+${item.armor} armor`}</div>);
      if (item.health) stats.push(<div key="health">{`+${item.health} health`}</div>);
    }
    if (item.type === "trinket") {
      if (item.strength) stats.push(<div key="str">{`+${item.strength} str`}</div>);
      if (item.dexterity) stats.push(<div key="dex">{`+${item.dexterity} dex`}</div>);
      if (item.intelligence) stats.push(<div key="int">{`+${item.intelligence} int`}</div>);
    }
    if (item.type === "potion") {
      if (item.healAmount) stats.push(<div key="heal">{`+${item.healAmount} heal`}</div>);
    }
    return stats;
  };

  // Compose label as "{tier} {name}" or "{tier} {slot}" (no "Tier:" line)
  let itemName = item?.name;
  if (item?.weaponType && item?.tier) {
    itemName = `${item.tier.charAt(0).toUpperCase() + item.tier.slice(1)} ${item.weaponType.charAt(0).toUpperCase() + item.weaponType.slice(1)}`;
  } else if (item) {
    const tierStr = item.tier ? item.tier.charAt(0).toUpperCase() + item.tier.slice(1) : "";
    if (item.slot) {
      itemName = tierStr ? `${tierStr} ${item.slot.charAt(0).toUpperCase() + item.slot.slice(1)}` : item.slot.charAt(0).toUpperCase() + item.slot.slice(1);
    } else if (item.name) {
      itemName = tierStr ? `${tierStr} ${item.name.charAt(0).toUpperCase() + item.name.slice(1)}` : item.name.charAt(0).toUpperCase() + item.name.slice(1);
    } else {
      itemName = tierStr;
    }
  }
  const label = itemName;
  const tierColor: Record<string, string> = {
    wood: "text-white",
    iron: "text-green-400",
    gold: "text-yellow-300",
    diamond: "text-blue-400",
  };
  const labelColor = tierColor[item?.tier?.toString().toLowerCase?.()] || "text-white";

  const handleMouseMove = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {visible && item && (
        <div
          className="game-tooltip fixed z-[9999] min-w-[180px] text-white text-xs px-4 py-3 pointer-events-none"
          style={{
            whiteSpace: "nowrap",
            left: pos.x + 12,
            top: pos.y + 12,
          }}
        >
          <div className={`font-bold mb-1 ${labelColor}`}>{label}</div>
          {renderStats()}
        </div>
      )}
    </div>
  );
};

export const CharacterBox: React.FC<{
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  effectiveStats: Stats;
  setEffectiveStats: React.Dispatch<React.SetStateAction<Stats>>;
  spritePath: string;
}> = ({
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

  // Helper to unequip an item from a slot
  const handleUnequip = (slot: keyof Equipment) => {
    setCharacter((prev) => {
      const prevEquipped = prev.equipment[slot];
      if (!prevEquipped) return prev;
      // Remove from equipment, add to inventory
      return new Character(
        prev.stats,
        [...prev.inventory, prevEquipped],
        { ...prev.equipment, [slot]: null },
        prev.sprite
      );
    });
  };

  return (
    <div className="flex flex-col items-center w-full p-6">
      <h2 className="text-xl font-semibold mb-2 text-gray-100">Character</h2>
      <div className="flex flex-row flex-wrap gap-2 justify-center items-end w-full mb-2">
        {/* Helmet */}
        <div className="flex flex-col items-center">
          <Tooltip item={character.equipment.helmet}>
            <div
              className={`item-slot flex items-center justify-center p-1 cursor-pointer ${
                getItemBorderColorClass(character.equipment.helmet?.tier)
              }`}
              style={{ width: 44, height: 44 }}
              onClick={() => handleUnequip("helmet")}
              title={character.equipment.helmet ? "Unequip Helmet" : ""}
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
          </Tooltip>
          <div className="text-xs mt-1">Helmet</div>
        </div>
        {/* Amulet */}
        <div className="flex flex-col items-center">
          <Tooltip item={character.equipment.amulet}>
            <div
              className={`item-slot flex items-center justify-center p-1 cursor-pointer ${
                getItemBorderColorClass(character.equipment.amulet?.tier)
              }`}
              style={{ width: 44, height: 44 }}
              onClick={() => handleUnequip("amulet")}
              title={character.equipment.amulet ? "Unequip Amulet" : ""}
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
          </Tooltip>
          <div className="text-xs mt-1">Amulet</div>
        </div>
        {/* Ring 1 */}
        <div className="flex flex-col items-center">
          <Tooltip item={character.equipment.ring1}>
            <div
              className={`item-slot flex items-center justify-center p-1 cursor-pointer ${
                getItemBorderColorClass(character.equipment.ring1?.tier)
              }`}
              style={{ width: 44, height: 44 }}
              onClick={() => handleUnequip("ring1")}
              title={character.equipment.ring1 ? "Unequip Ring 1" : ""}
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
          </Tooltip>
          <div className="text-xs mt-1">Ring 1</div>
        </div>
        {/* Ring 2 */}
        <div className="flex flex-col items-center">
          <Tooltip item={character.equipment.ring2}>
            <div
              className={`item-slot flex items-center justify-center p-1 cursor-pointer ${
                getItemBorderColorClass(character.equipment.ring2?.tier)
              }`}
              style={{ width: 44, height: 44 }}
              onClick={() => handleUnequip("ring2")}
              title={character.equipment.ring2 ? "Unequip Ring 2" : ""}
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
          </Tooltip>
          <div className="text-xs mt-1">Ring 2</div>
        </div>
        {/* Chestplate */}
        <div className="flex flex-col items-center">
          <Tooltip item={character.equipment.chest}>
            <div
              className={`item-slot flex items-center justify-center p-1 cursor-pointer ${
                getItemBorderColorClass(character.equipment.chest?.tier)
              }`}
              style={{ width: 44, height: 44 }}
              onClick={() => handleUnequip("chest")}
              title={character.equipment.chest ? "Unequip Chestplate" : ""}
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
          </Tooltip>
          <div className="text-xs mt-1">Chest</div>
        </div>
        {/* Weapon */}
        <div className="flex flex-col items-center">
          <Tooltip item={character.equipment.weapon}>
            <div
              className={`item-slot flex items-center justify-center p-1 cursor-pointer ${
                getItemBorderColorClass(character.equipment.weapon?.tier)
              }`}
              style={{ width: 44, height: 44 }}
              onClick={() => handleUnequip("weapon")}
              title={character.equipment.weapon ? "Unequip Weapon" : ""}
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
          </Tooltip>
          <div className="text-xs mt-1">Weapon</div>
        </div>
      </div>
      {/* Stats below the equipment row */}
      <div className="mt-0 mb-2">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-300">
          <div>HP: {effectiveStats.health}</div>
          <div>MP: {effectiveStats.mana}</div>
          <div>DMG: {effectiveStats.damage}</div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-300 mt-1">
          <div>ATKSpd: {effectiveStats.attackSpeed.toFixed(2)}</div>
          <div>ARMOR: {effectiveStats.armor}</div>
        </div>
        {/* Attribute allocation section */}
        {character.unallocAttrPts > 0 && (
          <div className="mt-2 mb-1 text-center text-xs text-violet-400">
            {character.unallocAttrPts} point{character.unallocAttrPts > 1 ? "s" : ""} to allocate!
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-xs text-gray-300 mt-1">
          <div className="flex items-center gap-1">
            <span>STR: {character.stats.strength}</span>
            {character.unallocAttrPts > 0 && (
              <button
                className="w-5 h-5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded"
                onClick={() => {
                  character.allocateAttribute("strength");
                  setCharacter(Object.assign(Object.create(Object.getPrototypeOf(character)), character));
                }}
              >+</button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span>DEX: {character.stats.dexterity}</span>
            {character.unallocAttrPts > 0 && (
              <button
                className="w-5 h-5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded"
                onClick={() => {
                  character.allocateAttribute("dexterity");
                  setCharacter(Object.assign(Object.create(Object.getPrototypeOf(character)), character));
                }}
              >+</button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span>INT: {character.stats.intelligence}</span>
            {character.unallocAttrPts > 0 && (
              <button
                className="w-5 h-5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded"
                onClick={() => {
                  character.allocateAttribute("intelligence");
                  setCharacter(Object.assign(Object.create(Object.getPrototypeOf(character)), character));
                }}
              >+</button>
            )}
          </div>
        </div>
      </div>
      {character && (
        <div className="flex flex-col justify-center w-full px-4 pb-2">
          <div className="mb-1 text-sm font-semibold text-center">Inventory</div>
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
