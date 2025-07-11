import styled, { ThemeProvider } from "styled-components";
import { useReducer } from "react";
import ScoreDisplay from "./features/game/ScoreDisplay";
import Grid from "./features/game/Grid";
import MenuBar from "./features/ui/MenuBar";
import { AppContext } from "./app/AppContext";
import rootReducer, { initializeState } from "./app/rootReducer";
import Modal from "./features/ui/Modal";
import useYouWin from "./features/ui/hooks/useYouWin";
import usePersistence from "./app/usePersistence";
import config from "./app/config";
import { themeTransition } from "./features/ui/themeTransition";

const RootWrapper = styled.div`
    font-size: 18pt;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.base};
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    padding: 0 10px;
    ${themeTransition}
`

const AppWrapper = styled.main`
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
            <ThemeProvider theme={state.ui.theme ?? config.themes.default}>
                <RootWrapper>
                    <Modal intent={state.ui.modal} />
                    <AppWrapper>
                        <ScoreDisplay />
                        <Grid grid={state.game.grid} />
                        <div className="sr-only" aria-live="polite">{state.game.verbose}</div>
                        <MenuBar />
                    </AppWrapper>
                </RootWrapper>
            </ThemeProvider>
        </AppContext.Provider>
    )
}

export default App;
