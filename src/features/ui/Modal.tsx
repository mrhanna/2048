import styled from "styled-components";
import type { Action } from "../../app/rootReducer";
import { useAppDispatch } from "../../app/AppContext";
import { dismissModal } from "./uiActions";
import { useEffect, useRef } from "react";
import useModalFocusTrap from "./hooks/useModalFocusTrap";
import ExitWrapper from "./ExitWrapper";
import { fadeIn, fadeOut, slideIn, slideOut } from "./animations";
import { applyVariant, type Variant } from "./variants";

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
    background: ${({ theme }) => theme.colors.bg};
    padding: 24pt;
    border-radius: ${({ theme }) => theme.borderRadius};
    z-index: 1001;
    border: none;
    text-align: center;
    animation: ${slideIn} .3s cubic-bezier(.25,.1,.25,1.5);

    width: 100%;
    max-width: 80vh;

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
    transition: outline .1s;

    ${applyVariant()}

    &:hover {
        outline: 5px solid #333;
    }
`

export interface DialogOption {
    text: string,
    action?: Action,
    $variant?: Variant,
}

export interface ModalContent {
    title?: string;
    message?: string | React.ReactElement;
    options?: [DialogOption],
    dismiss?: string | boolean,
}

interface ModalProps {
    content: ModalContent | null,
}

function makeCallback(dispatch: React.Dispatch<Action>, action?: Action) {
    return () => {
        dispatch(dismissModal());
        if (action) {
            dispatch(action);
        }
    }
}

export default function Modal(props: ModalProps) {
    const dispatch = useAppDispatch();

    const lastContent = useRef(props.content);

    useEffect(() => {
        if (props.content) {
            lastContent.current = { ...props.content };
        }
    }, [props.content]);

    const modalRef = useRef<HTMLDialogElement | null>(null);

    useModalFocusTrap(modalRef, !!props.content, () => { dispatch(dismissModal()) });

    const content = { dismiss: true, ...(props.content || lastContent.current) }

    const optionButtons = content.options?.map((option, index) => (
        <DialogButton
            autoFocus={index === 0 && true}
            $variant={option.$variant ?? 'primary'}
            onClick={makeCallback(dispatch, option.action)}
            key={index}
        >{option.text}</DialogButton>
    ));

    return (
        <ExitWrapper
            show={!!props.content}
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
                            autoFocus={!content.options && true}
                            $variant="outline"
                            onClick={makeCallback(dispatch)}
                        >{typeof content.dismiss === 'boolean' ? 'Cancel' : content.dismiss}</DialogButton>
                    )}
                </Dialog>
            </Overlay>
        </ExitWrapper>
    )
}