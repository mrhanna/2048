import type { GameState } from "../../game/gameReducer";
import { useEffect } from "react";
import { openModal } from "../uiActions";
import { incrementGoal } from "../../game/gameActions";
import type { Action } from "../../../app/rootReducer";
import styled from "styled-components";
import { TileView } from "../../game/Tile";

const WinMessageTileWrapper = styled.div`
    display: block;
    width: 15vh;
    aspect-ratio: 1;
    position: relative;
    margin: 1em auto;
    container-type: size;
`;

export default function useYouWin(state: GameState, dispatch: React.ActionDispatch<[Action]>) {
    useEffect(() => {
        if (state.exponentGoal === state.highestExponentAchieved) {
            dispatch(
                openModal({
                    title: 'You Win',
                    message: (
                        <WinMessageTileWrapper>
                            <TileView exponent={state.exponentGoal}>{2 ** state.exponentGoal}</TileView>
                        </WinMessageTileWrapper>
                    ),
                    dismiss: {
                        text: 'Continue',
                        action: incrementGoal(),
                    },
                })
            );
        }
    }, [state.highestExponentAchieved, state.exponentGoal])
}