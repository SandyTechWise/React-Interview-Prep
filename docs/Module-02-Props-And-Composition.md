# Module 02: Props, Data Flow & Component Architecture

> **Reference Topics**: 5, 6, 19, 21, 22, 23, 24  
> **Code Implementation**: [`test/src/modules/Module02PropsAndComposition.jsx`](../src/modules/Module02PropsAndComposition.jsx)

---

## 1. React Props (Topic 5)

### What it is
Props (short for *properties*) are the arguments passed into React components. They allow parent components to pass data and configuration down the component tree.

```jsx
// Parent passes props
<Badge label="Operational" variant="success" />

// Child receives props as an object
function Badge({ label, variant = 'info' }) {
  return <span className={`badge badge-${variant}`}>{label}</span>;
}
```

### Key Properties of Props
- Props can be primitives (numbers, strings, booleans), objects, arrays, functions (callbacks), or even other React elements (JSX).
- Destructuring with default values (`variant = 'info'`) provides safe fallbacks.

---

## 2. Props Immutability & One-Way Data Flow (Topic 6)

### ⚠️ The Golden Rule: Props are Read-Only (Immutable)
A component must **never mutate its own props**.

```jsx
// ❌ CRITICAL JUNIOR MISTAKE: Mutating props directly
function UserCard(props) {
  props.user.name = 'Alex'; // Mutating parent state directly! NEVER DO THIS.
  return <div>{props.user.name}</div>;
}

// ✅ SENIOR PATTERN: Treat props as pure, read-only values
function UserCard({ user, onUpdateName }) {
  // If a change is needed, invoke a callback passed from the parent:
  return <button onClick={() => onUpdateName('Alex')}>Update</button>;
}
```

### One-Way Data Flow (Unidirectional Flow)
- In React, data flows in only one direction: **Top $\rightarrow$ Down** (Parent to Child).
- **How does a child communicate with a parent?**  
  Via **callbacks**. The parent passes a function prop (e.g., `onPromote={handlePromote}`), and the child invokes it with data.

---

## 3. The `children` Prop (Topic 19)

### What it is
`children` is a reserved React prop that automatically captures whatever content is placed between a component's opening and closing tags.

```jsx
// Usage:
<Card title="System Status">
  <p>All services are operational.</p>
</Card>

// Implementation:
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}
```

### Why use `children`?
- **Containment / Generic Wrappers**: Modal dialogs, Cards, Sidebars, Layouts.
- The parent wrapper doesn't need to know or care what lives inside `children`.

---

## 4. Prop Drilling (Topic 21)

### What it is
Prop drilling happens when you pass a prop through multiple intermediate components that do **not** need the prop themselves, simply to deliver it to a deeply nested child.

```
App (has user state)
 └── PageLayout (doesn't need user, just forwards it)
      └── Sidebar (doesn't need user, just forwards it)
           └── UserProfile (actually needs user)
```

### Problems with Prop Drilling:
- Tight coupling between unrelated components.
- Refactoring intermediate components becomes painful.
- Hard to track where data originates.

---

## 5. Component Composition (Topic 22)

### What it is
Composition is combining simpler components to create more complex UIs, rather than relying on deep inheritance or bloated monolithic components.

### 💡 The Senior Secret: Composition Solves Prop Drilling First
Before reaching for global state (Context API or Redux), use **Component Composition**:

```jsx
// ❌ WITH PROP DRILLING:
<PageLayout user={user} onLogout={handleLogout} />

// ✅ WITH COMPONENT COMPOSITION:
// Pass the leaf component directly via children!
<PageLayout>
  <Sidebar>
    <UserProfile user={user} onLogout={handleLogout} />
  </Sidebar>
</PageLayout>
```
*Notice:* `PageLayout` and `Sidebar` no longer need to know anything about `user` or `onLogout`!

---

## 6. Passing Elements as Props (Slot Pattern) (Topic 23)

### What it is
Just like `children`, you can pass whole JSX elements into regular props. This is often called the **Slots Pattern** (similar to Vue/Web Components slots).

```jsx
<Card
  title="Team Overview"
  icon={<UsersIcon />}
  actionSlot={<button onClick={refresh}>Refresh</button>}
>
  <UserList />
</Card>

function Card({ title, icon, actionSlot, children }) {
  return (
    <div className="card">
      <div className="card-header">
        {icon}
        <h3>{title}</h3>
        {actionSlot}
      </div>
      <div>{children}</div>
    </div>
  );
}
```

### Why this is powerful:
- The `Card` does not dictate button styles, click handlers, or icon formats.
- High flexibility with zero prop drilling.

---

## 7. Props as Component API Design (Topic 24)

When designing reusable components (like in a design system), treat props as a public API:

1. **Use Variants over boolean explosions:**
   ```jsx
   // ❌ Bad API: Boolean explosion
   <Button isPrimary isLarge hasIcon isRounded />

   // ✅ Clean API: Categorized string literals / enums
   <Button variant="primary" size="lg" shape="rounded" icon={<StarIcon />} />
   ```
2. **Consistent Event Naming:**
   - Props that take callbacks should start with `on` (`onClick`, `onSelect`, `onDismiss`).
   - Handler functions inside the parent should start with `handle` (`handleClick`, `handleSelect`).
3. **Always provide sensible default values** using destructuring defaults.

---

## 🎯 Quick Interview Checklist for Module 2
1. **Can a child component change its props?** $\rightarrow$ No, props are read-only and immutable.
2. **What is unidirectional data flow?** $\rightarrow$ Data flows down from parent to child via props; changes flow up via callback functions.
3. **What is the first tool to fix prop drilling before Context?** $\rightarrow$ Component composition (using `children` or slot props).
4. **What is the `children` prop?** $\rightarrow$ A special prop representing whatever elements are nested inside the component tags.
5. **Why pass JSX elements as props?** $\rightarrow$ Enables flexible slot patterns without hardcoding child logic inside container components.

