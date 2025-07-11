const transition = 'transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s'

export const themeTransition = `${transition};`

export const themeTransitionAnd = (additions: string) => `${transition}, ${additions};`