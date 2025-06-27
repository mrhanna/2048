import styled from "styled-components"
import { newGame } from "../game/gameActions";
import { useAppDispatch } from "../../app/AppContext";

const MenuBarWrapper = styled.div`
    display: flex;
`

export default function MenuBar() {
    const dispatch = useAppDispatch();

    return (
        <MenuBarWrapper>
            <button onClick={() => { dispatch(newGame()) }}>New Game</button>
        </MenuBarWrapper>
    );
}