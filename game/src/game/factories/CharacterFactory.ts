import type { Character } from "../../types/interfaces/character";
import { TiersEnum } from "../../types/interfaces/enums";
import { createWeapon } from "./EquipmentFactory";

export function createDefaultCharacter(): Character {
  return {
    health: 100,
    currentHealth: 100,
    mana: 0,
    currentMana: 0,
    Stats: {
      damage: 5,
      armor: 5,
      strength: 1,
      dexterity: 1,
      intelligence: 1,
    },
    inventory: [],
    attackSpeed: 1,
    equipment: {
      weapon: createWeapon("sword", 5, TiersEnum.wood),
      armor: null,
      helmet: null,
      ring1: null,
      ring2: null,
      amulet: null,
      spells: [],
    },
  };
}
