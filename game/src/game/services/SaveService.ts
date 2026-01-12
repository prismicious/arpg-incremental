import type { InventoryItemUnion } from "../../types/interfaces/character";
import type { Equipment } from "../../types/interfaces/equipment";
import type { Stats } from "../../types/interfaces/stats";
import { Character } from "../../types/models/character-class";

const SAVE_KEY = "arpg-incremental-save";
const SAVE_VERSION = 1;

export interface SaveData {
  version: number;
  timestamp: number;
  character: {
    stats: Stats;
    inventory: InventoryItemUnion[];
    equipment: Equipment;
    sprite: string;
    experience: number;
    level: number;
    totalExperience: number;
    unallocAttrPts: number;
    gold: number;
  };
  progression: {
    selectedWaveId: number;
    completedWaves: number[];
    unlockedWaveIds: number[];
  };
}

export function saveGame(
  character: Character,
  selectedWaveId: number,
  completedWaves: number[],
  unlockedWaveIds: number[]
): boolean {
  try {
    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      character: {
        stats: { ...character.stats },
        inventory: [...character.inventory],
        equipment: { ...character.equipment },
        sprite: character.sprite,
        experience: character.experience,
        level: character.level,
        totalExperience: character.totalExperience,
        unallocAttrPts: character.unallocAttrPts,
        gold: character.gold,
      },
      progression: {
        selectedWaveId,
        completedWaves: [...completedWaves],
        unlockedWaveIds,
      },
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log("Game saved successfully", saveData);
    return true;
  } catch (error) {
    console.error("Failed to save game:", error);
    return false;
  }
}

export function loadGame(): SaveData | null {
  try {
    const savedString = localStorage.getItem(SAVE_KEY);
    if (!savedString) {
      console.log("No save data found");
      return null;
    }

    const saveData: SaveData = JSON.parse(savedString);

    // Version check for future migrations
    if (saveData.version !== SAVE_VERSION) {
      console.warn(`Save version mismatch: ${saveData.version} vs ${SAVE_VERSION}`);
      // Could add migration logic here in the future
    }

    console.log("Game loaded successfully", saveData);
    return saveData;
  } catch (error) {
    console.error("Failed to load game:", error);
    return null;
  }
}

export function createCharacterFromSave(saveData: SaveData): Character {
  const char = new Character(
    saveData.character.stats,
    saveData.character.inventory,
    saveData.character.equipment,
    saveData.character.sprite
  );
  char.experience = saveData.character.experience;
  char.level = saveData.character.level;
  char.totalExperience = saveData.character.totalExperience;
  char.unallocAttrPts = saveData.character.unallocAttrPts;
  char.gold = saveData.character.gold;
  return char;
}

export function hasSaveData(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSaveData(): boolean {
  try {
    localStorage.removeItem(SAVE_KEY);
    console.log("Save data deleted");
    return true;
  } catch (error) {
    console.error("Failed to delete save data:", error);
    return false;
  }
}

export function getSaveTimestamp(): Date | null {
  const saveData = loadGame();
  if (saveData) {
    return new Date(saveData.timestamp);
  }
  return null;
}
