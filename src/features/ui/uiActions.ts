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

export type UIAction = OpenModalAction | DismissModalAction;