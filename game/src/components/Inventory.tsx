import React, { useState, type JSX } from "react";
import { equipItem } from "../game/utils/equipItem";
import type { Character } from "../types/models/character-class";

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

      // Helper to render stats in "+X stat" format
      const renderStats = () => {
        if (!item) return null;
        const stats: JSX.Element[] = [];
        if (item.type === "weapon") {
          if (item.damage) stats.push(<div key="damage">{`+${item.damage} damage`}</div>);
          if (item.attackSpeed) stats.push(<div key="attackSpeed">{`+${item.attackSpeed} attack speed`}</div>);
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
      const label = `${item.tier ? item.tier : ""} ${item.name || item.slot || item.type}`.trim();

      // Color map for tiers
      const tierColor: Record<string, string> = {
        wood: "text-white",
        iron: "text-green-400",
        gold: "text-yellow-300",
        diamond: "text-blue-400",
      };

      // Get color class for current tier, fallback to white
      const labelColor = tierColor[item.tier?.toString().toLowerCase()] || "text-white";

      return (
        <div
          className="relative inline-block"
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          {children}
          {visible && item && (
            <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-2 min-w-[180px] bg-zinc-900/95 text-white text-xs rounded-lg shadow-xl border border-amber-400 px-4 py-3 pointer-events-none"
                 style={{ whiteSpace: "nowrap" }}>
              <div className={`font-bold mb-1 ${labelColor}`}>{label}</div>
              {renderStats()}
            </div>
          )}
        </div>
      );
    };

    return (
        <div className="inventory">
        <h2>Inventory</h2>
        <div className="inventory-grid grid grid-cols-4 gap-4">
            {/* Map through the inventory items and display them */}
            {character.inventory.map((item, index) => (
            <div key={index} className="inventory-item border-2 border-black rounded p-2" onClick={() => equipItem(item, character, setCharacter)}>
                <Tooltip item={item}>
                  <img src={`${spritePath}/${item.sprite}`} alt={`${item.tier} ${item.type}`} />
                </Tooltip>
            </div>
            ))}
            
        </div>
        </div>
    );
}