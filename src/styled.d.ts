// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        borderRadius: string,

        colors: {
            bg: string,
            primary: string,
            secondary: string,
            base: string,
            contrast: string,
            danger: string,
        };
    }
}