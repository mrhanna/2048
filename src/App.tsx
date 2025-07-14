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
import AboutText from "./features/ui/AboutText";

const RootWrapper = styled.main`
    font-size: 18pt;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.base};
    width: 100%;
    min-height: 100vh;
    min-height: 100svh;
    padding: 10px;
    ${themeTransition}

    @media screen and (min-width: 768px) {
        padding: 1em;
    }
`

const Main = styled.main`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;

    justify-content: flex-start;
    align-items: center;

    gap: 10px;

    @media screen and (min-width: 768px) {
        gap: 1em;
    }
`

const Container = styled.section`
    width: 100%;
    max-width: 60vh;
`

const Heading = styled.h1`
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;

    font-size: 1.5em;

    @media screen and (min-width: 768px) {
        font-size: 72px;
        line-height: 72px;
        position: absolute;
        left: 0;
        top: 0;
    }
`

const Footer = styled.footer`
    position: fixed;
    right: 0;
    bottom: 0;
    font-size: 14px;
    padding: 10px;
    color: ${({ theme }) => theme.colors.primary};
`

function App() {
    const [state, dispatch] = useReducer(rootReducer, null, initializeState)
    usePersistence('2048state', state, 300);
    useYouWin(state.game, dispatch);

    const theme = state.ui.theme ?? config.themes.default;

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <ThemeProvider theme={theme}>
                <RootWrapper>
                    <Modal intent={state.ui.modal} />
                    <Main>
                        <Heading>2048</Heading>
                        <Container>
                            <ScoreDisplay />
                        </Container>
                        <Container>
                            <Grid grid={state.game.grid} />
                            <div className="sr-only" aria-live="polite">{state.game.verbose}</div>
                        </Container>
                        <Container>
                            <MenuBar />
                        </Container>
                    </Main>
                    <Footer>
                        <AboutText theme={theme} />
                    </Footer>
                </RootWrapper>
            </ThemeProvider>
        </AppContext.Provider>
    )
}

export default App;
