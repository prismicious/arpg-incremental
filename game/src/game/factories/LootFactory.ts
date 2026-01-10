import {
  createWeapon,
  createArmor,
  createTrinket,
  createPotion,
} from "./EquipmentFactory";
import {
  TiersEnum,
  WeaponTypes,
  armorTypeKeys,
} from "../../types/interfaces/enums";
import type {
  ArmorTypeMapping,
  TrinketTypeMapping,
} from "../../types/interfaces/enums";
import type { InventoryItemUnion } from "../../types/interfaces/character";

// ============================================
// Configuration Constants
// ============================================

const TIER_WEIGHTS: Record<Exclude<TiersEnum, "none">, number> = {
  [TiersEnum.wood]: 50,
  [TiersEnum.iron]: 30,
  [TiersEnum.gold]: 15,
  [TiersEnum.diamond]: 5,
};

type ItemCategory = "weapon" | "armor" | "trinket" | "potion";

const ITEM_CATEGORY_WEIGHTS: Record<ItemCategory, number> = {
  weapon: 30,
  armor: 30,
  trinket: 25,
  potion: 15,
};

interface LootConfig {
  baseDropChance: number;
  minItems: number;
  maxItems: number;
  additionalItemChance: number;
}

const DEFAULT_LOOT_CONFIG: LootConfig = {
  baseDropChance: 0.7,
  minItems: 1,
  maxItems: 3,
  additionalItemChance: 0.3,
};

// ============================================
// Helper Functions
// ============================================

function weightedRandomSelect<T>(options: { item: T; weight: number }[]): T {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * totalWeight;

  for (const option of options) {
    random -= option.weight;
    if (random <= 0) {
      return option.item;
    }
  }

  return options[options.length - 1].item;
}

function selectRandomTier(): TiersEnum {
  const tierOptions = (
    Object.entries(TIER_WEIGHTS) as [TiersEnum, number][]
  ).map(([tier, weight]) => ({
    item: tier,
    weight,
  }));

  return weightedRandomSelect(tierOptions);
}

function selectRandomCategory(): ItemCategory {
  const categoryOptions = (
    Object.entries(ITEM_CATEGORY_WEIGHTS) as [ItemCategory, number][]
  ).map(([category, weight]) => ({
    item: category,
    weight,
  }));

  return weightedRandomSelect(categoryOptions);
}

function selectRandomFromArray<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function calculateDropCount(config: LootConfig): number {
  if (Math.random() > config.baseDropChance) {
    return 0;
  }

  let count = config.minItems;

  for (let i = config.minItems; i < config.maxItems; i++) {
    if (Math.random() < config.additionalItemChance) {
      count++;
    }
  }

  return count;
}

// ============================================
// Item Generation
// ============================================

const WEAPON_SUBTYPES = Object.values(WeaponTypes);
const ARMOR_SUBTYPES: readonly (keyof ArmorTypeMapping)[] = armorTypeKeys;
const TRINKET_SUBTYPES: readonly (keyof TrinketTypeMapping)[] = [
  "ring",
  "amulet",
];

function generateRandomItem(level: number): InventoryItemUnion {
  const category = selectRandomCategory();
  const tier = selectRandomTier();

  switch (category) {
    case "weapon":
      return createWeapon(selectRandomFromArray(WEAPON_SUBTYPES), level, tier);

    case "armor":
      return createArmor(selectRandomFromArray(ARMOR_SUBTYPES), level, tier);

    case "trinket":
      return createTrinket(
        selectRandomFromArray(TRINKET_SUBTYPES),
        level,
        tier
      );

    case "potion":
      return createPotion(20 + level * 5, 1);
  }
}

// ============================================
// Main Export
// ============================================

export interface LootGenerationOptions {
  level?: number;
  config?: Partial<LootConfig>;
}

export function generateRandomLoot(
  options: LootGenerationOptions = {}
): InventoryItemUnion[] {
  const { level = 1, config: configOverrides = {} } = options;
  const config: LootConfig = { ...DEFAULT_LOOT_CONFIG, ...configOverrides };

  const loot: InventoryItemUnion[] = [];
  const dropCount = calculateDropCount(config);

  for (let i = 0; i < dropCount; i++) {
    loot.push(generateRandomItem(level));
  }

  return loot;
}
