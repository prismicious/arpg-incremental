import { WeaponTypes, TiersEnum } from "../../types/interfaces/enums";

const AxeEnum = {
    base: { damage: 12,
            attackspeed: 0.5},
    scaling: {
        damage: 2,
        attackspeed: 0.005
    }    
}
const BowEnum = {
    base: { damage: 3,
            attackspeed: 1.5},
    scaling: {
        damage: 0.35,
        attackspeed: 0.05
    }    
}
const DaggerEnum = {
    base: { damage: 5,
            attackspeed: 1.4},
    scaling: {
        damage: 0.5,
        attackspeed: 0.04
    }    
}
const SwordEnum = {
    base: { damage: 7,
            attackspeed: 1},
    scaling: {
        damage: 1.2,
        attackspeed: 0.01
    }
}
const WeaponScaling = {
    sword: SwordEnum,
    axe: AxeEnum,
    bow: BowEnum,
    dagger: DaggerEnum
}
const TierMultiplier = {
    wood: { damage: 1,
            attackspeed: 1},
    iron: { damage: 1.2,
            attackspeed: 1.05},
    diamond: { damage: 1.5,
            attackspeed: 1.1},
    gold: { damage: 2,
            attackspeed: 1.15},
    crimson: { damage: 2.5,
            attackspeed: 1.2}
}

export const WeaponStats = (weaponType: keyof typeof WeaponTypes, tier: keyof typeof TiersEnum, level: number) => {
    const base = WeaponScaling[weaponType].base;
    const scaling = WeaponScaling[weaponType].scaling;
    const tierMultiplier = TierMultiplier[tier];

    const damage = Math.floor((base.damage + (scaling.damage * level)) * tierMultiplier.damage);
    const attackSpeed = Math.floor((base.attackspeed + (scaling.attackspeed * level)) * tierMultiplier.attackspeed);

    return {damage, attackSpeed}    
}