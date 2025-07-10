import Tile, { type TileProps } from './Tile';
import styled from 'styled-components';
import type { GridState } from './gameReducer';
import useShiftHandlers from './useShiftHandlers';
import AccessibleGrid from './AccessibleGrid';

const GridView = styled.div`
    position: relative;
    display: inline-block;
    aspect-ratio: 1;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: 2%;
`

export interface GridProps {
    grid: GridState,
}

export default function Grid({ grid }: GridProps) {
    const gridSize = grid.length;
    const tiles: TileProps[] = [];

    const handlers = useShiftHandlers(grid);

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = grid[row][col]
            if (cell) {
                tiles.push({ ...cell.tile, $position: [row, col], merged: !!cell.merged, gridSize });

                if (cell.merged) {
                    tiles.push({ ...cell.merged, $position: [row, col], $exiting: true, gridSize });
                }
            }
        }
    }

    // Sorting the tiles array prevents unnecessary tile remounts
    tiles.sort((a, b) => {
        if (a.$id > b.$id) return 1;
        if (a.$id < b.$id) return -1;
        return 0;
    });

    return (
        <>
            <GridView {...handlers}>
                <div aria-hidden="true" style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {tiles.map((props) => <Tile key={props.$id} {...props} />)}
                </div>
            </GridView>
            <AccessibleGrid grid={grid} />
        </>
    )
}