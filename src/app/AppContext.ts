import { createContext, useContext } from "react";
import type { Action, RootState } from "./rootReducer";

export const AppContext = createContext<{
    dispatch: React.Dispatch<Action>,
    state: RootState
} | null>(null);

export function useAppDispatch() {
    const dispatch = useContext(AppContext)?.dispatch;

    if (!dispatch) {
        throw new Error('useAppDispatch must be used in scope of AppContext.Provider');
    }

    return dispatch;
}

export function useAppState() {
    const state = useContext(AppContext)?.state;

    if (!state) {
        throw new Error('useAppDispatch must be used in scope of AppContext.Provider');
    }

    return state;
}