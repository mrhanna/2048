import type { DefaultTheme } from "styled-components";
import type { ModalIntent, ModalIntentParams, ModalIntentType } from "./modal/modalContentRegistry";

// export type OpenModalAction = ReturnType<typeof openModal>
export type OpenModalAction = {
    type: 'openModal',
    payload: ModalIntent
}
export function openModal<T extends ModalIntentType>(
    type: T,
    params?: ModalIntentParams<T>,
) {
    return {
        type: 'openModal' as const,
        payload: {
            type,
            params,
        }
    };
}


export type DismissModalAction = ReturnType<typeof dismissModal>;
export function dismissModal() {
    return {
        type: 'dismissModal',
    };
}

export type ThemeChangedAction = ReturnType<typeof themeChanged>;
export function themeChanged(theme: DefaultTheme) {
    return {
        type: 'themeChanged',
        payload: theme,
    };
}

export type UIAction = OpenModalAction | DismissModalAction | ThemeChangedAction;