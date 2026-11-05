# Module 04: Forms, Controlled Inputs & State Lifting

> **Reference Topics**: 14, 16, 20  
> **Code Implementation**: [`test/src/modules/Module04FormsAndStateLifting.jsx`](../src/modules/Module04FormsAndStateLifting.jsx)

---

## 1. Controlled vs Uncontrolled Elements (Topic 14)

### What is a Controlled Element?
A form element (like `<input>`, `<textarea>`, `<select>`) whose value is **controlled by React state**. React state is the single source of truth.

```jsx
const [name, setName] = useState('');

// Controlled input:
<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### What is an Uncontrolled Element?
A form element where form data is handled by the **DOM itself**. React doesn't monitor every keystroke; instead, you query the DOM using a `ref` or native `FormData` on submit.

```jsx
const inputRef = useRef();

const handleSubmit = (e) => {
  e.preventDefault();
  console.log(inputRef.current.value);
};

// Uncontrolled input:
<input type="text" ref={inputRef} defaultValue="John" />
```

### Comparison Matrix for Interviews

| Feature | Controlled | Uncontrolled |
| :--- | :--- | :--- |
| **Source of Truth** | React Component State | Real DOM node |
| **Instant Validation** | Easy (validate on every keystroke) | Difficult / only on submit |
| **Dynamic UI** | Can disable submit button conditionally | Requires manual DOM queries |
| **Performance** | Re-renders component on each key stroke | Zero re-renders during typing |
| **Syntax** | `value` + `onChange` | `ref` or `defaultValue` |

### ⚠️ React Rule: File Inputs are ALWAYS Uncontrolled
`<input type="file" />` is always **uncontrolled** in React because its value is read-only in the browser for security reasons. You cannot set `value={file}`. You must read it via `e.target.files[0]` or a `ref`.

### ❌ Junior Mistake: "Changing uncontrolled input to controlled"
```jsx
// ❌ WRONG: Passing undefined initially
const [search, setSearch] = useState(); // search is undefined!
<input value={search} onChange={e => setSearch(e.target.value)} />
// React Warning: "A component is changing an uncontrolled input to be controlled..."

// ✅ SENIOR FIX: Always initialize text inputs with empty string ''
const [search, setSearch] = useState('');
```

---

## 2. Lifting State Up (Topic 16)

### What it is
Often, several components need to reflect the same changing data. React recommends **lifting the shared state up to their closest common ancestor**.

```
            Dashboard (Common Ancestor - HOLDS STATE)
           ┌──────────────┴──────────────┐
           ▼                             ▼
    SearchBar (Sibling 1)        SearchResults (Sibling 2)
  (Calls onSearchChange)        (Receives search results)
```

### 3-Step Recipe for Lifting State:
1. **Identify** the state needed by multiple children.
2. **Move** that `useState` declaration up to their nearest common parent component.
3. **Pass down**:
   - The state value to children via `props`.
   - An event handler function to children via `callback props` so they can request state changes.

---

## 3. Accordion Component Pattern (Topic 20)

The Accordion is the classic interview question testing state location:

### Single-Open Accordion Architecture
If each accordion item had its own `const [isOpen, setIsOpen] = useState(false)` internally, it would be impossible for opening Item A to automatically collapse Item B!

* **Solution:** Lift `openId` to the parent container:
```jsx
function Accordion() {
  // Only stores the ID of the ONE item that is currently open (or null if all closed)
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div>
      {items.map(item => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => handleToggle(item.id)}
        />
      ))}
    </div>
  );
}
```

---

## 🎯 Quick Interview Checklist for Module 4
1. **What makes an input controlled?** $\rightarrow$ Binding its `value` prop to React state and synchronizing changes via `onChange`.
2. **Why does React warn "changing uncontrolled input to be controlled"?** $\rightarrow$ Initializing state with `undefined` makes the input start uncontrolled; when state becomes a string, React detects a mode change. Fix by initializing with `''`.
3. **Why can't `<input type="file" />` be controlled?** $\rightarrow$ Browser security prevents setting file input values programmatically; it must be accessed via `ref` or `e.target.files`.
4. **How do sibling components share state in standard React?** $\rightarrow$ Lift the state up to their closest common parent and pass values/callbacks down.
5. **How do you build a single-open accordion?** $\rightarrow$ Lift the active item ID to the parent accordion component so it coordinates which item is expanded.

