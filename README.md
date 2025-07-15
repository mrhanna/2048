# mrhanna/2048

A clean, responsive re-creation of the classic [2048 puzzle game](https://en.wikipedia.org/wiki/2048_(video_game)) written with React+TypeScript+Vite. Grid sizes are user configurable from 3x3 to 6x6 (and developer-configurable to any size in config.ts!)

[<img alt="Deployed with web deploy" src="https://img.shields.io/badge/Deployed With-web deploy-%3CCOLOR%3E?style=for-the-badge&color=0077b6">](https://github.com/SamKirkland/web-deploy)

**Live Demo:** [**mrhanna.dev/2048**](https://mrhanna.dev/2048)

<p align="center">
  <img height="250" src="/.github/assets/webscreenshot.jpg" alt="Web Screenshot" />
  <img height="250" src="/.github/assets/mobilescreenshot.jpg" alt="Mobile Screenshot" />
</p>

---

## 🤔 Why? 

In 2014, I was obsessed with Gabriele Cirulli's original game like everyone else. Recalling the game again in 2025, I thought it might provide an excellent opportunity to practice animation and game state management in React, as well as to test myself on accessibility, config-driven design, and CI/CD. Every piece of the app, from modals to tile merging to input throttling, was built for polish, clarity, and performance.

---

## ✨ Features

- 🎯 **Smooth Gameplay** — Smooth tile animations, snappy input response, and subtle UI transitions  
- 📱 **Responsive Layout** — Adapts to mobile,and desktop layouts. Prompts mobile users to use portrait mode. 
- 🎨 **Customizable Grid and Themes** — Toggle board size and dark/light modes  
- 💾 **Persistent State** — Game state and high scores for each grid size persist via `localStorage`  
- ♿ **Accessibility-Aware** — ARIA roles, keyboard support, focus management, 'aria-live' game announcments  
- 🔒 **CI over SSH** — GitHub Actions deployment to remote server via SSH

---

## 📸 Demo

> Live demo: [**mrhanna.dev/2048**](https://mrhanna.dev/2048)

---

## 🧠 Architectural Notes
- **Game logic** is decoupled from rendering for testability and clarity.
  - Internally, the grid is represented as a 2D array of Slot objects, each of which contains the slotted tile and, as applicable, the other tile that was merged into the slot on the previous shift (preserved for animation rendering purposes and forgotten on the next shift).
- **Tile Lifecycle:** Each tile object carries a stable ID, allowing accurate keying for React rendering and safe remount animations. Tiles are never recreated unnecessarily; instead, their position, value, and merge status update predictably across state transitions.
- **Cross-Platform Input:** The app supports keyboard input (arrows, WASD) and was optimized for tap-based interactions on mobile. Landscape edge cases are handled gracefully with orientation cues and layout adjustments.
- **Input throttling** ensures no overlapping moves are processed during animations. Debouncing is handled via refs rather than state inside the useShiftHandlers hook, which avoids unnecessary renders and preserves input responsiveness.
  - A 150 ms debounce interval (slightly shorter than the 200 ms animation) creates a snappy, responsive feel without sacrificing visual clarity.
  - Preflight grid calculation allows the app to detect invalid inputs (e.g. trying to move up when no tiles can move up) before debounce is triggered, such that users aren't artificially delayed when switching directions.
- **State** is managed with the useReducer hook. (Next time I will reach for RTK 👀)
- **Modals** are managed by storing serializable ModalIntent objects in UI state. ModalIntents are registered in [`modalRegistry.ts`](src/features/ui/modal/modalRegistry.ts) and map keys (with optional parameters) to renderable modals.
- **Animations** are handled with pure CSS-in-JS, using styled-components. Exit animations are implemented through a custom ExitWrapper component.
- **Accessibility** includes:
  - Full keyboard gameplay
  - Focus traps on modals
  - ARIA roles on interactive elements
  - A screen-reader-only table representation of the game grid
  - `aria-live` region for announcing game events
- **Configuration** puts theme colors, min/max grid sizes, and some other styling options in config.ts. You can play mega grid sizes by changing one line of configuration! (Although IMO, 6x6 is already too big to be fun.)
- **Responsive** design is mobile-first, with specific handling for landscape constraints.
- **CI/CD:** Deployed via GitHub Actions through SSH using [SamKirkland/web-deploy](https://github.com/SamKirkland/web-deploy). Pushes to the release branch trigger a remote build/deploy script that places a static bundle onto my portfolio shared hosting account.

---

<p align="center">
  <img src="/.github/assets/megascreenshot.jpg" alt="20 by 20 grid screenshot">
  <br>
  Something silly
</p>

---

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

