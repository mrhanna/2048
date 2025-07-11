import { HiSun, HiMoon } from "react-icons/hi2";
import MenuButton from "./MenuButton";
import { useAppDispatch, useAppState } from "../../app/AppContext";
import config from "../../app/config";
import { themeChanged } from "./uiActions";
import type { ComponentProps } from "react";

export default function DayNightThemeButton(props: ComponentProps<typeof MenuButton>) {
    const state = useAppState();
    const dispatch = useAppDispatch();

    const handleClick = () => {
        console.log(config.themes.default);
        console.log(config.themes.dark);
        console.log(state.ui.theme.name === 'dark'
            ? config.themes.default
            : config.themes.dark);
        dispatch(themeChanged(
            state.ui.theme.name === 'dark'
                ? config.themes.default
                : config.themes.dark
        ))
    }

    return (
        <MenuButton onClick={handleClick} $variant="outline" {...props}>
            {state.ui.theme.name === 'dark'
                ? <HiMoon />
                : <HiSun />
            }
        </MenuButton>
    )
}