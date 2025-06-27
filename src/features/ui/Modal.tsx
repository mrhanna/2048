import styled from "styled-components";

const Overlay = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(0, 0, 0, .5);
`

const Dialog = styled.dialog`
    background: rgb(247, 241, 227);
    padding: 24pt;
    border-radius: 20px;
`

const PrimaryButton = styled.button`
    border-radius: 10px;
    background-color: rgb(102, 82, 59);
    color: #eee;
`

const SecondaryButton = styled.button`
    border-radius: 10px;
    background: none;
    border: 2px solid rgb(102, 82, 59);
    color: rgb(102, 82, 59);
`

export interface DialogOption {
    text: string,
    action?: any, //Action
}

export interface ModalProps {
    title?: string;
    message?: string;
    confirm?: DialogOption,
    dismiss?: DialogOption,
}

export default function Modal(props: ModalProps) {
    return (
        <Overlay>
            <Dialog>
                {props.title && <h2>{props.title}</h2>}
                {props.message && <p>{props.message}</p>}
                {props.confirm &&
                    <PrimaryButton>{props.confirm.text}</PrimaryButton>
                }
                {props.dismiss ?
                    <SecondaryButton>{props.dismiss.text}</SecondaryButton>
                    :
                    <SecondaryButton>Cancel</SecondaryButton>
                }
            </Dialog>
        </Overlay>
    )
}