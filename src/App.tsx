import styled from "styled-components";
import { useReducer } from "react";
import ScoreDisplay from "./features/game/ScoreDisplay";
import Grid from "./features/game/Grid";
import MenuBar from "./features/ui/MenuBar";
import { AppContext } from "./app/AppContext";
import rootReducer, { initializeState } from "./app/rootReducer";

const AppWrapper = styled.div`
  text-align: center;
`;

function App() {
  const [state, dispatch] = useReducer(rootReducer, null, initializeState)

  return (
    <AppContext.Provider value={dispatch}>
      <AppWrapper>
        <ScoreDisplay {...state.game.score} />
        <Grid grid={state.game.grid} />
        <MenuBar />
      </AppWrapper>
    </AppContext.Provider>
  )
}

export default App
