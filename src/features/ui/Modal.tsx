import styled, { keyframes } from "styled-components";
import type { Action } from "../../app/rootReducer";
import { useAppDispatch } from "../../app/AppContext";
import { dismissModal } from "./uiActions";

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
`

const fadeSlideIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(30%) scale(50%);
    }

    to {
        opacity: 1;
        transform: none;
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
    animation: ${fadeSlideIn} .3s cubic-bezier(.25,.1,.25,1.5);
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
        outline: 5px solid #eee;
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

export interface ModalProps {
    title?: string;
    message?: string;
    confirm?: DialogOption,
    dismiss?: DialogOption,
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

    return (
        <Overlay>
            <Dialog open>
                {props.title && <h2>{props.title}</h2>}
                {props.message && <p>{props.message}</p>}
                {props.confirm &&
                    <DialogButton className="primary" onClick={makeCallback(dispatch, props.confirm.action)}>{props.confirm.text}</DialogButton>
                }
                {props.dismiss ?
                    <DialogButton className="secondary" onClick={makeCallback(dispatch, props.dismiss.action)}>{props.dismiss.text}</DialogButton>
                    :
                    <DialogButton className="secondary" onClick={makeCallback(dispatch)}>Cancel</DialogButton>
                }
            </Dialog>
        </Overlay>
    )
}