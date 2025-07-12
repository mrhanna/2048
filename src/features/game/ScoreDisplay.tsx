import NumberFlow from "@number-flow/react";
import styled, { css, keyframes } from "styled-components";
import { useAppDispatch, useAppState } from "../../app/AppContext";
import { applyVariant, type Variant } from "../ui/variants";
import { openModal } from "../ui/uiActions";
import { themeTransition, themeTransitionAnd } from "../ui/themeTransition";

interface ScoreProps {
    label?: string,
    value: number,
    $variant: Variant,
    onClick?: React.MouseEventHandler,
}

const scoreViewWrapperStyle = css<{ $variant: Variant }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    font-size: 14pt;

    text-align: center;
    ${applyVariant()}
    border-radius: ${({ theme }) => theme.borderRadius};
    padding: 10px;
    width: 150px;
    font-weight: 900;

    ${themeTransitionAnd('transform .1s')}

    @media screen and (min-width: 768px) {
        font-size: 18pt;
        height: 72px;
        flex-direction: column;
    }
`

const ScoreViewWrapper = styled.div<{ $variant: Variant }>`
    ${scoreViewWrapperStyle}
`

const ClickableScoreViewWrapper = styled.button<{ $variant: Variant }>`
    ${scoreViewWrapperStyle}

    &:hover {
        transform: scale(1.1);
    }
`


const ScoreLabel = styled.div`
    font-size: 9pt;
    text-transform: uppercase;
    font-weight: normal;
`

const ScoreDisplayWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: stretch;

    gap: 10px;

    @media screen and (min-width: 768px) {
        justify-content: center;
    }
`

const fadeIn = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`

const GameOverDisplay = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    background-color: ${({ theme }) => theme.colors.bg};

    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ${themeTransition};

    animation: ${fadeIn} .6s;

    & * {
        margin: 0;
    }

    & h2 {
        font-size: 1em;

        @media screen and (min-width: 768px) {
            font-size: 1.5em;
        }
    }
`

function ScoreView(props: ScoreProps) {
    const content = <>
        {props.label && <ScoreLabel>{props.label}</ScoreLabel>}
        <NumberFlow value={props.value} />
    </>;

    return !props.onClick ?
        <ScoreViewWrapper $variant={props.$variant}>
            {content}
        </ScoreViewWrapper>
        :
        <ClickableScoreViewWrapper $variant={props.$variant} onClick={props.onClick}>
            {content}
        </ClickableScoreViewWrapper>
}

export default function ScoreDisplay() {
    const state = useAppState();
    const dispatch = useAppDispatch();

    const { current, best } = state.game.score;
    const gridSize = state.game.grid.length;

    const handleBestScoreClicked = () => {
        dispatch(openModal(
            'highScoresModal',
        ));
    }

    return (
        <ScoreDisplayWrapper aria-label="Scoreboard" role="region">
            <ScoreView $variant="secondary" label="Score" value={current} />
            <ScoreView onClick={handleBestScoreClicked} $variant="outline" label="Best" value={best[gridSize] ?? 0} />

            {state.game.isGameOver &&
                <GameOverDisplay
                    aria-label="Game over"
                    role="alert"
                >
                    <h2>Game Over</h2>
                    <p>You scored {current}</p>
                </GameOverDisplay>
            }
        </ScoreDisplayWrapper>
    );
}