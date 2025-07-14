import styled from "styled-components";

const FullScreenWarning = styled.div`
    width: 100%;
    height: 100%;
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