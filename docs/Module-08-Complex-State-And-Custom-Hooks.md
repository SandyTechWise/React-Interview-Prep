# Module 08: Complex State & Custom Hooks

> **Reference Topics**: 38, 39, 41  
> **Code Implementation**: [`test/src/modules/Module08ComplexStateAndCustomHooks.jsx`](../src/modules/Module08ComplexStateAndCustomHooks.jsx)

---

## 1. Custom Hooks (Topic 38)

### What is a Custom Hook?
A custom Hook is a JavaScript function whose name starts with **`use`** and that may call other React Hooks (`useState`, `useEffect`, `useRef`, etc.).

### Why create Custom Hooks?
1. **Reusability:** Share stateful logic across multiple components without duplicating code.
2. **Separation of Concerns:** Separate complex business logic from UI JSX rendering.
3. **Composability:** Custom hooks can call other custom hooks.

```jsx
// Building a reusable localStorage sync hook:
function useLocalStorageState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

### 💡 The #1 Custom Hook Interview Trap Question:
> **Interviewer:** *"If Component A and Component B both call `const [theme, setTheme] = useTheme()`, do they share the same state?"*  
> **Senior Answer:**  
> *"**NO!** Custom hooks share stateful **logic**, NOT state itself. Every call to a custom hook creates an independent, isolated instance of state inside that component. To share actual state, you must combine the hook with the **Context API**."*

---

## 2. `useReducer` Core Concepts (Topic 39)

`useReducer` is an alternative to `useState` for managing complex state with multiple sub-values and interdependent transitions.

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

### The 4 Pillars of `useReducer`:
1. **State:** The data object representing your application/feature snapshot.
2. **Action:** A plain JavaScript object describing *what happened*. Convention: `{ type: 'ACTION_NAME', payload: optionalData }`.
3. **Dispatch:** A function that sends actions to the reducer (`dispatch({ type: 'DEPOSIT', payload: 100 })`).
4. **Reducer:** A **pure function** `(state, action) => nextState`.

```jsx
function bankReducer(state, action) {
  switch (action.type) {
    case 'DEPOSIT':
      return { ...state, balance: state.balance + action.payload, error: null };
    case 'WITHDRAW':
      if (state.balance < action.payload) {
        return { ...state, error: 'Insufficient funds!' };
      }
      return { ...state, balance: state.balance - action.payload, error: null };
    default:
      return state;
  }
}
```

### ⚠️ React Rule: Reducers MUST Be Pure Functions
- Given `(state, action)`, the reducer must always return the exact same output.
- **Never mutate the state argument directly** (`state.balance += 100` ❌). Always return a new object (`{ ...state, balance: ... }` ✅).
- **No side effects inside reducers!** (No `fetch()`, no `Math.random()`, no `Date.now()`, no `localStorage`).

---

## 3. `useState` vs `useReducer` Decision Framework (Topic 41)

| Criteria | `useState` | `useReducer` |
| :--- | :--- | :--- |
| **Type of state** | Primitives (string, boolean, number) | Objects, arrays, multiple related values |
| **State transitions** | 1 or 2 simple transitions | Multiple complex transitions (state machine) |
| **Dependencies** | Next state is independent | Next state depends on multiple previous values |
| **Business logic** | Scattered across event handlers | Centralized in one pure reducer function |
| **Testability** | Harder to test without mounting components | Trivial to unit test (it's just a pure JS function!) |

### ❌ Junior Anti-Pattern: The `useState` Explosion
```jsx
// ❌ MESSY: 5 interconnected useStates that easily become desynchronized
const [balance, setBalance] = useState(0);
const [loan, setLoan] = useState(0);
const [isActive, setIsActive] = useState(false);
const [error, setError] = useState(null);

const handleClose = () => {
  if (balance === 0 && loan === 0) {
    setIsActive(false);
    setBalance(0);
    setLoan(0);
    setError(null);
  }
};
// If one setState fails or is missed, your app enters an invalid impossible state!
```

```jsx
// ✅ SENIOR PATTERN: Single Atomic Dispatch with useReducer
dispatch({ type: 'CLOSE_ACCOUNT' });
// The reducer atomically enforces business rules and guarantees valid state transitions.
```

---

## 🎯 Quick Interview Checklist for Module 8
1. **What is a custom hook?** $\rightarrow$ A JS function starting with `use` that packages reusable stateful logic by calling other hooks.
2. **Do multiple components calling the same custom hook share state?** $\rightarrow$ No. Each component gets its own independent hook state.
3. **What is the signature of a reducer?** $\rightarrow$ `(currentState, action) => newState`. Must be a pure function with zero mutations or side-effects.
4. **Why use `useReducer` over `useState`?** $\rightarrow$ Centralizes complex transition logic, prevents impossible states, and enables straightforward unit testing without mounting components.
5. **What does dispatch do?** $\rightarrow$ Triggers the reducer with an action object to compute and commit the next state.

