import type { Action } from "../../app/rootReducer";
import { type NewGameAction, type ShiftAction } from "./gameActions";
import { calculateShift, spawnTile } from "./gridLogic";
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
    gameOver: boolean,
}

const randomNumber = (below: number) => Math.floor(Math.random() * below);

// reinitializes grid and resets score to 0, preserving best score if applicable.
// if gridSize is given explicitly, overrides current grid size.
// else if gridSize is not given, default to current grid size.
// else if there is no current grid size, default to 4x4.
export function initializeGrid(state?: GameState, gridSize: number = state?.grid?.length ?? 4) {
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

    return {
        ...state,
        score: {
            current: 0,
            best: state?.score?.best ?? 0,
        },
        grid: newGrid,
        gameOver: false,
    }
}

export function initializeGameState() {
    return initializeGrid();
}

export function gameReducer(state: GameState, action: Action) {
    switch (action.type) {
        case 'shift':
            if (!state.gameOver) {
                const { direction, nextTile } = (action as ShiftAction).payload;
                return calculateShift(state, direction, nextTile);
            }
            return state;
        case 'newGame':
            const { gridSize } = (action as NewGameAction).payload;
            console.log('new game action')
            return initializeGrid(state, gridSize);
    }

    return state;
}