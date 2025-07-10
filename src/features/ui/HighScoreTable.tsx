import { useAppState } from "../../app/AppContext";
import config from "../../app/config";

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
        <table>
            <tbody>
                <tr>
                    <th>Mode</th>
                    <th>Score</th>
                </tr>
                {rows}
            </tbody>
        </table>
    )
}