import styled from "styled-components";
import { useReducer } from "react";
import ScoreDisplay from "./features/game/ScoreDisplay";
import Grid from "./features/game/Grid";
import MenuBar from "./features/ui/MenuBar";
import { AppContext } from "./app/AppContext";
import rootReducer, { initializeState } from "./app/rootReducer";
import Modal from "./features/ui/Modal";
import useYouWin from "./features/ui/hooks/useYouWin";
import usePersistence from "./app/usePersistence";

const AppWrapper = styled.div`
    width: 100%;
    max-width: 60vh;
    margin: 0 auto;
    text-align: center;
`;

function App() {
    const [state, dispatch] = useReducer(rootReducer, null, initializeState)
    usePersistence('2048state', state, 300);

    useYouWin(state.game, dispatch);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <Modal content={state.ui.modal} />
            <AppWrapper>
                <ScoreDisplay />
                <Grid grid={state.game.grid} />
                <MenuBar />
            </AppWrapper>
        </AppContext.Provider>
    )
}

export default App;
