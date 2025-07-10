import styled from "styled-components";
import { useAppState } from "../../../app/AppContext";
import config from "../../../app/config";

const StyledTable = styled.table`
    display: inline-table;
    border-collapse: separate;
    border-spacing: 0;
    color: ${({ theme }) => theme.colors.primary};
    width: 63%;
    min-width: min(200px, 100%);
    margin: 0 0 1em;

    & tr:nth-child(odd) {
        background-color: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.primary};
    }

    & th, & td {
        padding: .5em;
    }

    & td:first-child, & th:first-child {
        text-align: left;
    }

    & td:last-child, & th:last-child {
        text-align: right;
        font-weight: 900;
    }
`

export default function HighScoreTable() {
    const highScores = useAppState().game.score.best;
    const rows: React.ReactElement[] = [];

    for (let i = config.minGridSize; i <= config.maxGridSize; i++) {
        rows.push(
            <tr key={i}>
                <td>{i}&times;{i}</td>
                <td>{highScores[i] ?? 0}</td>
            </tr>
        )
    }

    return (
        <StyledTable>
            <tbody>
                {rows}
            </tbody>
        </StyledTable>
    )
}