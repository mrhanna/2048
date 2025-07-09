import { createAccessibleShiftAnnouncement, rot270, rot90, type SpawnTile } from "./gridLogic";
import { simulateGridShift } from "./gridLogic";

const compareDuples = ([a1, a2]: [number, number], [b1, b2]: [number, number]) => {
    if (a1 < b1) return -1;
    if (a1 > b1) return 1;

    if (a2 < b2) return -1;
    if (a2 > b2) return 1;

    return 0;

}

const makeSlot = (exp?: number, mergeExp?: number) =>
    exp
        ? {
            tile: { $id: 'id', exponent: exp },
            ...(mergeExp !== undefined ? { merged: { $id: 'id', exponent: mergeExp } } : {})
        }
        : undefined;

describe('grid logic functions', () => {
    const arr = [[1, 2, 3], [4, 5, 6]];

    describe('rot90', () => {
        it('should rotate a 2d array clockwise 90 degrees', () => {
            expect(rot90(arr)).toEqual([[4, 1], [5, 2], [6, 3]]);
        })
    })

    describe('rot270', () => {
        it('should rotate a 2d array counterclockwise 90 degrees', () => {
            expect(rot270(arr)).toEqual([[3, 6], [2, 5], [1, 4]]);
        })
    })

    describe('simulateGridShift', () => {
        it('shifts tiles left and merges correctly', () => {
            // 2 2 . 
            // 4 . 4
            // . . .
            const grid = [
                [makeSlot(1), makeSlot(1), undefined],
                [makeSlot(2), undefined, makeSlot(2)],
                [undefined, undefined, undefined],
            ];
            const result = simulateGridShift(grid, 'left');
            // After shift:
            // 4 . .
            // 8 . .
            // . . .
            expect(result.grid).toEqual([
                [makeSlot(2, 1), undefined, undefined],
                [makeSlot(3, 2), undefined, undefined],
                [undefined, undefined, undefined],
            ]);
            expect(result.changed).toBe(true);
            expect(result.scoreDelta).toBe(4 + 8);
            expect(result.highestMergedExponent).toBe(3);
            expect(result.emptyCellPositions.sort(compareDuples)).toEqual([
                [0, 1], [0, 2],
                [1, 1], [1, 2],
                [2, 0], [2, 1], [2, 2]
            ]);
        });

        it('shifts tiles right and merges correctly', () => {
            // . . 2
            // . 4 .
            // . . 4
            const grid = [
                [undefined, undefined, makeSlot(1)],
                [undefined, makeSlot(2), undefined],
                [undefined, undefined, makeSlot(2)],
            ];
            const result = simulateGridShift(grid, 'right');
            // After shift:
            // . . 2
            // . . 4
            // . . 4
            expect(result.grid).toEqual([
                [undefined, undefined, makeSlot(1)],
                [undefined, undefined, makeSlot(2)],
                [undefined, undefined, makeSlot(2)],
            ]);
            expect(result.changed).toBe(true);
            expect(result.scoreDelta).toBe(0);
            expect(result.highestMergedExponent).toBe(0);
            expect(result.emptyCellPositions.sort(compareDuples)).toEqual([
                [0, 0], [0, 1],
                [1, 0], [1, 1],
                [2, 0], [2, 1]
            ]);
        });

        it('shifts tiles up and merges correctly', () => {
            // 2 . .
            // 2 4 .
            // . 4 .
            const grid = [
                [makeSlot(1), undefined, undefined],
                [makeSlot(1), makeSlot(2), undefined],
                [undefined, makeSlot(2), undefined],
            ];
            const result = simulateGridShift(grid, 'up');
            // After shift:
            // 4 8 .
            // . . .
            // . . .
            expect(result.grid).toEqual([
                [makeSlot(2, 1), makeSlot(3, 2), undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
            ]);
            expect(result.changed).toBe(true);
            expect(result.scoreDelta).toBe(4 + 8);
            expect(result.highestMergedExponent).toBe(3);
            expect(result.emptyCellPositions.sort(compareDuples)).toEqual(
                [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]
            );
        });

        it('shifts tiles down and merges correctly', () => {
            // 2 . .
            // 2 4 .
            // . 4 .
            const grid = [
                [makeSlot(1), undefined, undefined],
                [makeSlot(1), makeSlot(2), undefined],
                [undefined, makeSlot(2), undefined],
            ];
            const result = simulateGridShift(grid, 'down');
            // After shift:
            // . . .
            // . . .
            // 4 8 .
            expect(result.grid).toEqual([
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [makeSlot(2, 1), makeSlot(3, 2), undefined],
            ]);
            expect(result.changed).toBe(true);
            expect(result.scoreDelta).toBe(4 + 8);
            expect(result.highestMergedExponent).toBe(3);
            expect(result.emptyCellPositions.sort(compareDuples)).toEqual(
                [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 2]]
            );
        });

        it('does not change grid if no moves are possible', () => {
            // 2 4 8
            // 16 32 64
            // 128 256 512
            const grid = [
                [makeSlot(1), makeSlot(2), makeSlot(3)],
                [makeSlot(4), makeSlot(5), makeSlot(6)],
                [makeSlot(7), makeSlot(8), makeSlot(9)],
            ];
            const result = simulateGridShift(grid, 'left');
            expect(result.grid).toEqual([
                [makeSlot(1), makeSlot(2), makeSlot(3)],
                [makeSlot(4), makeSlot(5), makeSlot(6)],
                [makeSlot(7), makeSlot(8), makeSlot(9)],
            ]);
            expect(result.changed).toBe(false);
            expect(result.scoreDelta).toBe(0);
            expect(result.highestMergedExponent).toBe(0);
            expect(result.emptyCellPositions).toEqual([]);
        });
    });
})

describe('createAccessibleShiftAnnouncement', () => {
    const direction: 'left' | 'right' | 'up' | 'down' = 'left';

    it('includes direction and spawn info when no merges', () => {
        const grid = [
            [makeSlot(1), undefined, undefined],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
        ];
        const newTile = { position: [1, 2], exponent: 2 };
        const announcement = (createAccessibleShiftAnnouncement as any)(direction, grid, newTile);
        expect(announcement).toContain('Grid shifted left');
        expect(announcement).toMatch(/tile spawned/);
        expect(announcement).toMatch(/row 2 column 3/);
    });

    it('includes merge info for merged tiles', () => {
        const grid = [
            [
                makeSlot(2, 1),
                undefined,
                undefined
            ],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
        ];
        const newTile: SpawnTile = { position: [0, 2], exponent: 1 }
        const announcement = createAccessibleShiftAnnouncement(direction, grid, newTile);
        expect(announcement).toContain('Grid shifted left');
        expect(announcement).toMatch(/Merged two 2 tiles into a 4/);
        expect(announcement).toMatch(/tile spawned/);
    });

    it('handles multiple merges and spawn', () => {
        const grid = [
            [
                makeSlot(3, 2),
                makeSlot(2, 1),
                undefined
            ],
            [undefined, undefined, undefined],
            [undefined, undefined, undefined],
        ];
        const newTile: SpawnTile = { position: [2, 1], exponent: 2 };
        const announcement = createAccessibleShiftAnnouncement(direction, grid, newTile);
        expect(announcement).toContain('Grid shifted left');
        expect(announcement).toMatch(/Merged two 4 tiles into a 8/);
        expect(announcement).toMatch(/Merged two 2 tiles into a 4/);
        expect(announcement).toMatch(/tile spawned/);
    });
});