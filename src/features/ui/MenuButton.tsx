import styled from "styled-components";

const MenuButton = styled.button`
    display: block;
    padding: .5em;
    font-size: inherit;
    border-radius: 10px;
    transition: transform .1s ease-out, background .1s, color .1s;

    &:hover {
        transform: scale(1.1);
    }

    &.primary {
        background-color: rgb(102, 82, 59);
        color: #eee;
        border: none;
    }

    &.secondary {
        background: none;
        border: 2px solid rgb(102, 82, 59);
        color: rgb(102, 82, 59);
    }
`

export default MenuButton;