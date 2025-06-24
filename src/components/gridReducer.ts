import { reverse, rot270, rot90 } from "./gridutilities";
import type { UnpositionedTileProps } from "./Tile";
import { nanoid } from "nanoid";

// tile - the actual slot contents. merged - an inactive tile from a previous state that merged with this one
type Slot = {
    tile: UnpositionedTileProps, 
    merged?: UnpositionedTileProps,
} | undefined;

interface SeededTileProps extends UnpositionedTileProps {
    positionSeed: number,
}

export type Direction = 'up' | 'down' | 'left' | 'right';

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

function spawnTile() {
    return {
        $id: nanoid(),
        exponent: Math.random() < 0.9 ? 1: 2,
    };
}

function transform(grid: Slot[][], direction: Direction) {
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

function undoTransform(grid: Slot[][], direction: Direction) {
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

// Calculates grid state after a play action is performed.
// Returns both the new grid state as well as a list of discarded cells for animation purposes.
// Returns false if nothing changes (i.e. everything is blocked)
function moveCells(grid: Slot[][], direction: Direction, nextTile: SeededTileProps): Slot[][] {
    // rather than implement separate logic for each direction, just rotate the grid
    const rows = transform(grid, direction)

    const emptyCellPositions: [number, number][] = [];
    let changed = false;

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

    if (!changed) return grid;

    // Spawn a new tile in an empty slot
    const spawnSlot = emptyCellPositions[Math.floor(nextTile.positionSeed * emptyCellPositions.length)];
    shiftedGrid[spawnSlot[0]][spawnSlot[1]] = { tile: { $id: nextTile.$id, exponent: nextTile.exponent } }

    return undoTransform(shiftedGrid, direction);
}

const randomNum = (below: number) => Math.floor(Math.random() * below);

export function initGrid(gridSize: number) {
    const initialGrid: Slot[][] = Array(gridSize).fill(undefined).map(() => Array(gridSize).fill(undefined));
    const a = randomNum(gridSize);
    const b = randomNum(gridSize);
    let c = randomNum(gridSize);
    let d = randomNum(gridSize);

    while (a === c && b === d) {
        c = randomNum(gridSize);
        d = randomNum(gridSize);
    }

    initialGrid[a][b] = { tile: spawnTile() };
    initialGrid[c][d] = { tile: spawnTile() };

    return initialGrid;
}

export function gridReducer(state: Slot[][], action: ShiftAction) {
    if (action.type === 'shift') {
        return moveCells(state, action.payload.direction, action.payload.nextTile);
    }

    return state;
}