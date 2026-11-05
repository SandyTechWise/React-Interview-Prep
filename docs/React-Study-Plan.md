# 3-Hour React & Next.js Interview Crash Course Plan

> **Goal**: Revise all 103 interview topics from `React-Topics.md` in 3 hours through **13 cohesive, practical modules**.  
> **Approach**: Instead of jumping randomly across 100+ isolated theory questions, we group related topics together into **single, minimal, runnable examples** in `test/src/` with clear rules, junior traps, and interview questions.

---

## ⏱️ 3-Hour Time Allocation Strategy

| Module | Focus Areas | Topics Covered | Target Time |
| :--- | :--- | :--- | :--- |
| **Module 1** | Foundations & JSX | 1, 2, 3, 4, 7, 9, 10, 28 | 15 mins |
| **Module 2** | Props & Component Architecture | 5, 6, 19, 21, 22, 23, 24 | 15 mins |
| **Module 3** | State & Events Core | 11, 12, 15, 17, 18, 29 | 15 mins |
| **Module 4** | Forms & State Lifting | 14, 16, 20 | 10 mins |
| **Module 5** | React Internals, Keys & Rendering | 8, 13, 25, 26, 27, 30 | 15 mins |
| **Module 6** | Effects, Lifecycles & Async Flow | 31, 32, 33, 34, 35, 40 | 20 mins |
| **Module 7** | DOM Access & Mutable Refs | 36, 37 | 10 mins |
| **Module 8** | Complex State & Custom Hooks | 38, 39, 41 | 15 mins |
| **Module 9** | Global State: Context API & Redux | 48, 49, 51, 58–67 | 20 mins |
| **Module 10** | Client Routing (React Router) | 42, 43, 44, 45, 46, 47, 52, 68 | 15 mins |
| **Module 11** | Performance & Optimization Hooks | 53, 54, 55, 56, 57 | 15 mins |
| **Module 12** | Advanced Patterns & Ecosystem | 50, 69, 70, 71, 72, 73, 74, 75, 76, 77 | 15 mins |
| **Module 13** | Next.js & Modern Full-Stack React | 78–103 (All Next.js topics) | 20 mins |
| **Buffer** | Quick Fire Q&A & Interview Warm-up | High-frequency questions & wrap-up | 10 mins |

---

## 📂 Code Organization in This Project

All examples will live directly inside `test/src/`:
- `test/src/App.jsx` will be our switcher to test each module interactively.
- Code will contain concise inline comments highlighting:
  - `// 💡 INTERVIEW RULE:` Hard rules interviewers test.
  - `// ❌ JUNIOR MISTAKE:` Common mistakes junior devs make.
  - `// ✅ SENIOR PATTERN:` The clean, recommended industry solution.

---

## 📚 Detailed Module Breakdown & Teaching Plan

### Module 1: Core Mental Model, JSX & Component Purity
* **Topics Covered**:
  - `1. React Strict Mode`
  - `2. React Components`
  - `3. JSX`
  - `4. Styling React apps`
  - `7. JSX rules`
  - `9. React Destructuring`
  - `10. React fragments`
  - `28. Pure components`
* **Why Grouped**: These form the core building blocks of how React translates code into UI.
* **Unified Example**: A `UserProfile` component demonstrating:
  - Why StrictMode renders twice in dev (to detect impure side-effects).
  - JSX rules (single root, `className`, closing all tags, camelCase attributes).
  - React Fragments (`<></>` vs `<Fragment key={id}>`).
  - Pure functions (components must return the same JSX given the same props/state, zero side-effects in the render body).
* **Common Junior Mistake**: Calling an API or mutating external variables directly inside the component body.

---

### Module 2: Props, Data Flow & Component Architecture
* **Topics Covered**:
  - `5. React Props`
  - `6. Props immutability & One way data flow`
  - `19. Children props`
  - `21. Prop drilling`
  - `22. Component composition`
  - `23. Passing elements as props`
  - `24. Props as component API`
* **Why Grouped**: Props govern how data travels downward in a component hierarchy and how reusable component APIs are designed.
* **Unified Example**: A `Card` & `Modal` container using `children`, slot props (`icon={<StarIcon />}`), and showing how composition solves prop drilling without needing Context immediately.
* **React Rule**: Props are strictly **read-only** (immutable). Never do `props.title = 'New'`.

---

### Module 3: State & Events Core
* **Topics Covered**:
  - `11. Events (SyntheticEvent)`
  - `12. useState - setState`
  - `15. State vs Props`
  - `17. Immutable Data`
  - `18. Derived State`
  - `29. State update batching`
* **Why Grouped**: State represents memory; events trigger state changes.
* **Unified Example**: A `CartCounter` / `TodoList`:
  - Updating state immutably: `setItems([...items, newItem])` or `setItems(items.map(...))`.
  - Functional updates: `setCount(prev => prev + 1)` vs `setCount(count + 1)`.
  - React 18 automatic batching: Multiple `setState` calls batched into one render.
  - Derived State: Calculating `totalItems = items.length` dynamically instead of storing `const [total, setTotal] = useState(0)`.
* **Junior Mistake**: Duplicating state (storing values that can be derived).

---

### Module 4: Forms, Controlled Inputs & State Lifting
* **Topics Covered**:
  - `14. Controlled element`
  - `16. Lifting State up`
  - `20. Accordion component`
* **Why Grouped**: Real-world apps require synchronizing inputs with state and sharing state among sibling components.
* **Unified Example**: An `Accordion` component where opening one section collapses another:
  - Controlled inputs: `value={text}` with `onChange={(e) => setText(e.target.value)}`.
  - Lifting `openIndex` state up to the parent Accordion container.

---

### Module 5: React Internals, Keys & Rendering Lifecycle
* **Topics Covered**:
  - `8. Rendering in React (Render vs Commit phase)`
  - `13. React Developer Tools`
  - `25. Instances and Elements`
  - `26. The key prop`
  - `27. Reset state with key Props`
  - `30. Components lifecycle`
* **Why Grouped**: Deep understanding of how React diffs the Virtual DOM and decides what to re-render.
* **Unified Example**: Dynamic list with identity switcher:
  - Why array indices as keys break inputs upon reordering/deletion.
  - Using `key={userId}` on a component to completely unmount and reset its local state.
  - Explaining the **Render Phase** (pure, can be paused/aborted) vs **Commit Phase** (writing to the actual DOM).

---

### Module 6: Effects, Lifecycles & Async Flow
* **Topics Covered**:
  - `31. useEffect & cleanup function`
  - `32. Async function inside useEffect`
  - `33. Handling errors in React`
  - `34. React hooks and their rules`
  - `35. Initialize state with a callback (lazy initial state)`
  - `40. Fake API`
* **Why Grouped**: Side effects, API synchronization, cleanup routines, and hook rules.
* **Unified Example**: A `UserListFetcher` with:
  - Cleanup with `AbortController` (prevents race conditions & memory leaks).
  - Rules of Hooks: Top-level only, never inside conditions or loops.
  - Lazy state initialization: `useState(() => expensiveCalculation())`.
  - Error and loading state patterns.

---

### Module 7: Refs & Escape Hatches
* **Topics Covered**:
  - `36. Refs to select DOM elements`
  - `37. useRef`
* **Why Grouped**: `useRef` handles non-rendering mutable state and direct DOM access.
* **Unified Example**:
  - Auto-focusing an input on mount (`inputRef.current.focus()`).
  - Storing a mutable timer ID or previous state value without triggering re-renders.
* **Rule**: Do not read or write `ref.current` during rendering!

---

### Module 8: Complex Local State & Custom Hooks
* **Topics Covered**:
  - `38. Custom Hooks`
  - `39. useReducer`
  - `41. useState and useReducer`
* **Why Grouped**: When local state gets complex with multiple related transitions.
* **Unified Example**:
  - Refactoring a multi-field form or shopping cart from `useState` to `useReducer`.
  - Extracting logic into a reusable `useFetch` or `useLocalStorage` Custom Hook.

---

### Module 9: Global State Management (Context API to Redux)
* **Topics Covered**:
  - `48. Context API (createContext, Provider, useContext)`
  - `49. Custom provider and Hooks`
  - `51. Context and useReducer`
  - `58. Redux Core`
  - `59. Reducer`
  - `60. Redux Store`
  - `61. Action Creators`
  - `62. State Slices`
  - `63. Dispatch Actions`
  - `64. Redux Middleware and Thunks`
  - `65. API Calls with Redux`
  - `66. Redux Toolkit (RTK)`
  - `67. Redux vs Context API`
* **Why Grouped**: Sharing state application-wide and comparing lightweight vs industrial state solutions.
* **Unified Example**:
  - A clean `AuthContext` pattern (`createContext` + Custom `useAuth()` hook).
  - Side-by-side comparison with Redux Toolkit (`createSlice`, `configureStore`, `createAsyncThunk`).
  - Interview Question: *When do you use Context API vs Redux Toolkit?*

---

### Module 10: Routing & Navigation (React Router 6.4+)
* **Topics Covered**:
  - `42. Routing`
  - `43. Link and NavLink`
  - `44. Nested Route and index route`
  - `45. Storing state in the URL`
  - `46. Dynamic Routes & URL parameters`
  - `47. useNavigate, Programmatic navigation`
  - `52. Protected Route`
  - `68. React Router Actions & Loaders`
* **Why Grouped**: Modern SPAs need URL-driven state, route protection, and nested routing layouts.
* **Unified Example**:
  - Nested layout with `<Outlet />`.
  - Reading route params with `useParams()` and search filters with `useSearchParams()`.
  - Creating a `<ProtectedRoute>` wrapper that redirects unauthenticated users.

---

### Module 11: Performance Optimization & Clean Code
* **Topics Covered**:
  - `53. Performance Optimization`
  - `54. React.memo`
  - `55. useMemo and useCallback`
  - `56. Helper Functions`
  - `57. Closures & Stale Closure Traps`
* **Why Grouped**: Preventing wasteful re-renders and understanding JavaScript closures inside React.
* **Unified Example**:
  - Profiling unnecessary renders with React DevTools.
  - When to use `React.memo` + `useCallback` for stable function references.
  - When `useMemo` is overkill vs when it is genuinely needed.
  - Demonstrating a stale closure in a `setInterval` counter and fixing it with functional updates.

---

### Module 12: Advanced Patterns & Ecosystem Tools
* **Topics Covered**:
  - `50. Leaflet / 3rd Party Map integration`
  - `69. Styled Components`
  - `70. Styled Component Props & CSS function`
  - `71. Supabase`
  - `72. React Query (TanStack Query)`
  - `73. Render Props Pattern`
  - `74. Higher Order Components (HOC)`
  - `75. Compound Components`
  - `76. React Portal`
  - `77. Advanced Patterns Summary`
* **Why Grouped**: Advanced component architecture and modern standard libraries.
* **Unified Example**:
  - Building a `<Modal />` with `ReactDOM.createPortal`.
  - Compound Component pattern (e.g., `<Toggle><Toggle.On>...</Toggle.On></Toggle>`).
  - React Query vs useEffect for server caching, deduping, and background refetching.

---

### Module 13: Next.js & Modern Full-Stack React
* **Topics Covered**:
  - `78. Server Side Rendering (SSR)`
  - `79. Hydration & Mismatches`
  - `80. React Server Components (RSC)`
  - `81. RSC vs SSR`
  - `82. Metadata & Dynamic Metadata (82 & 90)`
  - `83. Navigation (<Link>, useRouter)`
  - `84. Next.js Image Optimization`
  - `85. Nested Routes & Layouts in App Router (85 & 88)`
  - `86. React Suspense & Streaming`
  - `87. Static vs Dynamic Rendering`
  - `88. generateStaticParams`
  - `89. Static Site Generation (SSG)`
  - `90. Next.js Data Cache`
  - `91. Caching and ISR`
  - `92. Sharing state via URL between client and server`
  - `93. Server components in client components`
  - `94. Context API in Next.js`
  - `95. API Endpoints with Route Handlers`
  - `96. NextAuth / Auth.js`
  - `97. Middleware`
  - `98. Protect route with NextAuth Middleware`
  - `99. Server Actions & Mutations`
  - `100. Manual Cache Revalidation (revalidatePath, revalidateTag)`
  - `101. useFormStatus Hook`
  - `102. useTransition Hook`
  - `103. useOptimistic Hook`
* **Why Grouped**: Next.js App Router paradigm shifting from purely client-side React to client/server hybrid.
* **Key Interview Concepts**:
  - RSC vs SSR: Server components render *only* on the server and send zero JS bundle to the browser; SSR generates initial HTML from client components.
  - The `'use client'` directive: marks the boundary, not a purely client-only file.
  - Hydration error causes (e.g., `typeof window !== 'undefined'` or `Date.now()` rendered directly).
  - Server Actions and modern React 19 hooks (`useTransition`, `useOptimistic`, `useFormStatus`).

---

## 🎯 Next Step: Let's Begin!
We will take **one module at a time**. In each module:
1. I will write the clean, minimal example into our project.
2. I will highlight the **Interview Questions**, **React Rules**, and **Junior Traps**.
3. You review, ask any doubts, and we advance!

Ready to begin with **Module 1: Core Mental Model, JSX & Component Purity**? Let me know and we fire away!

