import { HiHeart } from "react-icons/hi2";
import { SiReact, SiTypescript, SiGithub } from "react-icons/si";
import { styled, type DefaultTheme } from "styled-components";

const BadgeLabel = styled.div`
    display: inline-block;
`

export default function AboutText({ theme }: { theme: DefaultTheme }) {
    return (
        <span style={{ fontFamily: `'Roboto Mono', monospace` }}>
            Made with <HiHeart style={{ color: 'red' }} /> in <BadgeLabel><SiReact style={{ color: '#61dbfb' }} /> React</BadgeLabel> and <BadgeLabel><SiTypescript style={{ color: '#3178c6' }} /> TypeScript</BadgeLabel> by <BadgeLabel><img src="https://mrhanna.dev/images/logo.svg" style={{ height: '1em', marginInline: '2px' }} /> Michael Hanna.</BadgeLabel> <a href="https://github.com/mrhanna/2048" target="_blank" style={{ textDecoration: 'none' }}>Check it out on <BadgeLabel><SiGithub style={{ color: theme.colors.base }} /> GitHub</BadgeLabel></a>
        </span>
    )
}