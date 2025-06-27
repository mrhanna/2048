import type { Action } from "../../app/rootReducer";
import type { ModalContent } from "./Modal";
import type { OpenModalAction } from "./uiActions";

export interface UIState {
    modal: ModalContent | null,
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