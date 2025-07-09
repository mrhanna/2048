import { keyframes } from "styled-components";

const slideIn = keyframes`
    from {
        transform: translateY(30%) scale(50%);
    }

    to {
        transform: none;
    }
`

const slideOut = keyframes`
    from {
        transform: none;
    }

    to {
        transform: translateY(30%) scale(50%);
    }    
`

const fadeIn = keyframes`
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
`

const fadeOut = keyframes`
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
`
export { slideIn, slideOut, fadeIn, fadeOut };