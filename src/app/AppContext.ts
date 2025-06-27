import { createContext, useContext } from "react";
import type { Action } from "./rootReducer";

export const AppContext = createContext<React.Dispatch<Action> | null>(null);

export function useAppDispatch() {
    const dispatch = useContext(AppContext);

    if (!dispatch) {
        throw new Error('useAppDispatch must be used in scope of AppContext.Provider');
    }
    
    return dispatch;
}