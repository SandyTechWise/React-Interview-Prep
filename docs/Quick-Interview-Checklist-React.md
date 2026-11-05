# Quick Interview Checklist - React & Next.js

> **The Ultimate Last-Minute Revision Sheet**: 65 high-frequency questions and concise, senior-level answers across all 13 modules. Perfect for a 10-minute read before your interview!

---

## [Module 01: Core Foundations, JSX & Component Purity](Module-01-Foundations.md)

1. **Why does StrictMode render twice in development?**  
   $\rightarrow$ To detect impure functions (mutations during render) and verify that effect cleanup routines properly tear down subscriptions/listeners. It has zero effect in production builds.

2. **What does JSX actually compile to under the hood?**  
   $\rightarrow$ Plain JavaScript objects (Virtual DOM nodes) produced by `React.createElement(type, props, ...children)` (or modern JSX runtime `jsx()`).

3. **Why do component names need to start with a capital letter (PascalCase)?**  
   $\rightarrow$ JSX treats lowercase names (`<card />`) as built-in native HTML string tags. PascalCase (`<Card />`) tells JSX to compile it as a reference to a JavaScript component function.

4. **When do you use `<React.Fragment>` instead of the shorthand `<>`?**  
   $\rightarrow$ The shorthand `<>` cannot accept any attributes. When mapping over an array in a loop, you must use `<React.Fragment key={item.id}>` to pass the required `key`.

5. **What is a pure component / component purity?**  
   $\rightarrow$ A component that, given the same props and state, always returns the exact same JSX output with zero side-effects during render (no mutations, no API calls, no timers).

---

## [Module 02: Props, Data Flow & Component Architecture](Module-02-Props-And-Composition.md)

6. **Can a child component modify its own props?**  
   $\rightarrow$ **No.** Props are strictly read-only and immutable. If data must change, the child calls a callback function passed down from the parent.

7. **What is unidirectional (one-way) data flow?**  
   $\rightarrow$ Data flows strictly downward from parent to child via props. User interactions trigger callbacks that flow events upward to update parent state.

8. **What is the first and best tool to fix prop drilling before reaching for Context or Redux?**  
   $\rightarrow$ **Component Composition** (passing leaf components directly via `children` or slot props).

9. **What is the `children` prop?**  
   $\rightarrow$ A special reserved prop representing whatever JSX elements are nested between a component's opening and closing tags, ideal for generic containers (Cards, Modals, Layouts).

10. **Why pass JSX elements as props (Slots Pattern)?**  
    $\rightarrow$ It creates flexible component APIs (e.g. `icon={<StarIcon />} actionSlot={<Button />}`) without tightly coupling container logic to specific child implementations.

---

## [Module 03: State, Events & Immutability](Module-03-State-And-Events.md)

11. **Why is `setState` asynchronous in snapshots?**  
    $\rightarrow$ React does not immediately update the variable in the running function; it schedules a state transition and batches updates to optimize rendering performance.

12. **When must you use the functional updater form: `setCount(prev => prev + 1)`?**  
    $\rightarrow$ Whenever the next state depends directly on the previous state value, preventing stale snapshot bugs when multiple updates occur in the same frame.

13. **Why shouldn't you use `array.push()` or `array.splice()` on React state?**  
    $\rightarrow$ They mutate the existing array in memory. React compares states by reference (`Object.is`). If the reference doesn't change, React skips the re-render. Always use `[...prev]` or `.filter()` / `.map()`.

14. **What is derived state and why is it preferred over an extra `useState`?**  
    $\rightarrow$ Any value that can be computed synchronously on the fly during render (e.g. `totalCount = items.length`). It prevents redundant state synchronization bugs and saves extra re-renders.

15. **What changed with state update batching in React 18?**  
    $\rightarrow$ **Automatic Batching** now batches state updates everywhere by default—including inside `Promises`, `setTimeout`, native event handlers, and `fetch` callbacks.

---

## [Module 04: Forms, Controlled Inputs & State Lifting](Module-04-Forms-And-State-Lifting.md)

16. **What makes an input element "controlled"?**  
    $\rightarrow$ Binding its `value` prop to React state and synchronizing input changes via `onChange`. React state is the single source of truth.

17. **Why does React warn "A component is changing an uncontrolled input to be controlled"?**  
    $\rightarrow$ You initialized state with `undefined` (`useState()`). The input starts uncontrolled; when state becomes a string, React detects a mode change. Always initialize text inputs with an empty string `useState('')`.

18. **Why can't `<input type="file" />` ever be a controlled component?**  
    $\rightarrow$ Browser security prevents setting file input values programmatically. It is read-only and must always be accessed as an uncontrolled input via `useRef` or `e.target.files`.

19. **How do sibling components share state in standard React?**  
    $\rightarrow$ By **Lifting State Up** to their nearest common ancestor and passing values down via props and updater handlers via callbacks.

20. **How do you build a single-open Accordion component?**  
    $\rightarrow$ Lift the active item ID state up to the parent accordion container so it coordinates which single item is expanded, collapsing others automatically.

---

## [Module 05: React Internals, Keys & Lifecycle](Module-05-React-Internals-And-Keys.md)

21. **What is the difference between the Render phase and the Commit phase?**  
    $\rightarrow$ The **Render phase** calculates the Virtual DOM and diffs it (pure, can be paused/restarted). The **Commit phase** is synchronous and writes the changes to the real DOM.

22. **What goes wrong when you use an array index as a `key` for dynamic lists?**  
    $\rightarrow$ If you prepend, reorder, or delete items, indices shift. React misidentifies item identities, causing local input state and focus to attach to the wrong element.

23. **How do you cleanly reset an entire form's local state when switching records?**  
    $\rightarrow$ Change the `key` on the component (`<UserEditor key={user.id} />`). React unmounts the old instance and mounts a pristine one with fresh initial state.

24. **What is a React Element?**  
    $\rightarrow$ A plain, immutable JavaScript object (`{ type, props, key }`) describing what should appear on screen.

25. **Does every component re-render write changes to the browser DOM?**  
    $\rightarrow$ **No.** React diffs the Virtual DOM; only if an actual change is detected will it touch the real DOM during the commit phase.

---

## [Module 06: Effects, Lifecycles & Async Flow](Module-06-Effects-And-Async-Flow.md)

26. **Why can't `useEffect` take an `async` function directly?**  
    $\rightarrow$ `async` functions return a `Promise`. But `useEffect` requires its return value to be either `undefined` or a synchronous **cleanup function**.

27. **When does the `useEffect` cleanup function run?**  
    $\rightarrow$ Right before the effect re-runs with new dependencies, and when the component unmounts from the DOM.

28. **What is the benefit of lazy state initialization: `useState(() => getInitialData())`?**  
    $\rightarrow$ It guarantees the expensive computation (like reading `localStorage` or parsing large JSON) executes **only once on initial mount**, rather than on every render.

29. **Why must React hooks only be called at the top level?**  
    $\rightarrow$ React relies on the persistent call order of hooks across renders to align values with its internal Fiber node. Calling hooks in `if` statements or loops corrupts this order.

30. **How do you prevent network race conditions in React effects?**  
    $\rightarrow$ By cancelling in-flight requests in the effect cleanup function using an `AbortController` (`controller.abort()`) or a boolean ignore flag.

---

## [Module 07: DOM Access & Mutable Refs](Module-07-DOM-And-Refs.md)

31. **What is the core difference between `useState` and `useRef`?**  
    $\rightarrow$ Updating `useState` triggers a re-render; mutating `useRef.current` persists across renders **without** triggering a re-render.

32. **What does `useRef` return?**  
    $\rightarrow$ A persistent, mutable object with a single property: `{ current: initialValue }`.

33. **When is the DOM element attached to `ref.current`?**  
    $\rightarrow$ During the Commit phase, right before `useLayoutEffect` and `useEffect` execute. Initial value is `null` on first render.

34. **Why is it bad practice to read or write `ref.current` during the render phase?**  
    $\rightarrow$ It makes the component render impure and unpredictable under Concurrent React. Refs should only be accessed in event handlers or `useEffect`.

35. **How do you persist a timer / interval ID across renders in functional components?**  
    $\rightarrow$ Store the interval ID in `timerRef.current` and clear it in the cleanup function.

---

## [Module 08: Complex State & Custom Hooks](Module-08-Complex-State-And-Custom-Hooks.md)

36. **What is a Custom Hook?**  
    $\rightarrow$ A JavaScript function starting with `use` that packages reusable stateful logic by calling other built-in React hooks.

37. **Do two components calling the exact same custom hook share the same state?**  
    $\rightarrow$ **No.** Each component call creates an independent, isolated instance of the hook's state.

38. **What is the signature of a Reducer function?**  
    $\rightarrow$ `(currentState, action) => newState`. It must be a pure function free of mutations and side effects.

39. **When should you choose `useReducer` over `useState`?**  
    $\rightarrow$ When managing complex state objects with multiple sub-values, interdependent fields, or complex state machines where the next state depends on multiple prior fields.

40. **What does `dispatch` do?**  
    $\rightarrow$ Dispatches an action object (e.g. `{ type: 'DEPOSIT', payload: 100 }`) to the reducer to calculate and commit the next state atomically.

---

## [Module 09: Global State Management (Context & Redux)](Module-09-Global-State-Context-And-Redux.md)

41. **What are the 3 parts of the Context API?**  
    $\rightarrow$ `createContext()`, `<Context.Provider value={...}>`, and `useContext(Context)`.

42. **Why wrap `useContext` in a custom hook (like `useAuth`)?**  
    $\rightarrow$ Encapsulates null-checking, throws a descriptive error if called outside its Provider, and simplifies the consumer import.

43. **Why can the Context API cause performance bottlenecks in large applications?**  
    $\rightarrow$ Because Context lacks fine-grained selectors. Any change to the Provider's `value` forces **all** consuming components to re-render, even if they only needed one unchanged property.

44. **How does Redux Toolkit (RTK) eliminate immutable boilerplate?**  
    $\rightarrow$ It integrates **Immer** under the hood in `createSlice`, allowing developers to write direct "mutating" syntax (`state.count++`) which is converted into immutable updates safely.

45. **What is a Redux Thunk?**  
    $\rightarrow$ Middleware that allows action creators to return a function instead of a plain action object, enabling asynchronous logic (API requests) before dispatching synchronous actions.

---

## [Module 10: Client-Side Routing (React Router)](Module-10-Client-Side-Routing.md)

46. **Why use `<Link>` instead of `<a href>` in React?**  
    $\rightarrow$ `<Link>` uses the HTML5 History API to transition routes client-side without a full browser reload, preserving in-memory React state.

47. **What is `<Outlet />`?**  
    $\rightarrow$ A placeholder element in a parent layout route where active child route components are rendered.

48. **When should state be stored in the URL (`useSearchParams`)?**  
    $\rightarrow$ When state should be shareable, bookmarkable, and responsive to browser back/forward buttons (search queries, active filters, tabs, pagination).

49. **How do you read URL dynamic path parameters like `/products/:id`?**  
    $\rightarrow$ Using the `useParams()` hook.

50. **Why use `replace` with `<Navigate />` in login redirects?**  
    $\rightarrow$ It replaces the current history entry rather than pushing a new one, preventing the user from getting trapped in an infinite back-button loop.

---

## [Module 11: Performance Optimization & Closures](Module-11-Performance-And-Closures.md)

51. **Why does a child component re-render when its parent re-renders?**  
    $\rightarrow$ By default, React re-renders the entire child component tree recursively unless wrapped with `React.memo`.

52. **What is the difference between `useMemo` and `useCallback`?**  
    $\rightarrow$ `useMemo` caches the **computed return value** of a calculation; `useCallback` caches the **function definition / reference** itself.

53. **Why does passing an inline arrow function break `React.memo`?**  
    $\rightarrow$ Inline arrow functions create a brand-new function reference on every render cycle. `React.memo` uses shallow reference comparison (`Object.is`), sees new references, and re-renders anyway.

54. **What is a stale closure in React?**  
    $\rightarrow$ When an asynchronous callback (timer, event listener, promise) captures and holds onto an outdated state/prop snapshot from an earlier render cycle.

55. **How do you fix a stale closure in `setInterval` without adding state to the dependency array?**  
    $\rightarrow$ Use the functional state updater form: `setCount(prev => prev + 1)`.

---

## [Module 12: Advanced Component Patterns & Ecosystem](Module-12-Advanced-Patterns-And-Ecosystem.md)

56. **What is the primary purpose of `createPortal`?**  
    $\rightarrow$ Renders an element into a different physical DOM node (e.g. `document.body`) to escape parent `overflow: hidden` or `z-index` stacking traps, while preserving React component hierarchy and event bubbling.

57. **What is a Compound Component?**  
    $\rightarrow$ A pattern where a group of components work together sharing state implicitly via internal Context (e.g. `<Accordion><Accordion.Header />...`), offering flexible and declarative JSX.

58. **How do Custom Hooks compare to HOCs and Render Props?**  
    $\rightarrow$ Custom Hooks share stateful logic cleanly without introducing wrapper components or extra JSX nesting ("wrapper hell").

59. **Why use TanStack Query instead of `useEffect` for data fetching?**  
    $\rightarrow$ It provides automatic caching, background refetching on window focus, deduplication, retry logic, and pagination out of the box.

60. **Why do we use transient props (`$prop`) in styled-components?**  
    $\rightarrow$ To prevent custom styling props from being forwarded to the native HTML DOM element as invalid HTML attributes.

---

## [Module 13: Next.js & Modern Full-Stack React](Module-13-Nextjs-And-Modern-Fullstack.md)

61. **What is the fundamental difference between RSC and SSR?**  
    $\rightarrow$ SSR generates initial HTML from client components and sends the full JS bundle to the browser for hydration; RSC runs exclusively on the server, sending **0 KB of client JavaScript**.

62. **What causes a Hydration Mismatch error?**  
    $\rightarrow$ A discrepancy between the HTML pre-rendered on the server and the HTML produced on the initial client-side render (e.g., rendering `new Date()` or `typeof window !== 'undefined'`).

63. **Can a Server Component be rendered inside a Client Component?**  
    $\rightarrow$ **Yes, but only as `children` or slot props!** You cannot directly import a Server Component into a file marked with `'use client'`.

64. **What does the `useOptimistic` hook do?**  
    $\rightarrow$ It immediately updates the client UI while a Server Action is in flight and automatically reverts to the previous state if the action throws an error.

65. **How does Incremental Static Regeneration (ISR) work?**  
    $\rightarrow$ Serves cached static pages instantly from CDN, then re-generates the static page in the background after the `revalidate` interval expires.

