import type { IEnemy } from "../types/interfaces/enemy";
import type { Character } from "../types/interfaces/character";
import type { Stats } from "../types/interfaces/stats";

// Define the shape of the state
export interface CombatState {
  currentEnemy: IEnemy | null;
  currentEnemyHealth: number;
  enemyIndex: number;
  currentHealth: number;
  playerNextAttack: number;
  enemyNextAttack: number;
  isDead: boolean;
}

// Define the shape of actions
export type CombatAction =
  | {
      type: "INIT_COMBAT";
      payload: {
        enemies: IEnemy[];
        effectiveStats: Stats;
        character: Character;
      };
    }
  | { type: "NEXT_ENEMY"; payload: { enemies: IEnemy[] } }
  | { type: "UPDATE_PLAYER_HEALTH"; payload: { damage: number } }
  | { type: "UPDATE_ENEMY_HEALTH"; payload: { damage: number } }
  | {
      type: "UPDATE_ATTACK_TIMERS";
      payload: { playerDelay: number; enemyDelay: number };
    }
  | { type: "RESTART_COMBAT"; payload: {enemies:IEnemy[], effectiveStats: Stats, character: Character} }
  | { type: "END_COMBAT"; }


// Update the initial state type
export const initialState: CombatState = {
  currentEnemy: null,
  currentEnemyHealth: 0,
  enemyIndex: 0,
  currentHealth: 0,
  playerNextAttack: 0,
  enemyNextAttack: 0,
  isDead: false,
};

// Update the reducer function
export function reducer(state: CombatState, action: CombatAction): CombatState {
  switch (action.type) {
    case "INIT_COMBAT":
      return {
        ...state,
        currentEnemy: action.payload.enemies[0],
        currentEnemyHealth: action.payload.enemies[0].health,
        currentHealth: action.payload.effectiveStats.health,
        playerNextAttack: 1 / action.payload.effectiveStats.attackSpeed,
        enemyNextAttack: 1 / action.payload.enemies[0].attackSpeed,
        enemyIndex: 0,
      };

    case "NEXT_ENEMY": {
      const nextIndex = state.enemyIndex + 1;
      if (nextIndex < action.payload.enemies.length) {
        return {
          ...state,
          currentEnemy: action.payload.enemies[nextIndex],
          currentEnemyHealth: action.payload.enemies[nextIndex].health,
          enemyIndex: nextIndex,
        };
      } else {
        console.log("All enemies defeated!");
        return state; // No changes if all enemies are defeated
      }
    }

    case "UPDATE_PLAYER_HEALTH":
      return {
        ...state,
        currentHealth: Math.max(state.currentHealth - action.payload.damage, 0),
      };

    case "UPDATE_ENEMY_HEALTH":
      return {
        ...state,
        currentEnemyHealth: Math.max(
          state.currentEnemyHealth - action.payload.damage,
          0
        ),
      };

    case "UPDATE_ATTACK_TIMERS":
      return {
        ...state,
        playerNextAttack: state.playerNextAttack + action.payload.playerDelay,
        enemyNextAttack: state.enemyNextAttack + action.payload.enemyDelay,
      };
    case "RESTART_COMBAT":
      return {
        ...state,
        currentEnemy: action.payload.enemies[0],
        currentEnemyHealth: action.payload.enemies[0].health,
        currentHealth: action.payload.effectiveStats.health,
        playerNextAttack: 1 / action.payload.effectiveStats.attackSpeed,
        enemyNextAttack: 1 / action.payload.enemies[0].attackSpeed,
        enemyIndex: 0,
        isDead: false,
      };
      case "END_COMBAT":
        return {
          ...state,
          isDead: true,
        };

    default:
      return state;
  }
}
