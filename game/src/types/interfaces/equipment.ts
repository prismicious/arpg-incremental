import type { Weapon, Armor, Helmet, Ring, Amulet } from "./inventory-item";
export interface Spell {
  name: string;
  damage: number;
  manaCost: number;
  cooldown: number;
}

export interface Equipment {
  weapon: Weapon | null;
  armor: Armor | null;
  helmet: Helmet | null;
  ring1: Ring | null;
  ring2: Ring | null;
  amulet: Amulet | null;
  spells: Spell[];
}
