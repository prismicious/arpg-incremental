import type { Weapon, Chest, Helmet, Ring, Amulet, Potion } from "./inventory-item";
export interface Spell {
  name: string;
  damage: number;
  manaCost: number;
  cooldown: number;
}

export interface Equipment {
  weapon: Weapon | null;
  chest: Chest | null;
  helmet: Helmet | null;
  ring1: Ring | null;
  ring2: Ring | null;
  amulet: Amulet | null;
  potion: Potion | null;
}
