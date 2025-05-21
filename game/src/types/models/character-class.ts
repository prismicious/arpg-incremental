import type { ICharacter, InventoryItemUnion } from "../interfaces/character";
import type { Equipment } from "../interfaces/equipment";
import type {
  Amulet,
  Chest,
  Helmet,
  Potion,
  Weapon,
} from "../interfaces/inventory-item";
import type { Stats } from "../interfaces/stats";

export class Character implements ICharacter {
  stats: Stats;
  inventory: InventoryItemUnion[];
  equipment: Equipment;
  sprite: string;
  experience: number = 0;
  level: number = 1;
  totalExperience: number = 0;
  unallocAttrPts: number = 0;
  gold: number = 0;

  constructor(
    stats: Stats,
    inventory: InventoryItemUnion[],
    equipment: Equipment,
    sprite: string
  ) {
    this.stats = stats;
    this.inventory = inventory;
    this.equipment = equipment;
    this.sprite = sprite;
  }

  // TODO: Fix this mess
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFightEnd(amount: number, loot: any): void {
    console.log("Combat ended, gained experience:", amount);
    console.log("Loot received:", loot);
    this.experience += amount;
    this.totalExperience += amount;
    this.distributeLoot(loot);
    if (this.checkLevelUpThreshold()) {
      this.levelUp();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  distributeLoot(loot: any): void {
    console.log("Pushing loot to inventory", loot);
    this.inventory.push(...loot);
  }

  checkLevelUpThreshold(): boolean {
    if (this.experience >= this.getExperienceToNextLevel()) {
      return true;
    }
    return false;
  }

  levelUp(): void {
    this.experience -= this.getExperienceToNextLevel();
    this.level++;
    this.unallocAttrPts += 4; // Example: 5 points to allocate on level up
  }

  getExperienceToNextLevel(): number {
    return Math.floor(this.level * 100 * 1.25);
  }

  addItemToInventory(item: InventoryItemUnion | InventoryItemUnion[]): void {
    if (Array.isArray(item)) {
      this.inventory.push(...item);
      return;
    }

    this.inventory.push(item);
  }

  equipItem(item: InventoryItemUnion): void {
    if (!item) return;
    const slot = item.slot;
    if (slot === "ring") {
      // Ring 2
      if (!this.equipment.ring2 && this.equipment.ring1) {
        const prevEquipped = this.equipment.ring2;
        let newInventory = this.inventory.filter((i) => i.id !== item.id);
        if (prevEquipped) {
          newInventory = [...newInventory, prevEquipped];
        }
        this.equipment.ring2 = item;
        this.inventory = newInventory;
      } else {
        // Ring 1
        const prevEquipped = this.equipment.ring1;
        let newInventory = this.inventory.filter((i) => i.id !== item.id);
        if (prevEquipped) {
          newInventory = [...newInventory, prevEquipped];
        }
        this.equipment.ring1 = item;
        this.inventory = newInventory;
      }
      return;
    }
    // For all other slots
    const prevEquipped = this.equipment[slot];

    let newInventory = this.inventory.filter((i) => i.id !== item.id);
    if (prevEquipped) {
      newInventory = [...newInventory, prevEquipped];
    }

    // this.equipment[slot] = item as ItemTypeMapping[slot];

    if (slot === "weapon") this.equipment[slot] = item as Weapon;
    if (slot === "chest") this.equipment[slot] = item as Chest;
    if (slot === "helmet") this.equipment[slot] = item as Helmet;
    if (slot === "amulet") this.equipment[slot] = item as Amulet;
    if (slot === "potion") this.equipment[slot] = item as Potion;

    this.inventory = newInventory;
  }
}
