import { GameContext } from "./components/GameContext";
import { gameReducer, initializeGameState } from "./components/gameReducer";
import Grid from "./components/Grid";
import { useReducer } from "react";
import ScoreDisplay from "./components/ScoreDisplay";
import styled from "styled-components";

const AppWrapper = styled.div`
  text-align: center;
`;

function App() {
  const [state, dispatch] = useReducer(gameReducer, 4, initializeGameState)

  return (
    <GameContext.Provider value={dispatch}>
      <AppWrapper>
        <ScoreDisplay {...state.score} />
        <Grid grid={state.grid} />
      </AppWrapper>
    </GameContext.Provider>
  )
}

export default App
