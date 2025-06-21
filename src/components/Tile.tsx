import styled, {css, keyframes} from 'styled-components';

export interface TileInfo {
    id: string,
    exponent: number,
}

export interface TileProps extends TileInfo {
    position: [number, number],
    $under?: 0 | 1
}

interface TileColor {
    bg: string,
    fg: string,
}

const tileColors: TileColor[] = [
    { bg: '#eee', fg: '#222' },
    { bg: '#ccc', fg: '#222' },
    { bg: '#d9ae61', fg: '#eee' },
    { bg: '#c8963E', fg: '#eee' },
    { bg: '#d1462f', fg: '#eee' },
    { bg: '#573d1c', fg: '#eee' },
]

const fadeIn = keyframes`
    0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
`

const TileWrapper = styled.div<TileProps>`
    position: absolute;
    width: 25%;
    height: 25%;
    padding: 10px;
    box-sizing: border-box;
    z-index: 0;

    opacity: 1;
    animation: ${fadeIn} .25s;

    ${({position}) => css`
        left: ${25 * position[0]}%;
        top: ${25 * position[1]}%;
    `}

    transition: all .25s;
`;

const TileView = styled.div<TileProps>`
    width: 100%;
    height: 100%;
    font-size: 24pt;
    text-align: center;
    z-index: ${({$under}) => $under ? '1' : '2'};

    ${({exponent}) => css`
        background-color: ${ tileColors[Math.min(exponent - 1, tileColors.length - 1)].bg };
        color: ${ tileColors[Math.min(exponent - 1, tileColors.length - 1)].fg };
    `}
`;

export default function Tile(props: TileProps) {   
    return (
        <TileWrapper {...props}>
            <TileView {...props}>{2 ** props.exponent}</TileView>
        </TileWrapper>
    );
}