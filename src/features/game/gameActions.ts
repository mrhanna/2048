import type { UnpositionedTileProps } from "./Tile";
import { spawnTile, type Direction } from "./gridLogic";

export interface SeededTileProps extends UnpositionedTileProps {
    positionSeed: number,
}

export type ShiftAction = ReturnType<typeof shift>
export function shift(direction: Direction) {
    return {
        type: 'shift',
        payload: {
            direction,
            nextTile: {
                ...spawnTile(),
                positionSeed: Math.random(),
            } as SeededTileProps,
        },
    }
}

export type NewGameAction = ReturnType<typeof newGame>
export function newGame(gridSize?: number) {
    return {
        type: 'newGame',
        payload: {
            gridSize: gridSize
        }
    };
}

export type IncrementGoalAction = ReturnType<typeof incrementGoal>
export function incrementGoal() {
    return {
        type: 'incrementGoal',
    };
}

export type ClearHighScoresAction = ReturnType<typeof clearHighScores>
export function clearHighScores() {
    return {
        type: 'clearHighScores',
    };
}

export type GameAction = ShiftAction | NewGameAction | IncrementGoalAction | ClearHighScoresAction;