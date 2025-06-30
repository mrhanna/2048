import { useEffect } from 'react';
import Tile, { type TileProps } from './Tile';
import styled from 'styled-components';
import { shift } from './gameActions';
import type { Direction } from './gridLogic';
import { useSwipeable } from 'react-swipeable';

import type { GridState } from './gameReducer';
import { useAppDispatch } from '../../app/AppContext';

const GRID_SIZE = 4;

const GridView = styled.div`
    position: relative;
    display: inline-block;
    aspect-ratio: 1;
    width: 100%;
    background-color:rgb(102, 82, 59);
    border-radius: 10px;
    padding: 2%;
`

export interface GridProps {
    grid: GridState, 
}

export default function Grid({ grid }: GridProps) {
    const dispatch = useAppDispatch();
    const tiles: TileProps[] = [];

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => { dispatch(shift('left')) },
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
                tiles.push({...cell.tile, $position: [row, col], merged: !!cell.merged});

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
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                {tiles.map((props) => <Tile key={props.$id} {...props} />)}
            </div>
        </GridView>
    )
}