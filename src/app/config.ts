import type { DefaultTheme } from "styled-components";

const config = {
    minGridSize: 3,
    maxGridSize: 6,
    defaultGridSize: 4,

    themes: {} as Record<string, DefaultTheme>
};

config.themes.default = {
    name: 'default',
    tileSpacing: '1.4%',
    borderRadius: '6px',
    colors: {
        bg: 'rgb(246, 243, 234)',
        primary: 'rgb(137, 120, 98)',
        secondary: 'rgb(229, 221, 212)',
        base: '#222',
        contrast: '#eee',
        danger: 'rgb(202, 1, 1)',
        modalBg: 'rgb(246, 243, 234)',
        gridBg: 'rgb(137, 120, 98)',
    }
}

config.themes.dark = {
    ...config.themes.default,
    name: 'dark',

    colors: {
        bg: 'rgb(15, 15, 15)',
        primary: 'rgb(199, 199, 199)',
        secondary: 'rgb(47, 47, 47)',
        base: '#eee',
        contrast: '#222',
        danger: 'rgb(202, 1, 1)',
        modalBg: 'rgb(30,30,30)',
        gridBg: 'rgb(47, 47, 47)',
    }
}

export default config;