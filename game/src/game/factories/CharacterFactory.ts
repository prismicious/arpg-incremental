import { Character } from "../../types/models/character-class";


export function createDefaultCharacter(): Character {

  const stats = {
    health: 50,
    mana: 0,
    damage: 10,
    attackSpeed: 1,
    armor: 2,
    strength: 1,
    dexterity: 1,
    intelligence: 1,
  }

  const defaultEquipment = {
    weapon: null,
    chest: null,
    helmet: null,
    ring1: null,
    ring2: null,
    amulet: null,
    potion: null,
    spells: [],
  }

  return new Character(stats, [], defaultEquipment, "../../../assets/temp/player.png");

  /*return { // This is the old way of creating a character
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
    experience: 0,
    level: 1
  };
  */
}
