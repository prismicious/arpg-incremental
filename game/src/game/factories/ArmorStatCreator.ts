import { TiersEnum } from "../../types/interfaces/enums";

const ChestEnum = {
    base: { armor: 5, health: 0 },
    scaling: {
        armor: 1,
        health: 2,
    },
}

const HelmetEnum = {
    base: { armor: 3, health: 0 },
    scaling: {
        armor: 0.5,
        health: 1,
    },
}

const ArmorScaling = {
    chest: ChestEnum,
    helmet: HelmetEnum,
}

const TierMultiplier = {
    wood: { armor: 1, health: 1 },
    iron: { armor: 1.2, health: 1.05 },
    diamond: { armor: 1.5, health: 1.1 },
    gold: { armor: 2, health: 1.15 },
    crimson: { armor: 2.5, health: 1.2 },
}

export const ArmorStats = (
    armorType: keyof typeof ArmorScaling,
    tier: keyof typeof TiersEnum,
    level: number
): { armor: number; health: number } => {
    const base = ArmorScaling[armorType].base;
    const scaling = ArmorScaling[armorType].scaling;
    const tierMultiplier = TierMultiplier[tier];

    const armor = Math.floor(
        (base.armor + scaling.armor * level) * tierMultiplier.armor
    );
    const health = Math.floor(
        (base.health + scaling.health * level) * tierMultiplier.health
    );

    return { armor, health };
}