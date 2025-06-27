import { createContext, useContext } from "react";
import type { GameAction } from "./gameActions";

export const GameContext = createContext<React.Dispatch<GameAction> | null>(null);

export function useGameDispatch() {
    const dispatch = useContext(GameContext);

    if (!dispatch) {
        throw new Error('useGameDispatch must be used in scope of GameContext.Provider');
    }
    
    return dispatch;
}