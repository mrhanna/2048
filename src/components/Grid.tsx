import { useEffect, useReducer } from 'react';
import Tile from './Tile';
import styled from 'styled-components';
import { gridReducer, initGrid, shift, type Direction } from './gridReducer';
import { useSwipeable } from 'react-swipeable';

const GRID_SIZE = 4;

const GridView = styled.div`
    position: relative;
    width: 500px;
    height: 500px;
`

export default function Grid() {
    const [grid, dispatch] = useReducer(gridReducer, GRID_SIZE, initGrid);

    const tiles = [];

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
                tiles.push(<Tile key={cell.tile.$id} $position={[row, col]} {...cell.tile} />);

                if (cell.merged) {
                    // tiles.push(<Tile key={cell.merged.$id} $position={[row, col]} {...cell.merged} $exiting />);
                }
            }
        }
    }

    return (
        <GridView {...swipeHandlers}>
            {...tiles}
        </GridView>
    )
}