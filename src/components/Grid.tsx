import { useEffect } from 'react';
import Tile, { type TileProps } from './Tile';
import styled from 'styled-components';
import { shift, type Direction } from './gameReducer';
import { useSwipeable } from 'react-swipeable';

import type { Grid } from './gameReducer';
import { useGameDispatch } from './GameContext';

const GRID_SIZE = 4;

const GridView = styled.div`
    position: relative;
    width: 500px;
    height: 500px;
`

export interface GridProps {
    grid: Grid, 
}

export default function Grid({ grid }: GridProps) {
    const dispatch = useGameDispatch();
    const tiles: TileProps[] = [];

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => { dispatch(shift('left')); console.log('swiped') },
        onSwipedRight: () => { dispatch(shift('right')) },
        onSwipedDown: () => { dispatch(shift('down')) },
        onSwipedUp: () => { dispatch(shift('up')) },
        preventScrollOnSwipe: true,
        trackMouse: true,
    })

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
                dispatch(shift(direction));
            }
        };

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [])

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = grid[row][col]
            if (cell) {
                tiles.push({...cell.tile, $position: [row, col]});

                if (cell.merged) {
                    tiles.push({...cell.merged, $position: [row, col], $exiting: true });
                }
            }
        }
    }

    // Sorting the tiles array helps prevents 
    tiles.sort((a, b) => {
        if (a.$id > b.$id) return 1;
        if (a.$id < b.$id) return -1;
        return 0;
    });

    return (
        <GridView {...swipeHandlers}>
            {tiles.map((props) => <Tile key={props.$id} {...props} />)}
        </GridView>
    )
}