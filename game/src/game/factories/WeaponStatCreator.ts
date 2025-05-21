import { WeaponTypes, TiersEnum } from "../../types/interfaces/enums";

const AxeEnum = {
  base: { damage: 12, attackSpeed: 0.5 },
  scaling: {
    damage: 2,
    attackSpeed: 0.005,
  },
};
const BowEnum = {
  base: { damage: 3, attackSpeed: 1.5 },
  scaling: {
    damage: 0.4,
    attackSpeed: 0.05,
  },
};
const DaggerEnum = {
  base: { damage: 5, attackSpeed: 1.4 },
  scaling: {
    damage: 0.5,
    attackSpeed: 0.04,
  },
};
const SwordEnum = {
  base: { damage: 25, attackSpeed: 1 },
  scaling: {
    damage: 1.2,
    attackSpeed: 0.01,
  },
};
const WeaponScaling = {
  sword: SwordEnum,
  axe: AxeEnum,
  bow: BowEnum,
  dagger: DaggerEnum,
};
const TierMultiplier = {
  wood: { damage: 1, attackSpeed: 1 },
  iron: { damage: 1.2, attackSpeed: 1.05 },
  diamond: { damage: 10, attackSpeed: 1.1 },
  gold: { damage: 2, attackSpeed: 1.15 },
  crimson: { damage: 2.5, attackSpeed: 1.2 },
  none: { damage: 0, attackSpeed: 0 },
};

export const WeaponStats = (
  weaponType: keyof typeof WeaponTypes,
  tier: keyof typeof TiersEnum,
  level: number
) => {
  const base = WeaponScaling[weaponType].base;
  const scaling = WeaponScaling[weaponType].scaling;
  const tierMultiplier = TierMultiplier[tier];

  const damage = Math.round((base.damage + scaling.damage * level) * tierMultiplier.damage);
  const attackSpeed =
    (base.attackSpeed + scaling.attackSpeed * level) *
    tierMultiplier.attackSpeed;

  return { damage, attackSpeed };
};
