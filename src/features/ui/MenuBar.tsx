import styled from "styled-components"
import { newGame } from "../game/gameActions";
import { useAppDispatch } from "../../app/AppContext";
import { openModal } from "./uiActions";

const MenuBarWrapper = styled.div`
    display: flex;
    padding: 1em 0;
    justify-content: center;
`

const MenuButton = styled.button`
    display: block;
    padding: .5em;
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

export default function MenuBar() {
    const dispatch = useAppDispatch();

    const handleClick = () => {
        dispatch(openModal(
            {
                title: 'New Game',
                message: 'All progress will be lost. Start a new game?',
                confirm: {
                    text: 'New Game',
                    action: newGame(),
                }
            }
        ));
    }

    return (
        <MenuBarWrapper>
            <MenuButton className="primary" onClick={handleClick}>New Game</MenuButton>
        </MenuBarWrapper>
    );
}