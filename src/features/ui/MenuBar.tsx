import styled from "styled-components"
import { newGame } from "../game/gameActions";
import { useAppDispatch, useAppState } from "../../app/AppContext";
import { openModal } from "./uiActions";
import MenuButton from "./MenuButton";
import GridSizeSelector from "./GridSizeSelector";
import DayNightThemeButton from "./DayNightThemeButton";
import { HiRefresh } from "react-icons/hi";

const MenuBarWrapper = styled.div`
    display: flex;
    justify-content: flex-end;

    padding: 1em 0;
    gap: .5em;
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
            <MenuButton $variant="secondary" onClick={handleNewGameClicked} aria-label="new game button"><HiRefresh /></MenuButton>
            <DayNightThemeButton />
            <GridSizeSelector />
        </MenuBarWrapper>
    );
}