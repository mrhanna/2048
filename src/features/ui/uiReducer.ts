import type { DefaultTheme } from "styled-components/dist/types";
import type { Action } from "../../app/rootReducer";
import type { OpenModalAction, ThemeChangedAction } from "./uiActions";
import config from "../../app/config";
import type { ModalIntent } from "./modal/modalContentRegistry";

export interface UIState {
    modal: ModalIntent | null,
    theme: DefaultTheme,
}

export function initializeUIState() {
    return {
        modal: null,
        theme: config.themes.default,
    }
}

export default function uiReducer(state: UIState, action: Action) {
    switch (action.type) {
        case 'openModal':
            return {
                ...state,
                modal: (action as OpenModalAction).payload,
            };
        case 'dismissModal':
            return {
                ...state,
                modal: null,
            }
        case 'themeChanged':
            return {
                ...state,
                theme: (action as ThemeChangedAction).payload,
            }
    }
    return state;
}