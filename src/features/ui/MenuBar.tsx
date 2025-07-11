import styled from "styled-components"
import { newGame } from "../game/gameActions";
import { useAppDispatch, useAppState } from "../../app/AppContext";
import { openModal } from "./uiActions";
import MenuButton from "./MenuButton";
import GridSizeSelector from "./GridSizeSelector";
import DayNightThemeButton from "./DayNightThemeButton";

const MenuBarWrapper = styled.div`
    display: flex;
    padding: 1em 0;
    justify-content: space-between;
    gap: 1em;
`

export default function MenuBar() {
    const state = useAppState();
    const dispatch = useAppDispatch();

    const handleNewGameClicked = state.game.isGameOver || state.game.score.current === 0 ?
        () => { dispatch(newGame()) }
        :
        () => {
            dispatch(openModal(
                'newGameModal',
            ));
        };

    return (
        <MenuBarWrapper>
            <MenuButton $variant="secondary" onClick={handleNewGameClicked}>New Game</MenuButton>
            <DayNightThemeButton />
            <GridSizeSelector />
        </MenuBarWrapper>
    );
}