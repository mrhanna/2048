import { css } from 'styled-components';

const variants = {
    primary: css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: ${({ theme }) => theme.colors.contrast};
        border: none;
    `,

    secondary: css`
        background-color: ${({ theme }) => theme.colors.secondary};
        color: ${({ theme }) => theme.colors.primary};
        border: none;
    `,

    outline: css`
        background: transparent;
        color: ${({ theme }) => theme.colors.primary};
        border: 3px solid ${({ theme }) => theme.colors.secondary};
    `,

    danger: css`
        background-color: ${({ theme }) => theme.colors.danger};
        color: ${({ theme }) => theme.colors.contrast};
        border: none;
    `
}

export function applyVariant() {
    return ({ $variant }: { $variant?: Variant }) => $variant && variants[$variant];
}

export type Variant = keyof typeof variants;

export default variants;