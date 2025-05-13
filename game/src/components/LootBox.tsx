import React from "react";

export const LootBox: React.FC = () => (
  <div className="bg-gray-800 rounded-lg shadow p-6 flex flex-col items-center">
    <h2 className="text-xl font-semibold mb-2">Loot</h2>
    {/* Loot info goes here */}
    <p className="text-gray-300 text-center">
      Recent drops, rewards, etc.
    </p>
  </div>
);

export default LootBox;
