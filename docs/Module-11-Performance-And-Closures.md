# Module 11: Performance Optimization & Closures

> **Reference Topics**: 53, 54, 55, 56, 57  
> **Code Implementation**: [`test/src/modules/Module11PerformanceAndClosures.jsx`](../src/modules/Module11PerformanceAndClosures.jsx)

---

## 1. When Does React Re-Render? (Topic 53)

By default in React:
> **When a parent component re-renders, ALL of its children re-render recursively**, regardless of whether their props changed!

### The 3 Causes of a Re-render:
1. **State changes** inside the component.
2. **Parent re-renders** (triggers downstream render cascade).
3. **Context value changes** (for components consuming that context).

> ⚠️ **The Golden Performance Rule:** Re-rendering in React is fast. Only optimize when you have measured a real performance bottleneck using the **React DevTools Profiler**. Premature optimization adds code complexity and memory overhead.

---

## 2. `React.memo` (Topic 54)

`React.memo` is a Higher-Order Component that wraps a functional component. It tells React:
> *"Only re-render this component if its props have actually changed."*

```jsx
const MemoizedCard = React.memo(function UserCard({ name, onSelect }) {
  return <div onClick={onSelect}>{name}</div>;
});
```

### How `React.memo` compares props:
- Uses **shallow reference comparison** (`Object.is`).
- Primitives (`1 === 1`, `'abc' === 'abc'`) evaluate to `true`.
- Objects, arrays, and functions (`{} !== {}`, `() => {} !== () => {}`) evaluate to `false` if re-created on each render!

### ❌ The #1 Mistake That Breaks `React.memo`:
```jsx
// ❌ BROKEN: Passing an inline callback creates a NEW function reference every render!
<MemoizedCard name="Alex" onSelect={() => handleClick(id)} />
// React.memo sees prevProps.onSelect !== nextProps.onSelect and RE-RENDERS anyway!

// ✅ SENIOR PATTERN: Pair React.memo with useCallback
const handleSelect = useCallback(() => handleClick(id), [id]);
<MemoizedCard name="Alex" onSelect={handleSelect} />
```

---

## 3. `useMemo` vs `useCallback` (Topic 55)

| Feature | `useMemo` | `useCallback` |
| :--- | :--- | :--- |
| **What it caches** | The **RETURN VALUE** of a calculation | A **FUNCTION DEFINITION / REFERENCE** |
| **Syntax** | `useMemo(() => compute(a, b), [a, b])` | `useCallback(() => doWork(a, b), [a, b])` |
| **Primary Use Case** | Expensive filtering, sorting, or complex math | Passing stable callbacks to memoized children (`React.memo`) |
| **Equivalence** | `useMemo(() => fn, deps)` | $\equiv$ `useCallback(fn, deps)` |

```jsx
// 1. useMemo: Caches the calculated output
const sortedList = useMemo(() => {
  return items.filter(i => i.active).sort((a, b) => a.price - b.price);
}, [items]);

// 2. useCallback: Caches the function reference
const handleSave = useCallback((item) => {
  api.save(item);
}, []); // Stable reference across all renders
```

---

## 4. Helper Functions (Topic 56)

### Where should helper functions live?

```jsx
// ✅ SENIOR PATTERN: If a helper does NOT read props or state,
// move it OUTSIDE the component!
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

export default function ProductCard({ price }) {
  // formatCurrency is declared once at module load,
  // NOT re-allocated in memory on every render cycle!
  return <span>{formatCurrency(price)}</span>;
}
```

---

## 5. JavaScript Closures & The Stale Closure Trap (Topic 57)

### What is a Closure?
In JavaScript, a function retains access to variables from its lexical scope where it was created.  
In React, **every render creates a snapshot** of variables (`props`, `state`).

### ❌ The Classic Stale Closure Bug:
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // ❌ STALE CLOSURE BUG!
      // This callback closed over `count` from the INITIAL render (where count was 0).
      // On every tick, it runs setCount(0 + 1), freezing the counter at 1 forever!
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []); // Missing count in deps
}
```

### ✅ The 2 Solutions to Stale Closures:
1. **Use Functional Updates (Preferred):**
   ```jsx
   setCount(prev => prev + 1); // React guarantees 'prev' is always the freshest state!
   ```
2. **Use a Ref (`useRef`):**
   ```jsx
   const countRef = useRef(count);
   countRef.current = count; // Always mirrors freshest state
   ```

---

## 🎯 Quick Interview Checklist for Module 11
1. **Why does a child component re-render when a parent re-renders?** $\rightarrow$ By default, React re-renders the entire child component tree recursively unless protected by `React.memo`.
2. **What is the difference between `useMemo` and `useCallback`?** $\rightarrow$ `useMemo` caches the calculated result of a function; `useCallback` caches the function reference itself.
3. **Why does passing an inline arrow function break `React.memo`?** $\rightarrow$ Inline functions create a new object reference in memory on every render; `React.memo` compares by reference (`Object.is`) and assumes props changed.
4. **What is a stale closure in React?** $\rightarrow$ When an asynchronous callback (timer, event listener, promise) captures and holds onto an outdated state/prop snapshot from an earlier render.
5. **How do you fix a stale closure in `setInterval` without adding it to the dependency array?** $\rightarrow$ Use the functional state updater form: `setCount(prev => prev + 1)`.

