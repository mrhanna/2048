import styled, {css} from 'styled-components';
import '../../style.css';

export interface UnpositionedTileProps {
    $id: string,
    exponent: number,
}

export interface TileProps extends UnpositionedTileProps {
    $position: [number, number], // [row, column]
    $exiting?: boolean,
    merged?: boolean,
}

interface TileColor {
    bg: string,
    fg: string,
}

const tileColors: TileColor[] = [
    { bg: '#eee4da', fg: '#222' },
    { bg: '#ede0c8', fg: '#222' },
    { bg: '#f2b179', fg: '#fff' },
    { bg: '#f59563', fg: '#fff' },
    { bg: '#f67c5f', fg: '#fff' },
    { bg: '#f65e3b', fg: '#fff' },
    { bg: '#edcf72', fg: '#fff' },
    { bg: '#edcc61', fg: '#fff' },
    { bg: '#edc850', fg: '#fff' },
    { bg: '#edc53f', fg: '#fff' },
    { bg: '#edc22e', fg: '#fff' },
    { bg: '#3c3a32', fg: '#fff' },
]

const TileWrapper = styled.div<TileProps>`
    position: absolute;
    width: 25%;
    height: 25%;
    padding: 2%;
    container-type: size;
    box-sizing: border-box;
    z-index: ${({$exiting}) => $exiting ? '1' : '2'};

    ${({$position, $exiting}) => css`
        left: ${25 * $position[1]}%;
        top: ${25 * $position[0]}%;
        transition: all .2s ${ $exiting ? '' : 'cubic-bezier(.25,.1,.25,1.25)'};
    `}
`;

export const TileView = styled.div<{exponent: number}>`
    position: relative;
    width: 100%;
    height: 100%;

    font-size: ${({exponent}) => `${(14 * (1 / (0.5 * Math.max(`${2 ** exponent}`.length, 2) + 1))).toFixed(2)}vh`};
    font-size: ${({exponent}) => `${(100 * (1 / (0.5 * Math.max(`${2 ** exponent}`.length, 2) + 1))).toFixed(2)}cqh`};

    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight:bold;

    transition: color .3s, background-color .3s;

    border-radius: 10px;

    ${({exponent}) => css`
        background-color: ${ tileColors[Math.min(exponent - 1, tileColors.length - 1)].bg };
        color: ${ tileColors[Math.min(exponent - 1, tileColors.length - 1)].fg };
    `}
`;

export default function Tile(props: TileProps) {   
    return (
        <TileWrapper className={'fade-in'} {...props}>
            <TileView className={!!props.merged ? 'merged' : ''} exponent={props.exponent}>{2 ** props.exponent}</TileView>
        </TileWrapper>
    );
}