import type { UnpositionedTileProps } from "./Tile";
import { spawnTile, type Direction } from "./gridLogic";

export interface SeededTileProps extends UnpositionedTileProps {
    positionSeed: number,
}

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


