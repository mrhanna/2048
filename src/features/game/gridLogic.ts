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
        exponent: Math.random() < 0.9 ? 1 : 2,
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
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            const currentTile = grid[i][j]?.tile?.exponent;

            // cell is empty
            if (!currentTile) return true;

            const tileToRight = grid[i][j + 1]?.tile?.exponent;
            const tileBelow = grid[i + 1]?.[j]?.tile?.exponent;

            if (currentTile === tileToRight || currentTile === tileBelow) {
                // two cells can merge
                return true;
            }
        }
    }

    return false;
}

function unrotateCoordinates(
    [r, c]: [number, number],
    direction: Direction,
    size: number
): [number, number] {
    switch (direction) {
        case 'left': return [r, c];
        case 'right': return [r, size - 1 - c];
        case 'up': return [c, size - 1 - r];
        case 'down': return [size - 1 - c, r];
    }
}

type ShiftResult = {
    grid: Slot[][],
    changed: boolean,
    scoreDelta: number,
    highestMergedExponent: number,
    emptyCellPositions: [number, number][],
}

export function simulateGridShift(
    grid: GridState,
    direction: Direction,
): ShiftResult {
    // rather than implement separate logic for each direction, just rotate the grid
    const rows = transform(grid, direction)

    const emptyCellPositions: [number, number][] = [];
    let changed = false;
    let scoreDelta = 0;
    let highestMergedExponent = 0;

    // Go row by row. Logically, everything in arrays shifts left here
    const shiftedGrid = rows.map((row: Slot[], rowIndex) => {
        const newRow = Array<Slot>(row.length).fill(undefined);

        let firstEmptyIndex = 0;
        let lastUnmergedIndex = -1; // -1 will indicate there is no unmerged cell so far

        for (let i = 0; i < row.length; i++) {
            const cell = row[i]?.tile;
            if (cell) {
                // first, check to see if the most recent unmerged cell is the same as this one
                if (lastUnmergedIndex > -1 && newRow[lastUnmergedIndex]!.tile.exponent === cell.exponent) {
                    changed = true;
                    // increase the exp value of the last unmerged cell
                    newRow[lastUnmergedIndex]!.tile.exponent++;
                    // increase the score delta
                    scoreDelta += 2 ** newRow[lastUnmergedIndex]!.tile.exponent;
                    // note the highest exponent achieved
                    highestMergedExponent = Math.max(
                        highestMergedExponent,
                        newRow[lastUnmergedIndex]!.tile.exponent,
                    );
                    // put this cell in the merge field of the newly merged cell (for animation purposes)
                    newRow[lastUnmergedIndex]!.merged = { ...cell };
                    // there is no longer a "last unmerged index"
                    lastUnmergedIndex = -1;
                }

                else {
                    if (firstEmptyIndex != i) changed = true;
                    lastUnmergedIndex = firstEmptyIndex;
                    newRow[firstEmptyIndex] = { tile: { ...cell } };
                    firstEmptyIndex++;
                }
            }
        }

        // any remaining empty cells are eligible for new tile spawn
        while (firstEmptyIndex < row.length) {
            emptyCellPositions.push(
                unrotateCoordinates(
                    [rowIndex, firstEmptyIndex++],
                    direction,
                    row.length,
                )
            );
        }

        return newRow;
    });

    return {
        grid: undoTransform(shiftedGrid, direction),
        changed,
        scoreDelta,
        highestMergedExponent,
        emptyCellPositions,
    }
}

export interface SpawnTile {
    position: [number, number],
    exponent: number,
}

function injectTileIntoGrid(
    grid: GridState,
    positions: [number, number][],
    tile: SeededTileProps,
): SpawnTile {
    const spawnSlot = positions[Math.floor(tile.positionSeed * positions.length)];
    grid[spawnSlot[0]][spawnSlot[1]] = { tile: { $id: tile.$id, exponent: tile.exponent } }

    return {
        position: [spawnSlot[0], spawnSlot[1]],
        exponent: tile.exponent,
    }
}

export function createAccessibleShiftAnnouncement(
    direction: Direction,
    grid: GridState,
    newTile: SpawnTile,
) {
    const directionLog = `Grid shifted ${direction}`;
    const mergeLogs = grid.flatMap((row, rowIndex) => row.map((cell, columnIndex) => {
        if (cell?.merged) {
            return `Merged two ${2 ** cell.merged.exponent} tiles into a ${2 ** cell.tile.exponent} at row ${rowIndex + 1} column ${columnIndex + 1}`;
        }

        return undefined;
    })).filter((value) => !!value);
    const spawnLog = `A ${2 ** newTile.exponent} tile spawned at row ${newTile.position[0] + 1} column ${newTile.position[1] + 1}`;

    return [directionLog, ...mergeLogs, spawnLog].join('. ');
}

export function applyShiftAction(
    state: GameState,
    direction: Direction,
    nextTile: SeededTileProps,
): GameState {
    const {
        grid: shifted,
        changed,
        scoreDelta,
        highestMergedExponent,
        emptyCellPositions
    } = simulateGridShift(state.grid, direction);

    if (!changed) {
        return {
            ...state,
            verbose: `Grid cannot shift ${direction}`,
        }
    }

    // mutates shifted grid
    const newTile = injectTileIntoGrid(shifted, emptyCellPositions, nextTile);

    // is grid full? if there was only one empty cell position, we just filled it.
    const isGameOver = !(emptyCellPositions.length > 1 || isGridShiftable(shifted));
    const newScore = state.score.current + scoreDelta;

    const nextState = {
        ...state,
        grid: shifted,
        score: {
            ...state.score,
            current: newScore,
        },
        highestExponentAchieved: Math.max(state.highestExponentAchieved, highestMergedExponent),
        isGameOver,
        verbose: createAccessibleShiftAnnouncement(direction, shifted, newTile),
    }

    nextState.score.best[state.grid.length] = Math.max(state.score.best[state.grid.length], newScore);

    return nextState;
}
