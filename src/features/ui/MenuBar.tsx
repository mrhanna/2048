import styled from "styled-components"
import { newGame } from "../game/gameActions";
import { useAppDispatch } from "../../app/AppContext";
import { openModal } from "./uiActions";

const MenuBarWrapper = styled.div`
    display: flex;
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
            <button onClick={handleClick}>New Game</button>
        </MenuBarWrapper>
    );
}