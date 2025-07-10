import type { DefaultTheme } from "styled-components";

const config = {
    minGridSize: 3,
    maxGridSize: 6,
    defaultGridSize: 4,

    themes: {} as Record<string, DefaultTheme>
};

config.themes.default = {
    borderRadius: '10px',
    colors: {
        bg: 'rgb(246, 243, 234)',
        primary: 'rgb(137, 120, 98)',
        secondary: 'rgb(229, 221, 212)',
        base: '#222',
        contrast: '#eee',
    }
}

Object.freeze(config);

export default config;