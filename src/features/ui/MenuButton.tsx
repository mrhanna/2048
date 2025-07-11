import styled from "styled-components";
import { applyVariant, type Variant } from "./variants";
import { themeTransitionAnd } from "./themeTransition";

const MenuButton = styled.button<{ $variant?: Variant }>`
    display: block;
    padding: .5em;
    font-size: inherit;
    border-radius: ${({ theme }) => theme.borderRadius};
    ${themeTransitionAnd('transform .1s ease-out, opacity .1s')}

    &:hover:not([disabled]) {
        transform: scale(1.1);
    }

    &[disabled] {
        opacity: .5;
    }

    ${applyVariant()}
`

export default MenuButton;