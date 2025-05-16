import type { Character } from "../types/interfaces/character";
import type {
  Weapon,
  Armor,
  Trinket,
} from "../types/interfaces/inventory-item";
import type { Stats } from "../types/interfaces/stats";

export interface EquipmentTypeMapping {
  weapon: Weapon;
  armor: Armor;
  trinket: Trinket;
}

export function calculateEffectiveStats(character: Character): Stats {
  const effective: Stats = { ...character.Stats };

  function applyItemStats<T extends keyof EquipmentTypeMapping>(
    item: EquipmentTypeMapping[T] | null
  ) {
    if (!item) return;

    if (item.type === "weapon") {
      effective.damage += item.damage || 0;
      effective.attackSpeed = item.attackSpeed || 0;
    }
    if (item.type === "armor") {
      effective.armor += item.armor || 0;
      effective.health += item.health || 0;
    }
    if (item.type === "trinket") {
      effective.strength += item.strength || 0;
      effective.dexterity += item.dexterity || 0;
      effective.intelligence += item.intelligence || 0;
    }
  }

  const eq = character.equipment;

  for (const equip of Object.values(eq)) {
    if (equip) {
      applyItemStats(equip);
    }
  }

  return effective;
}
