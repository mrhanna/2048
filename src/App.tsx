import { GameContext } from "./components/GameContext";
import { gameReducer, initGameState } from "./components/gameReducer";
import Grid from "./components/Grid";
import { useReducer } from "react";

function App() {
  const [state, dispatch] = useReducer(gameReducer, 4, initGameState)
  
  return (
    <GameContext.Provider value={dispatch}>
      <Grid grid={state.grid} />
    </GameContext.Provider>
  )
}

export default App
