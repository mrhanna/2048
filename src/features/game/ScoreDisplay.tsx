import NumberFlow from "@number-flow/react";
import styled from "styled-components";
import type { Score } from "./gameReducer";

interface ScoreProps {
    label?: string,
    value: number,
}

const ScoreViewWrapper = styled.div`
    text-align: center;
    background-color:rgb(102, 82, 59);
    color: #eee;
    border-radius: 10px;
    padding: 10px;
    width: 150px;
`

const ScoreLabel = styled.div`
    font-size: .5em;
    text-transform: uppercase;
`

const ScoreDisplayWrapper = styled.div`
    display: flex;
    justify-content: center;
    gap: 1em;
    padding: 1em 0;
`

function ScoreView(props: ScoreProps) {
    return (
        <ScoreViewWrapper>
            {props.label && <ScoreLabel>{props.label}</ScoreLabel>}
            <NumberFlow value={props.value} />
        </ScoreViewWrapper>
    )
}

export default function ScoreDisplay({ current, best }: Score) {
    return (
        <ScoreDisplayWrapper>
            <ScoreView label="Score" value={current} />
            <ScoreView label="Best" value={best} />
        </ScoreDisplayWrapper>
    )
}