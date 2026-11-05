# Module 01: Core Foundations, JSX & Component Purity

> **Reference Topics**: 1, 2, 3, 4, 7, 9, 10, 28  
> **Code Implementation**: [`test/src/modules/Module01Foundations.jsx`](../src/modules/Module01Foundations.jsx)

---

## 1. React Strict Mode (Topic 1)

### What it is
`<StrictMode>` is a developer tool provided by React that activates additional checks and warnings for its descendants. It has **zero effect on production builds**.

### What it does in React 18+
In development mode, React deliberately:
1. **Renders components twice** to detect accidental impure side-effects.
2. **Re-runs effects twice** (`Mount -> Unmount -> Mount`) to verify cleanup functions.
3. **Checks for deprecated APIs** (like legacy string refs or `findDOMNode`).

```jsx
// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

### 💡 Interview Trap Question
> **Interviewer:** *"Why is my `console.log` or API call running twice on initial page load?"*  
> **Senior Answer:** *"It is caused by `<StrictMode>` in development mode. React deliberately invokes the render phase and effects twice to ensure components are pure functions and cleanup functions work properly. This does not happen in production."*

---

## 2. React Components (Topic 2)

### What it is
A React Component is a JavaScript function that receives an input object called `props` and returns a React element (JSX) describing the UI.

### ⚠️ React Rule: Component Naming
Component names **MUST start with a capital letter (PascalCase)**.

```jsx
// ❌ JUNIOR MISTAKE: Lowercase component name
function profileCard() {
  return <div>Alex</div>;
}
// Usage: <profileCard />
// React compiles this to React.createElement('profileCard') which the browser treats as a native, non-existent HTML tag!

// ✅ SENIOR PATTERN: PascalCase
function ProfileCard() {
  return <div>Alex</div>;
}
// React compiles this to React.createElement(ProfileCard)
```

---

## 3. JSX & Under the Hood (Topic 3)

### What it is
JSX stands for **JavaScript XML**. It is syntactic sugar for `React.createElement(...)`.

```jsx
// What you write in JSX:
const element = <h1 id="title" className="heading">Hello World</h1>;

// What Babel / Vite compiles it to in plain JavaScript:
const element = React.createElement(
  'h1',
  { id: 'title', className: 'heading' },
  'Hello World'
);

// What React.createElement returns: A plain JavaScript object (Virtual DOM Node)
// {
//   type: 'h1',
//   props: { id: 'title', className: 'heading', children: 'Hello World' },
//   key: null,
//   ref: null
// }
```

### Pro Tip
Because JSX is just an expression that produces an object:
- You can store JSX in variables.
- You can pass JSX as arguments to functions.
- You can return JSX conditionally from `if` statements.

---

## 4. Styling React Apps (Topic 4)

| Approach | Syntax Example | When to Use |
| :--- | :--- | :--- |
| **Global / Plain CSS** | `<div className="card">` | Simple apps, global resets. |
| **Inline Styles** | `<div style={{ color: 'red', marginTop: '8px' }}>` | Dynamic calculations (e.g. coordinates, progress bars). |
| **CSS Modules** | `<div className={styles.card}>` | Component-scoped styles without naming collisions. |
| **Utility CSS** | `<div className="p-4 bg-white rounded-lg">` | Fast prototyping with Tailwind CSS. |

### ❌ Junior Mistake with Inline Styles
```jsx
// ❌ WRONG: CSS string syntax does NOT work in JSX
<div style="color: red; margin-top: 10px;"></div>

// ❌ WRONG: Single curly brace (passes syntax error or invalid object)
<div style={color: 'red'}></div>

// ✅ CORRECT: Double curly braces (outer = JSX expression, inner = JS object with camelCase)
<div style={{ color: 'red', marginTop: '10px' }}></div>
```

---

## 5. JSX Rules (Topic 7)

### Rule 1: Single Root Element
Every component must return a **single root element**.
* **Reason:** A JavaScript function cannot return multiple values without wrapping them in an array or object.

### Rule 2: Close All Tags
All tags must be explicitly closed: `<img />`, `<input />`, `<br />`.

### Rule 3: Use camelCase for Attributes
Because JSX is closer to JavaScript than HTML:
- Use `className` instead of `class` (`class` is a reserved keyword in JS).
- Use `htmlFor` instead of `for` (`for` is reserved for loops in JS).
- Use `tabIndex`, `onClick`, `onChange`.

### Rule 4: JavaScript Expressions in `{}`
Only **expressions** (values that evaluate to something) can go inside `{}`:
```jsx
// ❌ WRONG: Statement inside JSX (SyntaxError)
<div>{ if (isLoggedIn) { 'Hi' } }</div>

// ✅ CORRECT: Expression inside JSX (ternary or logical operator)
<div>{isLoggedIn ? 'Hi' : 'Please log in'}</div>
<div>{hasAlert && <span className="badge">New Alert</span>}</div>
```

---

## 6. React Destructuring (Topic 9)

Destructuring allows unpacking values from `props` directly in the component signature with default fallback values.

```jsx
// ❌ Cluttered:
function UserProfile(props) {
  return <div>{props.name} - {props.role}</div>;
}

// ✅ Senior Pattern: Clean destructuring with default parameters
function UserProfile({ name, role = 'Member', isVerified = false }) {
  return (
    <div>
      <h3>{name} {isVerified && '✅'}</h3>
      <p>{role}</p>
    </div>
  );
}
```

---

## 7. React Fragments (Topic 10)

### Why do we need Fragments?
To satisfy the "single root element" rule without polluting the real DOM with unnecessary wrapper `<div>`s that break Flexbox, CSS Grid, or table layouts.

```jsx
// Shorthand syntax:
function TableColumns() {
  return (
    <>
      <td>Column 1</td>
      <td>Column 2</td>
    </>
  );
}

// 💡 INTERVIEW QUESTION: What is the difference between <> and <React.Fragment>?
// Answer:
// Shorthand <> does NOT accept any attributes.
// <React.Fragment key={item.id}> is REQUIRED when mapping over a list.

function Glossary({ items }) {
  return (
    <dl>
      {items.map(item => (
        // ✅ Fragment with a key prop
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

---

## 8. Pure Components & Purity Rules (Topic 28)

### What is a Pure Function?
1. **Same inputs $\rightarrow$ Same output:** Given the same props and state, it returns the exact same JSX.
2. **Zero side-effects during render:** It does not mutate any variable or object that existed before the render call.

### ❌ Junior Mistake: Mutating external variables in render
```jsx
// ❌ DANGEROUS IMPURE CODE
let renderCount = 0;

function CounterBadge() {
  renderCount++; // Modifying an outside variable inside render!
  return <span>Rendered: {renderCount} times</span>;
}
```
*Why this breaks:* In concurrent React or StrictMode, React can render multiple times before committing. The count will jump unpredictably!

### ✅ React Rule of Purity
- **Render Phase = Pure calculation.** (No API calls, no setting timers, no mutating variables).
- **Side Effects = Event Handlers OR `useEffect`.**

---

## 🎯 Quick Interview Checklist for Module 1
1. **Why does StrictMode render twice?** $\rightarrow$ To detect impure functions and unhandled effect cleanups in dev mode.
2. **What does JSX compile to?** $\rightarrow$ `React.createElement(...)` objects (Virtual DOM nodes).
3. **Why do component names need to be capitalized?** $\rightarrow$ JSX treats lowercase names as standard HTML strings.
4. **When do you use `<React.Fragment>` instead of `<>`?** $\rightarrow$ When you need to pass a `key` in a loop.
5. **What is component purity?** $\rightarrow$ Given identical props/state, render output is identical and free of side-effects.

