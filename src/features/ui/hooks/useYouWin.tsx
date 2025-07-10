import type { GameState } from "../../game/gameReducer";
import { useEffect } from "react";
import { openModal } from "../uiActions";
import type { Action } from "../../../app/rootReducer";

export default function useYouWin(state: GameState, dispatch: React.ActionDispatch<[Action]>) {
    useEffect(() => {
        if (state.exponentGoal === state.highestExponentAchieved) {
            dispatch(
                openModal(
                    'youWinModal',
                )
            );
        }
    }, [state.highestExponentAchieved, state.exponentGoal])
}