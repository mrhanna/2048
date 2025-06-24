import { useEffect, useRef, useState } from 'react';
import Tile, { type TileInfo, type TileProps } from './Tile';
import styled from 'styled-components';
import { nanoid } from 'nanoid';
import { reverse, rot270, rot90 } from './gridutilities';

type Slot = TileInfo | undefined;
type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_SIZE = 4;

const GridView = styled.div`
    position: relative;
    width: 500px;
    height: 500px;
`

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

function unrotatePosition([row, col]: [number, number], direction: Direction): [number, number] {
    switch (direction) {
        case 'left':
            return [row, col];
        case 'right':
            return [row, GRID_SIZE - col - 1];
        case 'down':
            return [GRID_SIZE - col - 1, row];
        case 'up':
            return [col, GRID_SIZE - row - 1];
    }
}

function spawnTile(): TileInfo {
    return ({
        id: nanoid(),
        exponent: (Math.random() < .9) ? 1 : 2,
    })
}

// Calculates grid state after a play action is performed.
// Returns both the new grid state as well as a list of discarded cells for animation purposes.
// Returns false if nothing changes (i.e. everything is blocked)
function moveCells(grid: Slot[][], direction: Direction): [Slot[][], TileProps[]] {
    // rather than implement separate logic for each direction, just rotate the grid
    const rows = transform(grid, direction)
    const trash: TileProps[] = [];

    const emptyCellPositions: [number, number][] = [];
    let changed = false;

    // Go row by row. Logically, everything in arrays shifts left here
    const moved = rows.map((row: Slot[], rowIndex) => {
        const ret = Array<Slot>(row.length).fill(undefined);

        let firstEmptyIndex = 0;
        let lastUnmergedIndex = -1; // -1 will indicate there is no unmerged cell so far

        for (let i = 0; i < row.length; i++) {
            const cell = row[i];
            if (cell) {
                // first, check to see if the most recent unmerged cell is the same as this one
                if (lastUnmergedIndex > -1 && ret[lastUnmergedIndex]!.exponent === cell.exponent) {
                    changed = true;
                    // increase the exp value of the last unmerged cell
                    ret[lastUnmergedIndex]!.exponent++;
                    // add current cell to list of discarded. Note the position it would have moved to for animation purposes
                    trash.push({...cell, position: unrotatePosition([rowIndex, lastUnmergedIndex], direction)})
                    // there is no longer a "last unmerged index"
                    lastUnmergedIndex = -1;
                }
                
                else {
                    if (firstEmptyIndex != i) changed = true;
                    lastUnmergedIndex = firstEmptyIndex;
                    ret[firstEmptyIndex] = {...cell};
                    firstEmptyIndex++;
                }
            }
        }

        // any remaining empty cells are eligible for new tile spawn
        while (firstEmptyIndex < GRID_SIZE) {
            emptyCellPositions.push(unrotatePosition([rowIndex, firstEmptyIndex++], direction));
        }

        return ret;
    });

    if (!changed) return [grid, []];

    const ret = undoTransform(moved, direction);
    // Spawn a new tile in an empty slot
    const spawnSlot = emptyCellPositions[Math.floor(Math.random() * emptyCellPositions.length)];
    ret[spawnSlot[0]][spawnSlot[1]] = spawnTile();

    return [ret, trash];
}

const initialGrid: Slot[][] = Array(GRID_SIZE).fill(undefined).map(() => Array(GRID_SIZE).fill(undefined));
initialGrid[0][1] = spawnTile();
initialGrid[2][2] = spawnTile();

export default function Grid() {
    const [grid, setGrid] = useState<Slot[][]>(initialGrid);
    const [exiting, setExiting] = useState<TileProps[]>([]);

    const myRef = useRef<HTMLDivElement | null>(null);

    const tiles = [];

    useEffect(() => {
        const keymap = {
            ArrowUp: 'up',
            ArrowDown: 'down',
            ArrowLeft: 'left',
            ArrowRight: 'right',
        };

        const handleKeyPress = (event: KeyboardEvent) => {  
            const direction = keymap[event.code as keyof typeof keymap] as Direction | undefined;
            if (direction) {
                const [nextGrid, nextExiting] = moveCells(grid, direction);
                setGrid(nextGrid);
                // setExiting(nextExiting);
            }
        };

        const handleTransitionEnd = () => {
            setExiting([]);
        }

        document.addEventListener('keydown', handleKeyPress)
        myRef.current?.addEventListener('transitionend', handleTransitionEnd);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            myRef.current?.removeEventListener('transitionend', handleTransitionEnd);
        };
    }, [grid, setGrid, exiting, setExiting])

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = grid[row][col]
            if (cell) {
                tiles.push(<Tile key={cell.id} position={[row, col]} {...cell} />);
            }
        }
    }

    return (
        <GridView ref={myRef}>
            {...tiles}
            {...exiting.map((props) => <Tile {...props} $under={1} />)}
        </GridView>
    )
}