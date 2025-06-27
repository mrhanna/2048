import styled from "styled-components";
import { gameReducer, initializeGameState } from "./features/game/gameReducer";
import { useReducer } from "react";
import { GameContext } from "./features/game/GameContext";
import ScoreDisplay from "./features/game/ScoreDisplay";
import Grid from "./features/game/Grid";
import MenuBar from "./features/ui/MenuBar";

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
        <MenuBar />
      </AppWrapper>
    </GameContext.Provider>
  )
}

export default App
