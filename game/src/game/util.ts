import type {
  Weapon,
  Armor,
  Trinket,
} from "../types/interfaces/inventory-item";
import type { Stats } from "../types/interfaces/stats";
import { Character } from "../types/models/character-class";

export interface EquipmentTypeMapping {
  weapon: Weapon;
  armor: Armor;
  trinket: Trinket;
}

export function calculateEffectiveStats(character: Character): Stats {
  const effective: Stats = { ...character.stats };

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

    // Attribute bonuses
    effective.damage += character.stats.strength;
    effective.attackSpeed += character.stats.dexterity * 0.01; 
    effective.health += character.stats.strength * 5; // Assuming 5 health per strength
    effective.mana += character.stats.intelligence * 5; // Assuming 5 mana per intelligence 
  }

  const eq = character.equipment;

  for (const equip of Object.values(eq)) {
    if (equip) {
      applyItemStats(equip);
    }
  }

  return effective;
}

export const capitalize = (word: string): string => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
}