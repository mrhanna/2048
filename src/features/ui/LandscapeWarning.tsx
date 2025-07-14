import styled from "styled-components";

const FullScreenWarning = styled.div`
    width: 100%;
    min-height: 80vh;
    min-height: 80svh;
    display: grid;
    place-items: center;
`

export default function LandscapeWarning() {
    return (
        <FullScreenWarning>
            <p>Please turn your device to portrait mode to play.</p>
        </FullScreenWarning>
    )
}