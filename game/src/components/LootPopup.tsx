import React, { useEffect, useState } from "react";
import type { InventoryItemUnion } from "../types/interfaces/character";
import { getItemBorderColorClass } from "../game/util";

interface LootPopupProps {
  items: InventoryItemUnion[];
  spritePath: string;
  onComplete: () => void;
}

interface PopupItem {
  item: InventoryItemUnion;
  visible: boolean;
}

const tierTextColor: Record<string, string> = {
  wood: "text-gray-200",
  iron: "text-green-400",
  gold: "text-yellow-300",
  diamond: "text-blue-400",
  none: "text-gray-400",
};

const getItemDisplayName = (item: InventoryItemUnion): string => {
  const tierStr = item.tier && item.tier !== "none"
    ? item.tier.charAt(0).toUpperCase() + item.tier.slice(1) + " "
    : "";

  if ("weaponType" in item) {
    return tierStr + item.weaponType.charAt(0).toUpperCase() + item.weaponType.slice(1);
  }
  // All items have a slot, use it for display name
  const slotName = item.slot.charAt(0).toUpperCase() + item.slot.slice(1);
  return tierStr + slotName;
};

export const LootPopup: React.FC<LootPopupProps> = ({ items, spritePath, onComplete }) => {
  const [popupItems, setPopupItems] = useState<PopupItem[]>([]);

  useEffect(() => {
    if (items.length === 0) return;

    // Initialize all items
    setPopupItems(items.map(item => ({ item, visible: true })));

    // Remove items one by one after animation
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    items.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setPopupItems(prev => {
          const newItems = [...prev];
          if (newItems[index]) {
            newItems[index] = { ...newItems[index], visible: false };
          }
          return newItems;
        });
      }, 2000 + index * 200); // Stagger removal
      timeouts.push(timeout);
    });

    // Call onComplete after all animations
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 2500 + items.length * 200);
    timeouts.push(completeTimeout);

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, [items, onComplete]);

  if (popupItems.length === 0) return null;

  return (
    <div className="loot-popup-container absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute right-4 top-1/2 flex flex-col items-end gap-2">
        {popupItems.map((popup, index) => (
          popup.visible && (
            <div
              key={popup.item.id}
              className="loot-popup-item flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900/90 border border-zinc-600"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded ${getItemBorderColorClass(popup.item.tier)}`}
                style={{ borderWidth: 2 }}
              >
                <img
                  src={`${spritePath}/${popup.item.sprite}`}
                  alt={getItemDisplayName(popup.item)}
                  className="w-6 h-6"
                />
              </div>
              <span className={`text-sm font-medium ${tierTextColor[popup.item.tier?.toString().toLowerCase() ?? "none"]}`}>
                {getItemDisplayName(popup.item)}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default LootPopup;
