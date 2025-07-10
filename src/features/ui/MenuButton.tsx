import styled from "styled-components";
import { applyVariant, type Variant } from "./variants";

const MenuButton = styled.button<{ $variant?: Variant }>`
    display: block;
    padding: .5em;
    font-size: inherit;
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: transform .1s ease-out, background .1s, color .1s, opacity .1s;

    &:hover:not([disabled]) {
        transform: scale(1.1);
    }

    &[disabled] {
        opacity: .5;
    }

    ${applyVariant()}
`

export default MenuButton;