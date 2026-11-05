# Module 05: React Internals, Keys & Lifecycle

> **Reference Topics**: 8, 13, 25, 26, 27, 30  
> **Code Implementation**: [`test/src/modules/Module05ReactInternalsAndKeys.jsx`](../src/modules/Module05ReactInternalsAndKeys.jsx)

---

## 1. Rendering in React: Render vs Commit Phase (Topic 8)

Understanding rendering is the #1 question asked in senior React interviews.

```
┌────────────────┐      ┌─────────────────────────┐      ┌─────────────────────┐      ┌───────────────┐
│ 1. TRIGGER     │ ───► │ 2. RENDER PHASE         │ ───► │ 3. COMMIT PHASE     │ ───► │ 4. PAINT      │
│ State update / │      │ React calls components  │      │ React writes diffs  │      │ Browser repaints
│ initial mount  │      │ & creates Virtual DOM   │      │ to the real DOM     │      │ pixels on screen
└────────────────┘      └─────────────────────────┘      └─────────────────────┘      └───────────────┘
```

### The 2 Main Phases:
1. **Render Phase**:
   - React calls your component functions.
   - Computes the new Virtual DOM tree.
   - Performs **Diffing / Reconciliation** (compares previous Virtual DOM with new Virtual DOM).
   - **Must be pure!** Can be paused, aborted, or restarted by React (Concurrent Mode).
2. **Commit Phase**:
   - Handled by `react-dom`.
   - React applies the calculated differences (mutations) to the real DOM nodes.
   - **Synchronous** and cannot be interrupted.

> 💡 **Interview Pro-Tip:** A component "rendering" does NOT mean the real browser DOM was updated! If the render output didn't produce changes during diffing, the real DOM is untouched.

---

## 2. Components, Elements & Instances (Topic 25)

| Term | What it is | Example |
| :--- | :--- | :--- |
| **Component** | The blueprint / function declaration | `function UserProfile() { ... }` |
| **React Element** | Lightweight, immutable JavaScript object created by JSX | `<UserProfile />` $\rightarrow$ `{ type: UserProfile, props: {} }` |
| **Component Instance** | Internal React Fiber node in memory with local state & lifecycle | Created when React mounts the element to the tree |

---

## 3. The `key` Prop & Reconciliation (Topic 26)

### Why does React need keys?
React's diffing algorithm matches elements between renders based on their:
1. Position in the tree.
2. Element type (e.g. `div`, `p`, `UserCard`).
3. **`key` attribute**.

### ❌ The "Index as Key" Anti-Pattern
```jsx
// ❌ DANGEROUS: Using array index as key
{items.map((item, index) => (
  <TodoItem key={index} text={item.text} />
))}
```
**Why this breaks:**  
If you prepend an item or delete from the middle, the indices change:
- What was at `index 0` is now at `index 1`.
- React thinks the element identity didn't change and only its props updated!
- Any internal state (e.g. checkbox check, input text) stays at `index 0`, causing state to attach to the wrong item!

**Rule:** Always use **stable, unique IDs** (e.g., `key={item.id}`).

---

## 4. Resetting State with the `key` Prop (Topic 27)

### 💡 The Senior Superpower
When you need to reset a component's internal state when switching targets (e.g., switching between User A and User B in an edit form), junior developers often write messy `useEffect` sync loops:

```jsx
// ❌ MESSY JUNIOR CODE:
function UserEditor({ user }) {
  const [note, setNote] = useState('');
  useEffect(() => {
    setNote(''); // Extra re-render, flickers, bug-prone!
  }, [user.id]);
}
```

```jsx
// ✅ SENIOR PATTERN: Change the `key` on the component!
<UserEditor key={selectedUser.id} user={selectedUser} />
```
**Why this works:**  
When the `key` changes, React treats `UserEditor` as a completely brand-new component:
1. It **unmounts** the previous instance (destroying all old state).
2. It **mounts** a fresh instance with pristine initial state.
3. Zero flickers, zero redundant re-renders, zero `useEffect` boilerplate.

---

## 5. Component Lifecycle in Functional Components (Topic 30)

In functional components, lifecycle is expressed through render phases and `useEffect`:

| Lifecycle Phase | Mental Model in Functional Components |
| :--- | :--- |
| **Mounting** | Initial render $\rightarrow$ DOM commit $\rightarrow$ `useEffect(..., [])` runs |
| **Updating** | State/prop change $\rightarrow$ Re-render $\rightarrow$ DOM commit $\rightarrow$ `useEffect(..., [deps])` runs |
| **Unmounting** | Component removed from tree $\rightarrow$ Effect cleanup functions execute |

---

## 6. React Developer Tools (Topic 13)

Essential tools every interviewer expects you to know:
- **Components Tab**: Inspect props, hooks, context values, and see which component caused a child to render.
- **Profiler Tab**: Record a flamechart to measure component render times and see why a component re-rendered (*"Props changed"*, *"Hook 1 changed"*).
- **"Highlight updates when components render"**: Flashes colored boxes on screen whenever DOM elements re-render.

---

## 🎯 Quick Interview Checklist for Module 5
1. **What is the difference between Render phase and Commit phase?** $\rightarrow$ Render calculates the Virtual DOM diff (pure calculation); Commit mutates the real DOM (synchronous).
2. **What happens if you use array index as key when prepending items?** $\rightarrow$ Indices shift, causing React to misalign local state and input focus with the wrong items.
3. **How do you cleanly reset an entire form's state when switching records?** $\rightarrow$ Pass `key={record.id}` to the form component.
4. **What is a React Element?** $\rightarrow$ A plain JavaScript object describing a DOM node or component (`{ type, props, key }`).
5. **Does every re-render write to the DOM?** $\rightarrow$ No! The commit phase only touches the real DOM if the diffing algorithm detects differences.

