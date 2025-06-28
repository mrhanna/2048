import { nanoid } from "nanoid";
import type { UnpositionedTileProps } from "./Tile";
import type { GameState, GridState, Slot } from "./gameReducer";
import type { SeededTileProps } from "./gameActions";

export type Direction = 'up' | 'down' | 'left' | 'right';

export function transpose<T>(matrix: T[][]): T[][] {
    const ret: T[][] = Array(matrix[0].length).fill(undefined).map(() => Array(matrix.length).fill(undefined));
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            ret[j][i] = matrix[i][j];
        }
    }
    return ret;
}

export function reverse<T>(matrix: T[][]): T[][] {
    return matrix.map((row) => [...row].reverse());
}

export function rot90<T>(matrix: T[][]): T[][] {
    return reverse(transpose(matrix));
}

export function rot270<T>(matrix: T[][]): T[][] {
    return transpose(reverse(matrix));
}

export function spawnTile(): UnpositionedTileProps {
    return {
        $id: nanoid(),
        exponent: Math.random() < 0.9 ? 1: 2,
    };
}


function transform(grid: GridState, direction: Direction) {
    switch (direction) {
        case 'left':
            return [...grid];
        case 'right':
            return reverse(grid);
        case 'down':
            return rot90(grid);
        case 'up':
            return rot270(grid);
    }
}

function undoTransform(grid: GridState, direction: Direction) {
    switch (direction) {
        case 'left':
            return [...grid];
        case 'right':
            return reverse(grid);
        case 'down':
            return rot270(grid);
        case 'up':
            return rot90(grid);
    }
}

function isGridShiftable(grid: GridState) {
    let isGridShiftable = false;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            const currentTile = grid[i][j]!.tile.exponent;
            const tileToRight = grid[i][j+1]?.tile?.exponent;
            const tileBelow = grid[i+1]?.[j]?.tile?.exponent;

            if (currentTile === tileToRight || currentTile === tileBelow) {
                isGridShiftable = true;
                break;
            }
        }
    }

    return isGridShiftable;
}

// Calculates grid state after a play action is performed.
// Returns both the new grid state as well as a list of discarded cells for animation purposes.
// Returns false if nothing changes (i.e. everything is blocked)
export function calculateShift(state: GameState, direction: Direction, nextTile: SeededTileProps): GameState {
    // rather than implement separate logic for each direction, just rotate the grid
    const rows = transform(state.grid, direction)

    const emptyCellPositions: [number, number][] = [];
    let changed = false;
    let scoreDelta = 0;

    // Go row by row. Logically, everything in arrays shifts left here
    const shiftedGrid = rows.map((row: Slot[], rowIndex) => {
        const ret = Array<Slot>(row.length).fill(undefined);

        let firstEmptyIndex = 0;
        let lastUnmergedIndex = -1; // -1 will indicate there is no unmerged cell so far

        for (let i = 0; i < row.length; i++) {
            const cell = row[i]?.tile;
            if (cell) {
                // first, check to see if the most recent unmerged cell is the same as this one
                if (lastUnmergedIndex > -1 && ret[lastUnmergedIndex]!.tile.exponent === cell.exponent) {
                    changed = true;
                    // increase the exp value of the last unmerged cell
                    ret[lastUnmergedIndex]!.tile.exponent++;
                    // increase the score delta
                    scoreDelta += 2 ** ret[lastUnmergedIndex]!.tile.exponent;
                    // put this cell in the merge field of the newly merged cell (for animation purposes)
                    ret[lastUnmergedIndex]!.merged = {...cell};
                    // there is no longer a "last unmerged index"
                    lastUnmergedIndex = -1;
                }
                
                else {
                    if (firstEmptyIndex != i) changed = true;
                    lastUnmergedIndex = firstEmptyIndex;
                    ret[firstEmptyIndex] = { tile: {...cell}};
                    firstEmptyIndex++;
                }
            }
        }

        // any remaining empty cells are eligible for new tile spawn
        while (firstEmptyIndex < row.length) {
            emptyCellPositions.push([rowIndex, firstEmptyIndex++]);
        }

        return ret;
    });

    if (!changed) return state;

    // Spawn a new tile in an empty slot
    const spawnSlot = emptyCellPositions[Math.floor(nextTile.positionSeed * emptyCellPositions.length)];
    shiftedGrid[spawnSlot[0]][spawnSlot[1]] = { tile: { $id: nextTile.$id, exponent: nextTile.exponent } }

    // is grid full? if there was only one empty cell position, we just filled it.
    let isGameOver = !(emptyCellPositions.length > 1 || isGridShiftable(shiftedGrid));

    return {
        gameOver: isGameOver,
        score: {
            current: state.score.current + scoreDelta,
            best: Math.max(state.score.best, state.score.current + scoreDelta),
        },
        grid: undoTransform(shiftedGrid, direction)
    };
}

