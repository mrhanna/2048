import styled, { keyframes } from "styled-components";
import type { Action } from "../../app/rootReducer";
import { useAppDispatch } from "../../app/AppContext";
import { dismissModal } from "./uiActions";
import { useEffect, useRef } from "react";
import useModalFocusTrap from "./hooks/useModalFocusTrap";
import ExitWrapper from "./ExitWrapper";

const slideIn = keyframes`
    from {
        transform: translateY(30%) scale(50%);
    }

    to {
        transform: none;
    }
`

const slideOut = keyframes`
    from {
        transform: none;
    }

    to {
        transform: translateY(30%) scale(50%);
    }    
`

const fadeIn = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`

const fadeOut = keyframes`
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
`

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
    background: rgb(247, 241, 227);
    padding: 24pt;
    border-radius: 20px;
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

const DialogButton = styled.button`
    display: block;
    margin: .5em 0;
    padding: .5em;
    width: 100%;
    font-size: inherit;
    border-radius: 10px;
    transition: outline .1s;

    &:hover {
        outline: 5px solid #333;
    }

    &.primary {
        background-color: rgb(102, 82, 59);
        color: #eee;
        border: none;
    }

    &.secondary {
        background: none;
        border: 2px solid rgb(102, 82, 59);
        color: rgb(102, 82, 59);
    }
`

export interface DialogOption {
    text: string,
    action?: Action,
}

export interface ModalContent {
    title?: string;
    message?: string | React.ReactElement;
    confirm?: DialogOption,
    dismiss?: DialogOption,
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

    const content = { ...(props.content || lastContent.current) }

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
                    {content.confirm &&
                        <DialogButton autoFocus className="primary" onClick={makeCallback(dispatch, content.confirm.action)}>{content.confirm.text}</DialogButton>
                    }
                    {content.dismiss ?
                        <DialogButton autoFocus={!content.confirm && true} className="secondary" onClick={makeCallback(dispatch, content.dismiss.action)}>{content.dismiss.text}</DialogButton>
                        :
                        <DialogButton autoFocus={!content.confirm && true} className="secondary" onClick={makeCallback(dispatch)}>Cancel</DialogButton>
                    }
                </Dialog>
            </Overlay>
        </ExitWrapper>
    )
}