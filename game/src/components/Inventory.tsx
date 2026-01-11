import React, { useState, type JSX } from "react";
import { equipItem } from "../game/utils/equipItem";
import type { Character } from "../types/models/character-class";
import { capitalize, getItemBorderColorClass } from "../game/util";

interface InventoryProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  spritePath: string;
}

export const Inventory: React.FC<InventoryProps> = ({character, setCharacter, spritePath}) => {

    React.useEffect(() => {

    }, [character])

    // Tooltip component
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tooltip: React.FC<{ item: any; children: React.ReactNode }> = ({ item, children }) => {
      const [visible, setVisible] = useState(false);
      const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

      // Helper to render stats in "+X stat" format
      const renderStats = () => {
        if (!item) return null;
        const stats: JSX.Element[] = [];
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
      let itemName = item.name;
      if (item.weaponType && item.tier) {
        itemName = `${capitalize(item.tier)} ${capitalize(item.weaponType)}`;
      } else {
        const tierStr = item.tier ? capitalize(item.tier) : "";
        if (item.slot) {
          itemName = tierStr ? `${tierStr} ${capitalize(item.slot)}` : capitalize(item.slot);
        } else if (item.name) {
          itemName = tierStr ? `${tierStr} ${capitalize(item.name)}` : capitalize(item.name);
        } else {
          itemName = tierStr;
        }
      }
      const label = itemName
      // Color map for tiers
      const tierColor: Record<string, string> = {
        wood: "text-white",
        iron: "text-green-400",
        gold: "text-yellow-300",
        diamond: "text-blue-400",
      };

      // Get color class for current tier, fallback to white
      const labelColor = tierColor[item.tier?.toString().toLowerCase()] || "text-white";

      // Mouse move handler to update tooltip position
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

    return (
        <div className="game-panel-inner rounded-lg p-3 flex flex-col items-center justify-center text-xs">
        <div
          className="inventory-grid grid grid-cols-8 gap-2"
          style={{
            justifyItems: "center",
            alignItems: "center",
            maxHeight: "260px",
            overflowY: "auto",
          }}
        >
            {/* Map through the inventory items and display them */}
            {character.inventory.map((item, index) => {
              const borderColor = getItemBorderColorClass(item.tier);
              return (
                <div
                  key={index}
                  className={`inventory-item border ${borderColor} rounded flex items-center justify-center p-0.5 bg-zinc-800`}
                  style={{ width: 36, height: 36 }}
                  onClick={() => equipItem(item, character, setCharacter)}
                >
                  <Tooltip item={item}>
                    <img
                      src={`${spritePath}/${item.sprite}`}
                      alt={`${item.tier} ${item.type}`}
                      className="equipment-img"
                      style={{ width: 28, height: 28 }}
                    />
                  </Tooltip>
                </div>
              );
            })}
        </div>
        </div>
    );
}
