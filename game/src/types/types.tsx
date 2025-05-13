export type StartGridPos = {
  [key: string]: { col: number; row: number };
};

export type AllCoords = {
  [type: string]: { [tier: string]: { x: number; y: number } };
};