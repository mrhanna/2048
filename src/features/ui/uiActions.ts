import type { ModalProps } from "./Modal";

export type OpenModalAction = ReturnType<typeof openModal>;
export function openModal(modalProps: ModalProps) {
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