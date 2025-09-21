## Quick orientation for AI coding agents

This is a small React + Vite web app that performs client-side computer vision on uploaded images to detect common fridge items. The goal of this file is to give AI agents the precise, actionable context they need to make edits quickly and correctly.

Key facts
- Project type: React (JSX) + Vite (see `package.json` and `vite.config.js`).
- Dev commands: `npm run dev` (Vite), build with `npm run build`, preview with `npm run preview`, lint with `npm run lint` (ESLint configured in repo root).
- Entry points: `index.html` -> `src/main.jsx` -> `src/App.jsx` -> `src/RealImageAnalyzer.jsx`.

Big picture architecture and data flow
- Single-page client-side app. All analysis runs in the browser (no backend). The core analysis logic is in `src/RealImageAnalyzer.jsx`:
  - Image is uploaded via an `<input type="file" />` and loaded with `URL.createObjectURL` / `Image()` in `loadImageElement`.
  - Visual analysis runs in a hidden `<canvas>` (`canvasRef`) using `getImageData` in `analyzeImageVisually` which composes `analyzeColors`, `analyzeShapes`, and `analyzeBrightness`.
  - `matchFoodsFromVisualAnalysis` maps detected colors/shapes/brightness to entries in the local `foodDatabase` object defined in the same file.
  - Results are held in React state (`items`, `imageAnalysis`, `isAnalyzing`, `analysisStatus`, `error`) and rendered as cards; CSV export and reset are implemented in this component.

Project-specific conventions and patterns
- Single-file feature: the app places both UI and domain logic inside `src/RealImageAnalyzer.jsx`. When editing, preserve existing state variable names and side-effect ordering (setAnalysisStatus → setImageAnalysis → setItems) to avoid UI regressions.
- Deterministic randomness: small uses of `Math.random()` (e.g., estimated counts, quantity percentages). If you need testable behavior, replace with injectable RNG or stub via a helper function.
- Canvas size and sampling: `analyzeImageVisually` draws the image to a 300x300 canvas and samples pixels with a step (`step = 20`) for color buckets. Changes to these hard-coded constants affect performance and results—document and parameterize them if adjusting.
- UI/Styling: Tailwind classes are used directly in JSX (`index.css` imports Tailwind); prefer adding utility classes rather than global CSS edits for small visual changes.

Integration points & external dependencies
- No backend; everything runs client-side.
- Notable packages in `package.json`: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, and `lucide-react` for icons.
- Linting: ESLint is configured; run `npm run lint`. Fixes should follow the existing code style (JSX, semicolons as in the repo).

Editing guidance / safe refactors
- Small logic or UI fixes: edit `src/RealImageAnalyzer.jsx`. Keep exports default and avoid renaming `RealImageAnalyzer` unless updating imports in `App.jsx`.
- Split large changes: if extracting analysis helpers to a new module (e.g., `src/analysis/*`), update imports in `RealImageAnalyzer.jsx` and keep function signatures identical to preserve behavior.
- Performance-sensitive changes: profiling is manual. Use browser devtools; to test locally run `npm run dev` and open `http://localhost:5173` (default Vite port).

Testing and verification steps (manual)
1. Install deps: `npm install`.
2. Start dev server: `npm run dev` → open `http://localhost:5173`.
3. Upload a photo in the app UI. Verify: the hidden canvas is populated, `Visual Analysis Results` appears, and detected items/cards show up.
4. Run `npm run build` then `npm run preview` to verify production build behavior.

Notes for AI agents
- Prefer editing small, well-scoped functions and add comments describing intent for non-obvious heuristics (color buckets, shape thresholds, edge thresholds). Example: `analyzeShapes` uses grad > 30 and compares gx/gy difference to detect circular vs linear edges.
- Preserve user-visible strings and avoid changing UI copy without clear reason (e.g., headings in `RealImageAnalyzer.jsx`).
- When adding features that introduce async work, update `isAnalyzing` and `analysisStatus` to keep UI consistent.

Files to inspect first for most tasks
- `src/RealImageAnalyzer.jsx` — core logic and UI
- `src/App.jsx`, `src/main.jsx` — app wiring
- `package.json`, `vite.config.js` — scripts and build
- `index.html`, `src/index.css` — global entry and Tailwind setup

If you make non-trivial structural changes
- Add a short note at the top of this file summarizing the change and why (helps future agents).

If any part of this file seems incomplete or you need more detail (e.g., test cases or CI steps), ask the repo owner which behavior to preserve before changing heuristics or constants.

---
Please review and tell me if you'd like more detail about any helper, expected outputs, or to include example images used for manual verification.
