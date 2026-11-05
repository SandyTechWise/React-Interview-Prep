# Module 06: Effects, Lifecycles & Async Flow

> **Reference Topics**: 31, 32, 33, 34, 35, 40  
> **Code Implementation**: [`test/src/modules/Module06EffectsAndAsyncFlow.jsx`](../src/modules/Module06EffectsAndAsyncFlow.jsx)

---

## 1. The Rules of Hooks (Topic 34)

React relies on the **call order** of Hooks between renders to match up internal state arrays.

### ⚠️ The 2 Fundamental Rules:
1. **Only call Hooks at the top level:**
   - Never call hooks inside `if` statements, loops, or nested functions.
   - If hooks are placed inside a condition, the number/order of hook calls changes between renders, corrupting React's internal Fiber state.
2. **Only call Hooks from React functions:**
   - Call them from React function components or custom Hooks (starting with `use`).
   - Never call them from vanilla JavaScript helper functions.

```jsx
// ❌ CRITICAL JUNIOR MISTAKE: Conditional Hook call
if (isLoggedIn) {
  useEffect(() => { ... }, []); // CRASHES React when isLoggedIn flips!
}

// ✅ SENIOR PATTERN: Place the condition INSIDE the hook
useEffect(() => {
  if (!isLoggedIn) return;
  // do work
}, [isLoggedIn]);
```

---

## 2. Lazy Initial State: `useState(() => ...)` (Topic 35)

### Direct Initialization vs Callback Initialization

```jsx
// ❌ SLOW: getInitialData() runs on EVERY SINGLE RENDER!
// Even though React only uses the return value on initial mount,
// the function still executes on every render cycle.
const [data, setData] = useState(getInitialData());

// ✅ SENIOR PATTERN: Pass a function callback (Lazy State)
// React only calls this function ONCE during the initial mount!
const [data, setData] = useState(() => getInitialData());
```

**When to use Lazy State:**
- Reading from `localStorage` / `sessionStorage`.
- Parsing large JSON objects.
- Expensive mathematical or array computations.

---

## 3. `useEffect` & Dependency Array Variants (Topic 31)

`useEffect` synchronizes your component with an **external system** (APIs, DOM listeners, timers).

| Dependency Syntax | When it runs |
| :--- | :--- |
| `useEffect(() => {})` (No array) | Runs after **every single render** (rarely desired). |
| `useEffect(() => {}, [])` (Empty array) | Runs **once on mount**. |
| `useEffect(() => {}, [a, b])` (With dependencies) | Runs on mount AND **whenever `a` or `b` changes** (via `Object.is`). |

---

## 4. Async Functions inside `useEffect` (Topic 32)

### 💡 The Top Interview Gotcha: Why can't `useEffect` be async?
> **Interviewer:** *"Why is this invalid?"*  
> `useEffect(async () => { const res = await fetch(); }, []);`  
> **Senior Answer:** *"An `async` function implicitly returns a `Promise`. However, `useEffect` strictly expects its return value to be either `undefined` or a **cleanup function**. Returning a Promise breaks React's ability to call the cleanup routine."*

### ✅ The Clean Async Pattern:
```jsx
useEffect(() => {
  const controller = new AbortController();

  // Declare async function inside the effect:
  async function fetchData() {
    try {
      const res = await fetch(url, { signal: controller.signal });
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    }
  }

  fetchData();

  // Return cleanup function:
  return () => {
    controller.abort(); // Cancels pending network request
  };
}, [url]);
```

---

## 5. The Cleanup Function & Race Conditions (Topic 31 & 40)

### When does the cleanup function execute?
1. **Before the effect re-runs** with new dependencies.
2. **When the component unmounts**.

### Why is `AbortController` or a boolean flag required?
Consider a user rapidly switching tabs from `Category: Tech` to `Category: Design`:
- Request A (Tech) starts.
- Request B (Design) starts immediately after.
- If Request A finishes *after* Request B due to network latency, Request A overwrites Request B's data!
- **Solution:** Aborting Request A in the cleanup function eliminates race conditions and memory leaks.

---

## 6. Handling Errors in React (Topic 33)

React apps handle errors at two distinct levels:

1. **Async / Effect Errors:**
   - Caught via `try / catch` blocks inside event handlers or `useEffect`.
   - Stored in component error state (`const [error, setError] = useState(null)`) to show fallback banners.
2. **Rendering Lifecycle Errors (Error Boundaries):**
   - If a component throws an error during *render* (e.g. `user.address.city` when `address` is undefined), standard `try/catch` won't catch it!
   - Must be caught using a class-based **Error Boundary** (`componentDidCatch`, `getDerivedStateFromError`) or the popular `react-error-boundary` package.

---

## 🎯 Quick Interview Checklist for Module 6
1. **Why can't `useEffect` take an `async` function directly?** $\rightarrow$ Because `async` functions return a Promise, whereas `useEffect` requires a synchronous cleanup function or `undefined`.
2. **When does the `useEffect` cleanup function run?** $\rightarrow$ Right before the effect re-runs with new dependencies, and when the component unmounts.
3. **What is the benefit of `useState(() => expensiveFn())`?** $\rightarrow$ It guarantees the expensive computation runs only on initial mount, not on subsequent re-renders.
4. **Why must hooks only be called at the top level?** $\rightarrow$ React relies on the persistent call order of hooks across renders to align state with the internal Fiber node.
5. **How do you prevent network race conditions in React effects?** $\rightarrow$ By cancelling pending requests in the cleanup function using `AbortController` or an ignore flag.

