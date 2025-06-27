import type { Action } from "../../app/rootReducer";
import type { ModalProps } from "./Modal";
import type { OpenModalAction } from "./uiActions";

export interface UIState {
    modal: ModalProps | null,
}

export function initializeUIState() {
    return {
        modal: null,
    }
}

export default function uiReducer(state: UIState, action: Action) {
    switch (action.type) {
        case 'openModal':
            console.log('open modal')
            return {
                ...state,
                modal: (action as OpenModalAction).payload,
            };
        case 'dismissModal':
            return {
                ...state,
                modal: null,
            }
    }
    return state;
}