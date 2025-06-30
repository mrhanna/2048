import type { GameAction } from "../features/game/gameActions";
import { gameReducer, initializeGameState, type GameState } from "../features/game/gameReducer";
import type { UIAction } from "../features/ui/uiActions";
import type { UIState } from "../features/ui/uiReducer";
import uiReducer, { initializeUIState } from "../features/ui/uiReducer";

export interface RootState {
    game: GameState,
    ui: UIState,
}

export type Action = GameAction | UIAction;

export function initializeState() {
    const saved = localStorage.getItem('2048state');

    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            // fallback to new game
        }
    }

    return {
        game: initializeGameState(),
        ui: initializeUIState(),
    }
}

export default function rootReducer(state: RootState, action: Action) {
    return {
        game: gameReducer(state.game, action),
        ui: uiReducer(state.ui, action),
    }
}