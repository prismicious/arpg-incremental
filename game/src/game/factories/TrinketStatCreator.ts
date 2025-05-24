import { TiersEnum } from "../../types/interfaces/enums";

const RingEnum = {
    base: { strength: 1,
    dexterity: 1,
    intelligence: 1, },
    scaling: {
        strength: 0.25,
    dexterity: 0.25,
    intelligence: 0.25,
    },
}

const AmuletEnum = {
    base: { strength: 1,
    dexterity: 1,
    intelligence: 1, },
    scaling: {
        strength: 0.5,
        dexterity: 0.5,
        intelligence: 0.5,
    },
}

const TrinketScaling = {
    ring: RingEnum,
    amulet: AmuletEnum,
}

const TierMultiplier = {
    wood: 1,
    iron: 1.5,
    diamond: 2,
    gold: 2.5,
    none: 0,
}

export const TrinketStats = (
    trinketType: keyof typeof TrinketScaling,
    tier: keyof typeof TiersEnum,
    level: number
): { strength: number,
    dexterity: number,
    intelligence: number } => {
    const base = TrinketScaling[trinketType].base;
    const scaling = TrinketScaling[trinketType].scaling;
    const tierMultiplier = TierMultiplier[tier];

    const strength = Math.floor(
        (base.strength + scaling.strength * level) * tierMultiplier
    );
    const dexterity = Math.floor(
        (base.dexterity + scaling.dexterity * level) * tierMultiplier
    );
    const intelligence = Math.floor(
        (base.intelligence + scaling.intelligence * level) * tierMultiplier
    );
    
    return { strength, dexterity, intelligence };
}