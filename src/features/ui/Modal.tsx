import styled from "styled-components";
import type { Action } from "../../app/rootReducer";
import { useAppDispatch } from "../../app/AppContext";
import { dismissModal } from "./uiActions";
import { useEffect, useRef } from "react";
import useModalFocusTrap from "./hooks/useModalFocusTrap";
import ExitWrapper from "./ExitWrapper";
import { fadeIn, fadeOut, slideIn, slideOut } from "./animations";
import { applyVariant, type Variant } from "./variants";
import { realizeModalContent, type ModalIntent } from "./modal/modalContentRegistry";
import { themeTransition } from "./themeTransition";

const Overlay = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;

    z-index: 1000;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(0, 0, 0, .7);

    animation: ${fadeIn} .3s ease;

    &.exiting {
        animation: ${fadeOut} .2s ease forwards;
    }
`

const Dialog = styled.dialog`
    position: relative;
    background: ${({ theme }) => theme.colors.modalBg};
    color: ${({ theme }) => theme.colors.base};
    padding: 24pt;
    border-radius: ${({ theme }) => theme.borderRadius};
    z-index: 1001;
    border: none;
    text-align: center;
    animation: ${slideIn} .3s cubic-bezier(.25,.1,.25,1.5);

    width: 100%;
    max-width: 80vh;


    ${themeTransition}

    .exiting & {
        animation: ${slideOut} .2s ease-in forwards;
    }
`

const DialogButton = styled.button<{ $variant: Variant }>`
    display: block;
    margin: .5em 0;
    padding: .5em;
    width: 100%;
    font-size: inherit;
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: transform .1s;

    ${applyVariant()}

    &:hover {
        transform: scale(1.05);
    }
`

export interface DialogOption {
    text: string,
    action?: {
        type: string,
        payload?: any,
    },
    $variant?: Variant,
}

export interface ModalContent {
    title?: string;
    message?: string | React.ReactElement;
    options?: DialogOption[],
    dismiss?: string | boolean,
}

function makeCallback(dispatch: React.Dispatch<Action>, action?: Action) {
    return () => {
        dispatch(dismissModal());
        if (action) {
            dispatch(action);
        }
    }
}

export default function Modal({ intent }: { intent: ModalIntent | null }) {
    const dispatch = useAppDispatch();
    const lastIntent = useRef(intent);

    useEffect(() => {
        if (intent) {
            lastIntent.current = { ...intent };
        }
    }, [intent]);

    const modalRef = useRef<HTMLDialogElement | null>(null);
    useModalFocusTrap(modalRef, !!intent, () => { dispatch(dismissModal()) });

    const intentToRender = intent || lastIntent.current;
    if (!intentToRender) return null;

    const content = {
        dismiss: true,
        options: [],
        ...realizeModalContent(intentToRender)
    }

    const optionButtons = content.options.map((option, index) => (
        <DialogButton
            autoFocus={index === 0 && true}
            $variant={option.$variant ?? 'primary'}
            onClick={makeCallback(dispatch, option.action)}
            key={index}
        >{option.text}</DialogButton>
    ));

    return (
        <ExitWrapper
            show={!!intent}
            exitingClassName="exiting"
            exitAnimationTimeMilliseconds={200}
        >
            <Overlay>
                <Dialog ref={modalRef} open>
                    {content.title && <h2>{content.title}</h2>}
                    {content.message && (
                        typeof content.message === 'string' ?
                            <p>{content.message}</p>
                            :
                            content.message
                    )}
                    {optionButtons}
                    {(content.dismiss &&
                        <DialogButton
                            autoFocus={content.options.length === 0}
                            $variant="outline"
                            onClick={makeCallback(dispatch)}
                        >{typeof content.dismiss === 'boolean' ? 'Cancel' : content.dismiss}</DialogButton>
                    )}
                </Dialog>
            </Overlay>
        </ExitWrapper>
    )
}