import { createContext, useContext } from "react";
import type { ShiftAction } from "./gameReducer";

export const GameContext = createContext<React.Dispatch<ShiftAction> | null>(null);

export function useGameDispatch() {
    const dispatch = useContext(GameContext);

    if (!dispatch) {
        throw new Error('useGameDispatch must be used in scope of GameContext.Provider');
    }
    
    return dispatch;
}