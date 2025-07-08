import type { GridState } from "./gameReducer";

interface AccessibleGridProps {
    grid: GridState,
}

export default function AccessibleGrid({ grid }: AccessibleGridProps) {
    const rows = grid.map((row, rowIndex) => {
        const cells = row.map((cell, cellIndex) => (
            <td key={`${rowIndex},${cellIndex}`}>{cell ?
                2 ** cell.tile.exponent
                :
                'empty'}
            </td>
        ));

        return (<tr key={rowIndex}>{cells}</tr>)
    })

    return (
        <table aria-label="2048 game grid" className="sr-only">
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}