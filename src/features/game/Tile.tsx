import styled, { css } from 'styled-components';
import '../../style.css';

export interface UnpositionedTileProps {
    $id: string,
    exponent: number,
}

export interface TileProps extends UnpositionedTileProps {
    $position: [number, number], // [row, column]
    $exiting?: boolean,
    merged?: boolean,
    gridSize: number,
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

const TileWrapper = styled.div<{ $exiting?: boolean }>`
    position: absolute;
    padding: ${({ theme }) => theme.tileSpacing};
    container-type: size;
    box-sizing: border-box;
    z-index: ${({ $exiting }) => $exiting ? '1' : '2'};

    ${({ $exiting }) => css`
        transition: all .2s ${$exiting ? '' : 'cubic-bezier(.25,.1,.25,1.25)'};
    `}
`;

export const TileView = styled.div<{ exponent: number }>`
    position: relative;
    width: 100%;
    height: 100%;

    font-size: ${({ exponent }) => `${(14 * (1 / (0.5 * Math.max(`${2 ** exponent}`.length, 2) + 1))).toFixed(2)}vh`};
    font-size: ${({ exponent }) => `${(100 * (1 / (0.5 * Math.max(`${2 ** exponent}`.length, 2) + 1))).toFixed(2)}cqh`};

    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    -webkit-user-select: none; /* Safari */        
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */

    font-weight:bold;

    transition: color .3s, background-color .3s;

    border-radius: ${({ theme }) => theme.borderRadius};

    ${({ exponent }) => css`
        background-color: ${tileColors[Math.min(exponent - 1, tileColors.length - 1)].bg};
        color: ${tileColors[Math.min(exponent - 1, tileColors.length - 1)].fg};
    `}
`;

export default function Tile(props: TileProps) {
    const { gridSize } = props;

    const positionStyle = {
        width: `${100 / gridSize}%`,
        height: `${100 / gridSize}%`,
        left: `${100 * props.$position[1] / gridSize}%`,
        top: `${100 * props.$position[0] / gridSize}%`,
    }

    return (
        <TileWrapper style={positionStyle} className={'fade-in'} $exiting={props.$exiting}>
            <TileView className={!!props.merged ? 'merged' : undefined} exponent={props.exponent}>{2 ** props.exponent}</TileView>
        </TileWrapper>
    );
}