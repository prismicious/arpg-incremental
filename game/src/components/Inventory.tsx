import React from "react";
import { equipItem } from "../game/utils/equipItem";
import type { Character } from "../types/models/character-class";

interface InventoryProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  spritePath: string;
}



export const Inventory: React.FC<InventoryProps> = ({character, setCharacter, spritePath}) => {
    
    React.useEffect(() => {

    }, [character])
    
    return (
        <div className="inventory">
        <h2>Inventory</h2>
        <div className="inventory-grid grid grid-cols-4 gap-4">
            {/* Map through the inventory items and display them */}
            {character.inventory.map((item, index) => (
            <div key={index} className="inventory-item border-2 border-black rounded p-2" onClick={() => equipItem(item, character, setCharacter)}>
                <img src={`${spritePath}/${item.sprite}`} alt={`${item.tier} ${item.type}`} />
                <p>{item.tier} {item.type}</p>
            </div>
            ))}
            
        </div>
        </div>
    );
}