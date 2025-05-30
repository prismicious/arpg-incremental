import { Character } from "../../types/models/character-class";
import type { ItemTypeMapping } from "../../types/interfaces/inventory-item";

export function equipItem<T extends keyof ItemTypeMapping>(
  item: ItemTypeMapping[T],
  character: Character,
  setCharacter: React.Dispatch<React.SetStateAction<Character>>
) {
  if (!item) return;
  const slot = item.slot;
  if (slot === "ring") {
    if (!character.equipment.ring2 && character.equipment.ring1) {
      setCharacter((prev) => {
        const prevEquipped = prev.equipment.ring2;
        let newInventory = prev.inventory.filter((i) => i.id !== item.id);
        if (prevEquipped) {
          newInventory = [...newInventory, prevEquipped];
        }

        

        return new Character(
          prev.stats,
          newInventory,
          {
            ...prev.equipment,
            ring2: item,
          },
          prev.sprite
        );
      });
    } else {
      setCharacter((prev) => {
        const prevEquipped = prev.equipment.ring1;
        let newInventory = prev.inventory.filter((i) => i.id !== item.id);
        if (prevEquipped) {
          newInventory = [...newInventory, prevEquipped];
        }

        return new Character(
          prev.stats,
          newInventory,
          {
            ...prev.equipment,
            ring1: item,
          },
          prev.sprite
        );
      });
    }
    return;
  }
  setCharacter((prev) => {
    const prevEquipped = prev.equipment[slot];
    let newInventory = prev.inventory.filter((i) => i.id !== item.id);
    if (prevEquipped) {
      newInventory = [...newInventory, prevEquipped];
    }

    return new Character(
      prev.stats,
      newInventory,
      {
        ...prev.equipment,
        [slot]: item,
      },
      prev.sprite
    );
  });
}
