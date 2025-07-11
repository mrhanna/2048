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
        <div className="sr-only">
            <table aria-label="2048 game grid">
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}