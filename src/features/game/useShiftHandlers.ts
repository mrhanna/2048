import { useCallback, useEffect, useRef } from "react";
import { simulateGridShift, type Direction } from "./gridLogic";
import type { GridState } from "./gameReducer";
import { useAppDispatch } from "../../app/AppContext";
import { shift } from "./gameActions";
import { useSwipeable } from "react-swipeable";

export default function useShiftHandlers(grid: GridState) {
    const dispatch = useAppDispatch();

    // ref-ing the grid state in order to keep event handlers stable across rerenders
    const canShiftRef = useRef(true);
    const gridRef = useRef(grid);

    useEffect(() => {
        gridRef.current = grid;
    }, [grid]);

    const handleShiftEventWithThrottle = useCallback((direction: Direction) => {
        if (canShiftRef.current) {
            // preflighting the shift logic to determine whether to throttle key presses
            const { changed } = simulateGridShift(gridRef.current, direction);

            if (changed) {
                canShiftRef.current = false;
                dispatch(shift(direction));

                setTimeout(() => {
                    canShiftRef.current = true;
                }, 150);
            }
        }
    }, [dispatch])

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => { handleShiftEventWithThrottle('left') },
        onSwipedRight: () => { handleShiftEventWithThrottle('right') },
        onSwipedDown: () => { handleShiftEventWithThrottle('down') },
        onSwipedUp: () => { handleShiftEventWithThrottle('up') },
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
            // supress when inputs are focused
            if (document.activeElement?.tagName === 'INPUT') return;

            const direction = keymap[event.code as keyof typeof keymap] as Direction | undefined;
            if (direction) {
                handleShiftEventWithThrottle(direction);
            }
        };

        document.addEventListener('keydown', handleKeyPress)

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleShiftEventWithThrottle]);

    return swipeHandlers;
}