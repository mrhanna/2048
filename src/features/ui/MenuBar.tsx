import styled from "styled-components"
import { useGameDispatch } from "../game/GameContext"
import { newGame } from "../game/gameActions";

const MenuBarWrapper = styled.div`
    display: flex;
`

export default function MenuBar() {
    const dispatch = useGameDispatch();
    return (
        <MenuBarWrapper>
            <button onClick={() => { dispatch(newGame()) }}>New Game</button>
        </MenuBarWrapper>
    )
}