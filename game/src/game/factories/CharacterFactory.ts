import type { Character } from "../../types/interfaces/character";
import { TiersEnum } from "../../types/interfaces/enums";
import { createWeapon } from "./EquipmentFactory";

export function createDefaultCharacter(): Character {
  return {
    Stats: {
      health: 100,
      mana: 0,
      damage: 5,
      attackSpeed: 1,
      armor: 5,
      strength: 1,
      dexterity: 1,
      intelligence: 1,
    },
    inventory: [],
    equipment: {
      weapon: createWeapon("sword", 1, TiersEnum.wood),
      chest: null,
      helmet: null,
      ring1: null,
      ring2: null,
      amulet: null,
      potion: null,
      spells: [],
    },
    sprite: "../../../assets/temp/player.png",
  };
}
