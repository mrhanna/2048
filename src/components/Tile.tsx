import { useEffect } from 'react';
import styled, {css} from 'styled-components';
import '../style.css';

export interface UnpositionedTileProps {
    $id: string,
    exponent: number,
}

export interface TileProps extends UnpositionedTileProps {
    $position: [number, number], // [row, column]
    $exiting?: boolean,
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

const TileWrapper = styled.div<TileProps>`
    position: absolute;
    width: 25%;
    height: 25%;
    padding: 10px;
    box-sizing: border-box;

    ${({$position}) => css`
        left: ${25 * $position[1]}%;
        top: ${25 * $position[0]}%;
    `}

    transition: all .25s;
`;

const TileView = styled.div<TileProps>`
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 32pt;
    text-align: center;
    z-index: ${({$exiting}) => $exiting ? '1' : '2'};
    display: flex;
    justify-content: center;
    align-items: center;

    transition: color .25s, background-color .25s;

    ${({exponent, $exiting}) => css`
        background-color: ${ tileColors[Math.min(exponent - 1 + ($exiting ? 1 : 0), tileColors.length - 1)].bg };
        color: ${ tileColors[Math.min(exponent - 1 + ($exiting ? 1 : 0), tileColors.length - 1)].fg };
    `}
`;

export default function Tile(props: TileProps) {   
    useEffect(() => {
        console.log(`${props.$id} mounted`);
    }, []);

    return (
        <TileWrapper className={'fade-in'} {...props}>
            <TileView {...props}>{2 ** props.exponent}</TileView>
        </TileWrapper>
    );
}