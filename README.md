# 🚀 React, Next.js & Fullstack Interview Preparation Guide

An intensive, comprehensive interview revision repository containing **13 runnable interactive modules**, architecture deep-dives, cheat sheets, and checklists covering over 100 core topics.

---

## 📚 Quick Navigation to Interview Guides

All documentation and checklists are located in the [`docs/`](docs/) directory:

1. **[Quick Interview Checklist (65 Core Q&As)](docs/Quick-Interview-Checklist-React.md)** — *The 10-minute cheat sheet right before your interview!*
2. **[React 18 & 19: New Additions, Deprecations & Replacements](docs/React-Latest-Features-And-Deprecations.md)** — *What replaced what in modern React.*
3. **[Fullstack Master Guide: HTML/CSS, Next.js, Node.js & Nest.js](docs/Fullstack-Interview-Questions.md)** — *End-to-end fullstack interview questions.*
4. **[Complete 103-Topic Syllabus Checklist](docs/React-Topics.md)**
5. **[Modular 3-Hour Revision Plan](docs/React-Study-Plan.md)**

---

## 📂 The 13 Interactive Modules

Run the project locally to test each module interactively:

```bash
npm install
npm run dev
```

| Module | Core Topics | Code File | Documentation |
| :--- | :--- | :--- | :--- |
| **Mod 1** | StrictMode, Components, JSX Rules, Purity | [`Module01Foundations.jsx`](src/modules/Module01Foundations.jsx) | [Module 01 Guide](docs/Module-01-Foundations.md) |
| **Mod 2** | Props Immutability, Composition, Slot Pattern | [`Module02PropsAndComposition.jsx`](src/modules/Module02PropsAndComposition.jsx) | [Module 02 Guide](docs/Module-02-Props-And-Composition.md) |
| **Mod 3** | useState, Events, Batching, Derived State | [`Module03StateAndEvents.jsx`](src/modules/Module03StateAndEvents.jsx) | [Module 03 Guide](docs/Module-03-State-And-Events.md) |
| **Mod 4** | Controlled Inputs, State Lifting, Accordion | [`Module04FormsAndStateLifting.jsx`](src/modules/Module04FormsAndStateLifting.jsx) | [Module 04 Guide](docs/Module-04-Forms-And-State-Lifting.md) |
| **Mod 5** | Render vs Commit, Key Prop, State Resets | [`Module05ReactInternalsAndKeys.jsx`](src/modules/Module05ReactInternalsAndKeys.jsx) | [Module 05 Guide](docs/Module-05-React-Internals-And-Keys.md) |
| **Mod 6** | useEffect Cleanup, Async Effects, Hook Rules | [`Module06EffectsAndAsyncFlow.jsx`](src/modules/Module06EffectsAndAsyncFlow.jsx) | [Module 06 Guide](docs/Module-06-Effects-And-Async-Flow.md) |
| **Mod 7** | DOM Refs, Mutable Values with `useRef` | [`Module07DOMAndRefs.jsx`](src/modules/Module07DOMAndRefs.jsx) | [Module 07 Guide](docs/Module-07-DOM-And-Refs.md) |
| **Mod 8** | Custom Hooks, `useReducer` State Machines | [`Module08ComplexStateAndCustomHooks.jsx`](src/modules/Module08ComplexStateAndCustomHooks.jsx) | [Module 08 Guide](docs/Module-08-Complex-State-And-Custom-Hooks.md) |
| **Mod 9** | Context API + useReducer vs Redux Toolkit | [`Module09GlobalState.jsx`](src/modules/Module09GlobalState.jsx) | [Module 09 Guide](docs/Module-09-Global-State-Context-And-Redux.md) |
| **Mod 10** | React Router 6.4+, Nested Routes, URL State | [`Module10ClientRouting.jsx`](src/modules/Module10ClientRouting.jsx) | [Module 10 Guide](docs/Module-10-Client-Side-Routing.md) |
| **Mod 11** | `React.memo`, `useMemo`, `useCallback`, Closures | [`Module11PerformanceAndClosures.jsx`](src/modules/Module11PerformanceAndClosures.jsx) | [Module 11 Guide](docs/Module-11-Performance-And-Closures.md) |
| **Mod 12** | Portals, Compound Components, React Query | [`Module12AdvancedPatterns.jsx`](src/modules/Module12AdvancedPatterns.jsx) | [Module 12 Guide](docs/Module-12-Advanced-Patterns-And-Ecosystem.md) |
| **Mod 13** | Next.js RSC vs SSR, Actions, `useOptimistic` | [`Module13NextAndModernFullStack.jsx`](src/modules/Module13NextAndModernFullStack.jsx) | [Module 13 Guide](docs/Module-13-Nextjs-And-Modern-Fullstack.md) |

---

## 🛠️ Tech Stack
- **Framework**: React 19 + Vite
- **Styling**: Scoped CSS Modules
- **Routing**: React Router 7 (`react-router-dom`)
- **State**: `useState`, `useReducer`, Context API, Redux Toolkit architecture
- **Actions & Transitions**: React 19 `useTransition`, `useOptimistic`
