import { HiSun, HiMoon } from "react-icons/hi2";
import MenuButton from "./MenuButton";
import { useAppDispatch, useAppState } from "../../app/AppContext";
import config from "../../app/config";
import { themeChanged } from "./uiActions";
import { useEffect, useRef, type ComponentProps } from "react";
import styled, { css, keyframes } from "styled-components";

const iconEntrance = keyframes`
    from {
        transform: rotate(90deg);
        opacity: 0;
    }

    50% {
        opacity: 0;
    }

    to {
        transform: rotate(0);
        opacity: 1;
    }
`;

const iconExit = keyframes`
    from {
        transform: rotate(0);
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    to {
        transform: rotate(-90deg);
        opacity: 0;
    }
`;

const iconCss = css`
    transform-origin: 0 300%;
    grid-row: 1;
    grid-column: 1;

    &:not(.show) {
        animation: ${iconExit} .6s ease-in;
        opacity: 0;
    }

    &.show {
        animation: ${iconEntrance} .6s ease-out;
    }

    &.no-animate {
        animation: none !important;
    }
`

const Sun = styled(HiSun)`
    ${iconCss}
`;

const Moon = styled(HiMoon)`
    ${iconCss}
`;

const DayNightStyledButton = styled(MenuButton)`
    overflow: hidden;
    display: grid;
    place-items: center;
`

export default function DayNightThemeButton(props: ComponentProps<typeof MenuButton>) {
    const state = useAppState();
    const dispatch = useAppDispatch();

    const noAnimate = useRef(true);

    useEffect(() => {
        noAnimate.current = false;
    }, [])

    const themeName = state.ui.theme.name;

    const handleClick = () => {
        console.log(config.themes.default);
        console.log(config.themes.dark);
        console.log(themeName === 'dark'
            ? config.themes.default
            : config.themes.dark);
        dispatch(themeChanged(
            themeName === 'dark'
                ? config.themes.default
                : config.themes.dark
        ))
    }

    return (
        <DayNightStyledButton
            onClick={handleClick}
            $variant="outline"
            aria-label="night mode toggle"
            aria-pressed={themeName === 'dark'}
            {...props}>
            <Sun className={`${themeName !== 'dark' ? 'show' : ''} ${noAnimate.current ? 'no-animate' : ''}`} />
            <Moon className={`${themeName === 'dark' ? 'show' : ''} ${noAnimate.current ? 'no-animate' : ''}`} />
        </DayNightStyledButton>
    )
}