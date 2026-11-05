# Module 07: DOM Access & Mutable Refs

> **Reference Topics**: 36, 37  
> **Code Implementation**: [`test/src/modules/Module07DOMAndRefs.jsx`](../src/modules/Module07DOMAndRefs.jsx)

---

## 1. What is `useRef`? (Topic 37)

`useRef(initialValue)` returns a mutable JavaScript object with a single property:
```js
{ current: initialValue }
```

### The 2 Core Superpowers of `useRef`:
1. **Persists across re-renders:** The ref object retains its value for the entire lifetime of the component instance.
2. **Mutations DO NOT trigger re-renders:** Changing `ref.current = newValue` does **not** cause React to re-render the component.

---

## 2. `useState` vs `useRef` vs Regular Variable

| Feature | `useState` | `useRef` | Regular Variable (`let x = 0`) |
| :--- | :--- | :--- | :--- |
| **Causes Re-render on change?** | **YES** | **NO** | **NO** |
| **Persists across re-renders?** | **YES** | **YES** | **NO** (re-initialized on every render) |
| **Use Case** | Data displayed in the UI | DOM access, timers, tracking previous values | Ephemeral calculations during render |

---

## 3. Refs to Select DOM Elements (Topic 36)

By passing a ref to a JSX element's `ref` attribute, React populates `ref.current` with the native DOM element once the component mounts.

```jsx
const inputRef = useRef(null);

const handleFocus = () => {
  // Directly calling native DOM API
  inputRef.current.focus();
};

return (
  <>
    <input ref={inputRef} type="text" />
    <button onClick={handleFocus}>Focus</button>
  </>
);
```

### Common DOM Use Cases:
- **Managing focus:** Auto-focusing an input on modal open or button click.
- **Triggering imperative animations / scroll:** `elementRef.current.scrollIntoView({ behavior: 'smooth' })`.
- **Measuring DOM dimensions:** `elementRef.current.getBoundingClientRect()`.
- **Media playback:** `videoRef.current.play()`, `videoRef.current.pause()`.

---

## 4. `useRef` as a Generic Mutable Container (Topic 37)

Whenever you need to keep track of a value that shouldn't trigger a visual update when it changes, use `useRef`:

### Use Case A: Storing Timer and Interval IDs
```jsx
const timerRef = useRef(null);

const startTimer = () => {
  timerRef.current = setInterval(() => {
    // do work
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerRef.current);
};
```
*Why not state?* If you stored `intervalId` in `useState`, updating it would cause an unnecessary re-render.

### Use Case B: Tracking Previous State (The Keystroke vs Submission Mental Model)
```jsx
function SearchBox({ query }) {
  const prevQueryRef = useRef('');

  // useEffect runs AFTER the component finishes rendering and paints to DOM:
  useEffect(() => {
    prevQueryRef.current = query;
  }, [query]);

  return <p>Current: {query} | Previous: {prevQueryRef.current}</p>;
}
```

#### 💡 The Keystroke Interview Trap:
> **Question:** *"If I type 'H' then 'e', why does `prevQueryRef` show only 1 letter ('H')?"*  
> **Senior Answer:**  
> *"Because `onChange` triggers a re-render on **every single keystroke**.  
> 1. When you type `'H'`, React renders with `query = 'H'` (and `prev = ''`). After render, effect sets `prev = 'H'`.  
> 2. When you type `'e'` (making it `'He'`), React renders with `query = 'He'` and `prev = 'H'`.  
> Since each render is triggered per character, the ref holds the state from the immediate prior keystroke! To track previous **full search terms** (e.g. `'Apple'` $\rightarrow$ `'Banana'`), synchronize the ref with a submitted query state instead of the raw input keystroke."*

### Use Case C: Tracking Total Render Count
```jsx
const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1;
}); // Runs after every render without causing an infinite render loop
```

---

## 5. ⚠️ The Golden Rule of Refs

> **DO NOT read or write `ref.current` during the Render Phase!**

```jsx
// ❌ WRONG: Writing to ref during render
function ImpureComponent() {
  const countRef = useRef(0);
  countRef.current += 1; // ❌ Impure! React Concurrent Mode can discard and re-run renders.
  return <h1>{countRef.current}</h1>; // ❌ Reading ref during render can show stale/inconsistent data.
}

// ✅ CORRECT: Only read/write refs inside Event Handlers or useEffect
function PureComponent() {
  const countRef = useRef(0);

  const handleClick = () => {
    countRef.current += 1; // ✅ Inside event handler
  };

  useEffect(() => {
    countRef.current += 1; // ✅ Inside effect
  });

  return <button onClick={handleClick}>Click</button>;
}
```

---

## 🎯 Quick Interview Checklist for Module 7
1. **What is the difference between `useState` and `useRef`?** $\rightarrow$ `useState` re-renders the component on change; `useRef` mutates `.current` silently without triggering a re-render.
2. **What does `useRef` return?** $\rightarrow$ An object with a single mutable property: `{ current: initialValue }`.
3. **When is the DOM node attached to `ref.current`?** $\rightarrow$ During the Commit phase, right before `useLayoutEffect` and `useEffect` run. Initial value is `null` on first render.
4. **Why is it bad practice to write `ref.current` during render?** $\rightarrow$ It makes the component impure. React renders must be idempotent and free of side-effects.
5. **How do you persist a timer ID across renders in functional components?** $\rightarrow$ Store the ID in `timerRef.current`.

