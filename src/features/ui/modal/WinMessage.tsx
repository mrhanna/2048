import styled from "styled-components";
import { useAppState } from "../../../app/AppContext";
import { TileView } from "../../game/Tile";

const WinMessageTileWrapper = styled.div`
    display: block;
    width: 15vh;
    aspect-ratio: 1;
    position: relative;
    margin: 1em auto;
    container-type: size;
`;

export default function WinMessage() {
    const state = useAppState();

    return (
        <WinMessageTileWrapper>
            <TileView exponent={state.game.exponentGoal}>{2 ** state.game.exponentGoal}</TileView>
        </WinMessageTileWrapper>
    );
}