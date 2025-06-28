import styled from "styled-components";
import { useReducer } from "react";
import ScoreDisplay from "./features/game/ScoreDisplay";
import Grid from "./features/game/Grid";
import MenuBar from "./features/ui/MenuBar";
import { AppContext } from "./app/AppContext";
import rootReducer, { initializeState } from "./app/rootReducer";
import Modal from "./features/ui/Modal";

const AppWrapper = styled.div`
  width: 100%;
  max-width: 60vh;
  margin: 0 auto;
  text-align: center;
`;

function App() {
  const [state, dispatch] = useReducer(rootReducer, null, initializeState)

  return (
    <AppContext.Provider value={dispatch}>
      <Modal content={state.ui.modal} />
      <AppWrapper>
        { state.game.gameOver ? 
          <>
            <h2>Game Over</h2>
            <p>You scored { state.game.score.current }</p>
          </>
          :
          <ScoreDisplay {...state.game.score} />
        }
        <Grid grid={state.game.grid} />
        <MenuBar isGameOver={state.game.gameOver} />
      </AppWrapper>
    </AppContext.Provider>
  )
}

export default App
