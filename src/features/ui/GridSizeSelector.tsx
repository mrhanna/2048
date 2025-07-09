import { useRef, useState } from "react";
import MenuButton from "./MenuButton";
import { useAppDispatch, useAppState } from "../../app/AppContext";
import styled from "styled-components";
import useClickOutside from "./hooks/useClickOutside";
import config from "../../app/config";
import { openModal } from "./uiActions";
import { newGame } from "../game/gameActions";
import ExitWrapper from "./ExitWrapper";
import { fadeIn, fadeOut, slideIn, slideOut } from "./animations";

const Wrapper = styled.div`
    position: relative;
`

const SliderContainer = styled.div`
    position: absolute;
    background-color: rgb(65, 52, 37);
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
    bottom: calc(100% + .5em);
    padding: .5em;
    right: 0;
    z-index: 100;
    animation: ${slideIn} .1s ease-out, ${fadeIn} .1s ease-out;
    transform-origin: bottom right;

    &.exiting {
        animation: ${slideOut} .1s ease-out, ${fadeOut} .1s ease-out;
        animation-fill-mode: forwards;
    }
`

const formatGridSize = (n: number) => `${n}\u00D7${n}`;

export default function GridSizeSelector() {
    const gridSize = useAppState().game.grid.length;

    const [isSliderDisplaying, setSliderDisplaying] = useState(false);
    const [localSliderValue, setLocalSliderValue] = useState(gridSize);

    const sliderContainerRef = useRef(null);
    useClickOutside(sliderContainerRef, () => { setSliderDisplaying(false) });

    const dispatch = useAppDispatch();

    const handleSetGridSize = () => {
        dispatch(openModal(
            {
                message: `All progress will be lost. Change the grid to ${formatGridSize(localSliderValue)} and start a new game?`,
                confirm: {
                    text: 'New Game',
                    action: newGame(localSliderValue),
                }
            }
        ));
    };

    return (
        <Wrapper ref={sliderContainerRef}>
            <MenuButton
                onClick={() => {
                    setSliderDisplaying(!isSliderDisplaying);
                    setLocalSliderValue(gridSize);
                }}
                className={isSliderDisplaying ? 'primary' : 'secondary'}
                aria-label="Open grid size selector"
            >{formatGridSize(gridSize)}</MenuButton>


            <ExitWrapper
                show={isSliderDisplaying}
                exitAnimationTimeMilliseconds={200}
                exitingClassName="exiting"
            >
                <SliderContainer>
                    <div>
                        <input
                            type="range"
                            value={localSliderValue}
                            min={config.minGridSize}
                            max={config.maxGridSize}
                            onChange={(e) => {
                                setLocalSliderValue(+e.target.value)
                            }}
                            list="sizes"
                            step={1}
                            aria-label="Grid size selector slider"
                        />
                        <datalist id="sizes">
                            {Array.from({ length: config.maxGridSize - config.minGridSize + 1 }, (_, i) => i + config.minGridSize)
                                .map((n) => <option key={n} value={n} />)}
                        </datalist>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#eee' }}>
                        <div>{formatGridSize(localSliderValue)}</div>
                        <MenuButton
                            disabled={localSliderValue === gridSize && true}
                            onClick={handleSetGridSize}
                            className="secondary"
                            style={{ borderColor: '#eee', color: '#eee', fontSize: '.8em' }}
                            aria-label="Confirm grid size setting"
                        >Set</MenuButton>
                    </div>
                </SliderContainer>
            </ExitWrapper>
        </Wrapper>
    )
}