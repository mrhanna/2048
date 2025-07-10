import { css } from 'styled-components';

const variants = {
    primary: css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.contrast};
    `,

    secondary: css`
        background-color: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.primary};
    `,

    outline: css`
        background: transparent;
        color: ${({ theme }) => theme.colors.primary};
        border: 2px solid ${({ theme }) => theme.colors.primary};
    `,
}

export type Variant = keyof typeof variants;

export default variants;