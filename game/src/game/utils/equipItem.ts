import type { Character } from "../../types/interfaces/character";
import type { ItemTypeMapping } from "../../types/interfaces/inventory-item";

export function equipItem<T extends keyof ItemTypeMapping>(item: ItemTypeMapping[T], character: Character, setCharacter: React.Dispatch<React.SetStateAction<Character>>) {
    if (!item) return;
    const slot = item.slot
    if (slot === "ring") {
      if (!character.equipment.ring2 && character.equipment.ring1) {
          setCharacter((prev) => {
            let prevEquipped = prev.equipment.ring2;
            let newInventory = prev.inventory.filter((i) => i.id !== item.id);
            if (prevEquipped) {
                newInventory = [...newInventory, prevEquipped];
            }
            
            return {
            ...prev,
            equipment: {
              ...prev.equipment,
              ring2: item,
            },
            inventory: newInventory,
          }
          });
      } else {
        
        setCharacter((prev) => {
            let prevEquipped = prev.equipment.ring1;
            let newInventory = prev.inventory.filter((i) => i.id !== item.id);
            if (prevEquipped) {
                newInventory = [...newInventory, prevEquipped];
            }
            
            return {
            ...prev,
            equipment: {
              ...prev.equipment,
              ring1: item,
            },
            inventory: newInventory,
          }
        });
      }
      return;
    }
    setCharacter((prev) => {
        let prevEquipped = prev.equipment[slot];
            let newInventory = prev.inventory.filter((i) => i.id !== item.id);
            if (prevEquipped) {
                newInventory = [...newInventory, prevEquipped];
            }
            


        return {
        ...prev,
        equipment: {
            ...prev.equipment,
            [slot]: item,
        },
        inventory: newInventory,
        }});
    }