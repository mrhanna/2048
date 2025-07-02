import type { Action } from "../../app/rootReducer";
import { type NewGameAction, type ShiftAction } from "./gameActions";
import { applyShiftAction, spawnTile } from "./gridLogic";
import type { UnpositionedTileProps } from "./Tile";

// tile - the actual slot contents. merged - an inactive tile from a previous state that merged with this one
export type Slot = {
    tile: UnpositionedTileProps,
    merged?: UnpositionedTileProps,
} | undefined;

export type GridState = Slot[][];

export interface Score {
    current: number,
    best: number,
}

export interface GameState {
    grid: GridState,
    score: Score,
    isGameOver: boolean,
    exponentGoal: number,
    highestExponentAchieved: number,
}

const randomNumber = (below: number) => Math.floor(Math.random() * below);

// reinitializes grid and resets score to 0, preserving best score if applicable.
// if gridSize is given explicitly, overrides current grid size.
// else if gridSize is not given, default to current grid size.
// else if there is no current grid size, default to 4x4.
function initializeGrid(state?: GridState, gridSize: number = state?.length ?? 4) {
    const newGrid: GridState = Array(gridSize).fill(undefined).map(() => Array(gridSize).fill(undefined));
    const a = randomNumber(gridSize);
    const b = randomNumber(gridSize);

    let c = randomNumber(gridSize);
    let d = randomNumber(gridSize);

    while (a === c && b === d) {
        c = randomNumber(gridSize);
        d = randomNumber(gridSize);
    }

    newGrid[a][b] = { tile: spawnTile() };
    newGrid[c][d] = { tile: spawnTile() };

    return newGrid;
}

export function initializeGameState(state?: GameState, gridSize?: number) {
    return {
        ...state,
        score: {
            current: 0,
            best: state?.score?.best ?? 0,
        },
        grid: initializeGrid(state?.grid, gridSize),
        isGameOver: false,
        exponentGoal: 11,
        highestExponentAchieved: 1,
    }
}

export function gameReducer(state: GameState, action: Action) {
    switch (action.type) {
        case 'shift':
            if (!state.isGameOver) {
                const { direction, nextTile } = (action as ShiftAction).payload;
                return applyShiftAction(state, direction, nextTile);
            }
            return state;
        case 'newGame':
            const { gridSize } = (action as NewGameAction).payload;
            return initializeGameState(state, gridSize);
        case 'incrementGoal':
            return {
                ...state,
                exponentGoal: state.exponentGoal + 1,
            }
    }

    return state;
}