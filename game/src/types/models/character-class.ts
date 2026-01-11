import type { ICharacter, InventoryItemUnion } from "../interfaces/character";
import type { Equipment } from "../interfaces/equipment";
import type {
  Amulet,
  Chest,
  Helmet,
  Potion,
  Ring,
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

  handleFightEnd(amount: number, loot: InventoryItemUnion[], gold: number): void {
    console.log("Combat ended, gained experience:", amount);
    console.log("Loot received:", loot);
    console.log("Gold received:", gold);
    this.experience += amount;
    this.totalExperience += amount;
    this.gold += gold;
    this.distributeLoot(loot);
    while (this.checkLevelUpThreshold()) {
      this.experience -= this.getExperienceToNextLevel();
      this.levelUp();
    }
  }

  distributeLoot(loot: InventoryItemUnion[]): void {
    console.log("Pushing loot to inventory", loot);
    for (const item of loot) {
      // Auto-equip if slot is empty
      if (this.tryAutoEquip(item)) {
        console.log(`Auto-equipped: ${item.slot}`);
      } else {
        this.inventory.push(item);
      }
    }
  }

  tryAutoEquip(item: InventoryItemUnion): boolean {
    const slot = item.slot;

    // Handle rings specially (two slots)
    if (slot === "ring") {
      if (!this.equipment.ring1) {
        this.equipment.ring1 = item as Ring;
        return true;
      } else if (!this.equipment.ring2) {
        this.equipment.ring2 = item as Ring;
        return true;
      }
      return false;
    }

    // For other slots, check if empty
    if (slot === "weapon" && !this.equipment.weapon) {
      this.equipment.weapon = item as Weapon;
      return true;
    }
    if (slot === "helmet" && !this.equipment.helmet) {
      this.equipment.helmet = item as Helmet;
      return true;
    }
    if (slot === "chest" && !this.equipment.chest) {
      this.equipment.chest = item as Chest;
      return true;
    }
    if (slot === "amulet" && !this.equipment.amulet) {
      this.equipment.amulet = item as Amulet;
      return true;
    }
    if (slot === "potion" && !this.equipment.potion) {
      this.equipment.potion = item as Potion;
      return true;
    }

    return false;
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

  allocateAttribute(attribute: "strength" | "dexterity" | "intelligence"): boolean {
    if (this.unallocAttrPts <= 0) return false;
    this.stats[attribute]++;
    this.unallocAttrPts--;
    return true;
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
