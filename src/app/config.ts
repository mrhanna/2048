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
        bg: 'rgb(247, 241, 227)',
        primary: 'rgb(102, 82, 59)',
        secondary: 'rgb(178, 173, 161)',
        base: '#222',
        contrast: '#eee',
    }
}

Object.freeze(config);

export default config;