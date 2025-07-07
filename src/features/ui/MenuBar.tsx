import styled from "styled-components"
import { newGame } from "../game/gameActions";
import { useAppDispatch, useAppState } from "../../app/AppContext";
import { openModal } from "./uiActions";
import MenuButton from "./MenuButton";
import GridSizeSelector from "./GridSizeSelector";

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
                {
                    title: 'New Game',
                    message: 'All progress will be lost. Start a new game?',
                    confirm: {
                        text: 'New Game',
                        action: newGame(),
                    }
                }
            ));
        };

    return (
        <MenuBarWrapper>
            <MenuButton className="secondary" onClick={handleNewGameClicked}>New Game</MenuButton>
            <GridSizeSelector />
        </MenuBarWrapper>
    );
}