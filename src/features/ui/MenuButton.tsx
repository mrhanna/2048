import styled from "styled-components";

const MenuButton = styled.button`
    display: block;
    padding: .5em;
    font-size: inherit;
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: transform .1s ease-out, background .1s, color .1s;

    &:hover {
        transform: scale(1.1);
    }

    &.primary {
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.contrast};
        border: none;
    }

    &.secondary {
        background: none;
        border: 2px solid ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.primary};
    }
`

export default MenuButton;