import type { InventoryItem } from "../../types/interfaces/inventory-item";

export interface EnemyPrefab {
  name: string;
  health: number;
  damage: number;
  attackSpeed: number;
  sprite: string;
  loot: InventoryItem[];
  experienceGranted: number;
  goldDropped: number;
  monsterLevel?: number;
  armor?: number;
}

// Helper to scale enemy stats by wave level
export function scaleEnemy(prefab: EnemyPrefab, waveLevel: number): EnemyPrefab {
  const scale = 1 + (waveLevel - 1) * 0.4; // 40% stronger per wave
  return {
    ...prefab,
    name: waveLevel > 1 ? `${prefab.name} Lv.${waveLevel}` : prefab.name,
    health: Math.floor(prefab.health * scale),
    damage: Math.floor(prefab.damage * scale),
    armor: Math.floor((prefab.armor || 0) * scale),
    experienceGranted: Math.floor(prefab.experienceGranted * scale),
    goldDropped: Math.floor(prefab.goldDropped * scale),
    monsterLevel: waveLevel,
  };
}

export const goblinPrefab: EnemyPrefab = {
  name: "Goblin",
  health: 50,
  damage: 10,
  attackSpeed: 1,
  sprite: "_na.png",
  loot: [],
  armor: 2,
  experienceGranted: 50,
  goldDropped: 15,
  monsterLevel: 1
};

export const orcPrefab: EnemyPrefab = {
  name: "Orc",
  health: 120,
  damage: 20,
  attackSpeed: 0.8,
  sprite: "../../../assets/temp/orc.png",
  loot: [],
  armor: 5,
  experienceGranted: 60,
  goldDropped: 25,
  monsterLevel: 1
};

export const slimePrefab: EnemyPrefab = {
  name: "Slime",
  health: 30,
  damage: 5,
  attackSpeed: 1.5,
  sprite: "_na.png",
  loot: [],
  experienceGranted: 30,
  goldDropped: 8,
  monsterLevel: 1
};

// Boss prefab
export const trollPrefab: EnemyPrefab = {
  name: "Troll",
  health: 300,
  damage: 35,
  attackSpeed: 0.5,
  sprite: "_na.png",
  loot: [],
  armor: 10,
  experienceGranted: 200,
  goldDropped: 100,
  monsterLevel: 1
};

// Wave definitions
export interface WaveDefinition {
  id: number;
  name: string;
  description: string;
  enemies: EnemyPrefab[];
  unlocked: boolean;
  theme: {
    background?: string; // URL to background image
    gradient: string;    // Fallback gradient
    accent: string;
  };
}

export function createWaveDefinitions(): WaveDefinition[] {
  return [
    {
      id: 1,
      name: "Mysterious Forest",
      description: "Ancient trees whisper secrets...",
      enemies: [
        scaleEnemy(slimePrefab, 1),
        scaleEnemy(slimePrefab, 1),
        scaleEnemy(slimePrefab, 1),
      ],
      unlocked: true,
      theme: {
        background: "/assets/Free Pixel Art Forest/Free Pixel Art Forest/Preview/Background.png",
        gradient: "linear-gradient(180deg, #1a2f1a 0%, #0d1f0d 50%, #0a1a0a 100%)",
        accent: "#4ade80",
      },
    },
    {
      id: 2,
      name: "Goblin Camp",
      description: "Smoke rises from crude tents...",
      enemies: [
        scaleEnemy(slimePrefab, 2),
        scaleEnemy(goblinPrefab, 2),
        scaleEnemy(goblinPrefab, 2),
        scaleEnemy(slimePrefab, 2),
      ],
      unlocked: false,
      theme: {
        gradient: "linear-gradient(180deg, #2d2a1a 0%, #1f1c0d 50%, #1a170a 100%)",
        accent: "#f59e0b",
      },
    },
    {
      id: 3,
      name: "Orc Territory",
      description: "Battle drums echo in the distance...",
      enemies: [
        scaleEnemy(goblinPrefab, 3),
        scaleEnemy(goblinPrefab, 3),
        scaleEnemy(orcPrefab, 3),
        scaleEnemy(goblinPrefab, 3),
        scaleEnemy(orcPrefab, 3),
      ],
      unlocked: false,
      theme: {
        gradient: "linear-gradient(180deg, #2d1a1a 0%, #1f0d0d 50%, #1a0a0a 100%)",
        accent: "#ef4444",
      },
    },
    {
      id: 4,
      name: "Dark Cave",
      description: "Strange sounds echo from within...",
      enemies: [
        scaleEnemy(orcPrefab, 4),
        scaleEnemy(orcPrefab, 4),
        scaleEnemy(goblinPrefab, 4),
        scaleEnemy(orcPrefab, 4),
        scaleEnemy(goblinPrefab, 4),
        scaleEnemy(orcPrefab, 4),
      ],
      unlocked: false,
      theme: {
        gradient: "linear-gradient(180deg, #1a1a2d 0%, #0d0d1f 50%, #0a0a1a 100%)",
        accent: "#8b5cf6",
      },
    },
    {
      id: 5,
      name: "Troll's Lair",
      description: "The ground trembles beneath your feet...",
      enemies: [
        scaleEnemy(orcPrefab, 5),
        scaleEnemy(orcPrefab, 5),
        scaleEnemy(trollPrefab, 5),
      ],
      unlocked: false,
      theme: {
        gradient: "linear-gradient(180deg, #2d1a2d 0%, #1f0d1f 50%, #1a0a1a 100%)",
        accent: "#ec4899",
      },
    },
  ];
}
