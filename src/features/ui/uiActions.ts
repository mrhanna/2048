import type { DefaultTheme } from "styled-components";
import type { ModalContent } from "./Modal";

export type OpenModalAction = ReturnType<typeof openModal>;
export function openModal(modalProps: ModalContent) {
    return {
        type: 'openModal',
        payload: modalProps,
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