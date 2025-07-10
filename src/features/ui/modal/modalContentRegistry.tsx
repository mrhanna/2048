import { incrementGoal, newGame } from "../../game/gameActions";
import type { ModalContent } from "../Modal";
import HighScoreTable from "./HighScoreTable";
import WinMessage from "./WinMessage";

type ModalContentEntry<P = undefined> = P extends undefined ? ModalContent : (params: P) => ModalContent;

export const modalContentRegistry = {
    newGameModal: {
        title: 'New Game',
        message: 'All progress will be lost. Start a new game?',
        options: [{
            text: 'New Game',
            action: newGame(),
        }]
    },

    confirmGridChangeModal: ({ nextGridSize }: {
        nextGridSize: number
    }) => ({
        message: `All progress will be lost. Change the grid to ${nextGridSize}\u00d7${nextGridSize} and start a new game?`,
        options: [{
            text: 'New Game',
            action: newGame(nextGridSize),
        }]
    }),

    youWinModal: {
        title: 'You Win',
        message: <WinMessage />,
        options: [{
            text: 'Continue',
            $variant: 'outline',
            action: incrementGoal(),
        }],
        dismiss: false,
    },

    highScoresModal: {
        title: 'High Scores',
        message: <HighScoreTable />,
        dismiss: 'Back to game',
    }
} satisfies Record<string, ModalContentEntry<any>>;

type ModalContentRegistry = typeof modalContentRegistry;

export type ModalIntentType = keyof ModalContentRegistry;
export type ModalIntentParams<K extends ModalIntentType> =
    typeof modalContentRegistry[K] extends (params: infer P) => ModalContent
    ? P
    : undefined;

export type ModalIntent = {
    [T in ModalIntentType]: {
        type: T,
        params: ModalIntentParams<T>
    }
}[ModalIntentType];

export function realizeModalContent(
    intent: ModalIntent,
): ModalContent {
    const entry = modalContentRegistry[intent.type];

    if (typeof entry === 'function') {
        return entry(intent.params!);
    }

    return entry;
}
