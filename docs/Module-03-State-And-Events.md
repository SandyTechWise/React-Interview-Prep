# Module 03: State, Events & Immutability

> **Reference Topics**: 11, 12, 15, 17, 18, 29  
> **Code Implementation**: [`test/src/modules/Module03StateAndEvents.jsx`](../src/modules/Module03StateAndEvents.jsx)

---

## 1. Events & SyntheticEvent (Topic 11)

### What is SyntheticEvent?
React wraps native browser events in a cross-browser wrapper called `SyntheticEvent`. It ensures that event properties and behaviors are identical across Chrome, Safari, Firefox, and Edge.

```jsx
function Button() {
  const handleClick = (e) => {
    e.preventDefault(); // Prevents default browser behavior
    e.stopPropagation(); // Prevents bubbling to parent elements
    console.log(e.target); // Element that triggered the event
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

### Passing Arguments to Event Handlers
```jsx
// ❌ CRITICAL JUNIOR MISTAKE: Invoking the function immediately during render!
<button onClick={deleteItem(item.id)}>Delete</button>
// This runs deleteItem during render, causing an infinite render loop if it sets state!

// ✅ SENIOR PATTERN: Pass an arrow function callback
<button onClick={() => deleteItem(item.id)}>Delete</button>
```

---

## 2. `useState` & `setState` (Topic 12)

### What it is
`useState` is the primary hook that allows functional components to hold local, reactive memory. When state updates, React schedules a re-render.

```jsx
const [count, setCount] = useState(0);
```

### Direct Update vs Functional Update
```jsx
// Direct update: fine when new state does NOT depend on current state
setSearchText('React');

// Functional update: MANDATORY when new state depends on previous state!
setCount((prevCount) => prevCount + 1);
```

### 💡 Interview Trap: The Three `setCount` Calls
> **Interviewer:** *"What happens here?"*
> ```jsx
> const [count, setCount] = useState(0);
> const handleClick = () => {
>   setCount(count + 1);
>   setCount(count + 1);
>   setCount(count + 1);
> };
> ```
> **Senior Answer:**  
> *"Count will only increase by **1**, NOT 3! Because inside that event handler snapshot, `count` is still `0`. All three calls evaluate to `setCount(0 + 1)`.  
> To increment by 3, you must use functional updates:*
> ```jsx
> setCount(prev => prev + 1);
> setCount(prev => prev + 1);
> setCount(prev => prev + 1); // Correct: increments to 3
> ```

---

## 3. State vs Props (Topic 15)

| Feature | State | Props |
| :--- | :--- | :--- |
| **Definition** | Internal component memory | External inputs passed to component |
| **Ownership** | Owned and controlled by the component itself | Owned and passed down by parent |
| **Mutability** | Mutable via setter function (`setState`) | Strictly **read-only / immutable** |
| **Re-render** | Changing state triggers a re-render | Changing received props triggers a re-render |

---

## 4. Immutable Data (Topic 17)

### Why does React require Immutability?
React uses **shallow reference equality** (`Object.is(prev, next)`) to determine if state changed. If you mutate an existing array or object in place, the memory address stays identical, and React will **bail out and skip the re-render**!

### Common CRUD Immutability Patterns:

```javascript
// 1. ADD to array
setItems(prev => [...prev, newItem]); // ❌ Never: prev.push(newItem)

// 2. REMOVE from array
setItems(prev => prev.filter(item => item.id !== id)); // ❌ Never: prev.splice(index, 1)

// 3. UPDATE an item inside an array
setItems(prev =>
  prev.map(item =>
    item.id === id ? { ...item, qty: item.qty + 1 } : item
  )
);

// 4. UPDATE nested object property
setUser(prev => ({
  ...prev,
  address: { ...prev.address, city: 'San Francisco' }
}));
```

---

## 5. Derived State (Topic 18)

### What it is
Derived state is any value that can be computed synchronously from existing state or props during rendering.

### ❌ Junior Anti-Pattern: Redundant State Duplication
```jsx
// ❌ WRONG: Storing state that could simply be calculated!
const [items, setItems] = useState([...]);
const [total, setTotal] = useState(0); // Redundant! Leads to sync bugs.

// Whenever items change, you have to remember to update total.
```

### ✅ Senior Pattern: Single Source of Truth
```jsx
// ✅ CORRECT: Compute on the fly during render!
const [items, setItems] = useState([...]);

// Derived variables: Zero extra re-renders, always 100% in sync
const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
```

---

## 6. State Update Batching (Topic 29)

### What is Batching?
Batching is when React groups multiple `setState` calls into a single re-render to avoid unnecessary repaints and boost performance.

### ⚡ React 17 vs React 18 (Automatic Batching)
* **In React 17:** Batching only happened inside native React event handlers (e.g. `onClick`). Updates inside `setTimeout`, `fetch().then()`, or native event listeners triggered **separate re-renders** for each `setState`.
* **In React 18+ (Automatic Batching):** **ALL** state updates are automatically batched into a single render, regardless of where they happen (promises, `setTimeout`, intervals, async/await).

```jsx
// In React 18, this causes only ONE re-render:
setTimeout(() => {
  setDiscount(10);
  setStatus('Promo Applied');
}, 500);
```

### Escape Hatch (`flushSync`)
If you ever strictly need an immediate synchronous DOM flush (rare, e.g. focusing an element immediately after a state change), use `flushSync`:
```jsx
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(c => c + 1);
});
// DOM is guaranteed updated right here
```

---

## 🎯 Quick Interview Checklist for Module 3
1. **Why is `setState` asynchronous in snapshots?** $\rightarrow$ React delays committing updates to batch them together for optimal performance.
2. **When must you use `setCount(prev => prev + 1)`?** $\rightarrow$ Whenever the next state depends directly on the preceding state value.
3. **Why shouldn't you do `array.push()` with React state?** $\rightarrow$ It mutates the existing reference; React won't detect the change and won't re-render.
4. **What is derived state and why is it preferred over extra `useState`?** $\rightarrow$ It avoids redundant state synchronization bugs by calculating values on the fly during render.
5. **What changed with batching in React 18?** $\rightarrow$ Automatic Batching now batches state updates everywhere, including async code, `Promises`, and `setTimeout`.

