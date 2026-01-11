import React, { useEffect, useState } from "react";
import type { InventoryItemUnion } from "../types/interfaces/character";
import { getItemBorderColorClass } from "../game/util";

interface LootToastProps {
  items: InventoryItemUnion[];
  spritePath: string;
  onComplete: () => void;
}

interface ToastItem {
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
  const slotName = item.slot.charAt(0).toUpperCase() + item.slot.slice(1);
  return tierStr + slotName;
};

export const LootToast: React.FC<LootToastProps> = ({ items, spritePath, onComplete }) => {
  const [toastItems, setToastItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (items.length === 0) return;

    // Initialize all items with staggered appearance
    const newItems = items.map(item => ({ item, visible: false }));
    setToastItems(newItems);

    // Show items one by one
    const showTimeouts: ReturnType<typeof setTimeout>[] = [];
    items.forEach((_, index) => {
      const showTimeout = setTimeout(() => {
        setToastItems(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], visible: true };
          }
          return updated;
        });
      }, index * 150);
      showTimeouts.push(showTimeout);
    });

    // Hide items after delay
    const hideTimeouts: ReturnType<typeof setTimeout>[] = [];
    items.forEach((_, index) => {
      const hideTimeout = setTimeout(() => {
        setToastItems(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], visible: false };
          }
          return updated;
        });
      }, 3000 + index * 150);
      hideTimeouts.push(hideTimeout);
    });

    // Complete after all animations
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 3500 + items.length * 150);

    return () => {
      showTimeouts.forEach(t => clearTimeout(t));
      hideTimeouts.forEach(t => clearTimeout(t));
      clearTimeout(completeTimeout);
    };
  }, [items, onComplete]);

  if (toastItems.length === 0) return null;

  return (
    <div className="loot-toast-container fixed top-20 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      {toastItems.map((toast, index) => (
        <div
          key={toast.item.id}
          className={`loot-toast-item flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 ${
            toast.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
          style={{
            background: "rgba(12, 12, 14, 0.95)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            transitionDelay: `${index * 50}ms`,
          }}
        >
          <div
            className={`w-8 h-8 flex items-center justify-center rounded ${getItemBorderColorClass(toast.item.tier)}`}
            style={{ borderWidth: 2 }}
          >
            <img
              src={`${spritePath}/${toast.item.sprite}`}
              alt={getItemDisplayName(toast.item)}
              className="w-6 h-6"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Loot acquired</span>
            <span className={`text-sm font-medium ${tierTextColor[toast.item.tier?.toString().toLowerCase() ?? "none"]}`}>
              {getItemDisplayName(toast.item)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LootToast;
