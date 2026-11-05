# Module 12: Advanced Component Patterns & Ecosystem

> **Reference Topics**: 50, 69, 70, 71, 72, 73, 74, 75, 76, 77  
> **Code Implementation**: [`test/src/modules/Module12AdvancedPatterns.jsx`](../src/modules/Module12AdvancedPatterns.jsx)

---

## 1. React Portals (`createPortal`) (Topic 76)

### Why do we need Portals?
By default, React elements render inside the DOM hierarchy of their parent component.  
If an ancestor element has:
- `overflow: hidden` (clips child elements that extend past borders).
- `z-index: 1` (gets trapped beneath sibling elements with higher z-index).
- `position: relative` or CSS `transform`.

Modals, tooltips, dialogs, and dropdown menus will be **visually clipped or trapped**.

### How Portals solve this:
`createPortal(children, containerDOMNode)` renders the HTML directly into another DOM container (e.g., `document.body` or `#modal-root`), completely escaping parent CSS styling!

```jsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, children, onClose }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body // Injected outside parent DOM tree
  );
}
```

### 💡 The Top Interview Portal Question:
> **Interviewer:** *"If a portal renders into `document.body`, does an `onClick` event inside the portal bubble to its React parent component?"*  
> **Senior Answer:**  
> *"**YES!** Even though the portal renders into a completely different physical DOM node, React's **SyntheticEvent bubbling** follows the **Virtual DOM tree (React component hierarchy)**, NOT the real DOM tree! A click inside the portal will bubble up to its React parent component."*

---

## 2. Compound Components Pattern (Topic 75)

### What is it?
A design pattern where a parent component coordinates with multiple child components to create a unified, declarative UI primitive. Children share implicit state through an internal Context.

### Classic Examples:
`<select>` and `<option>` in native HTML. In modern React design systems:
```jsx
<Accordion>
  <Accordion.Item id="item-1">
    <Accordion.Header title="Profile" />
    <Accordion.Body>User profile details...</Accordion.Body>
  </Accordion.Item>
</Accordion>
```

### How to implement:
1. Create an internal context: `const AccordionContext = createContext()`.
2. Wrap parent with Provider: `<AccordionContext.Provider value={{ openId, toggle }}>`.
3. Subcomponents (`Item`, `Header`, `Body`) consume the context.
4. Attach subcomponents as static properties for clean dot-notation:  
   `Accordion.Item = AccordionItem;`

---

## 3. Render Props Pattern (Topics 73 & 77)

### What is it?
A technique for sharing stateful logic between components by passing a **function as a prop** (or as `children`) that returns JSX.

```jsx
// Provider of state logic:
function MouseTracker({ render }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => setCoords({ x: e.clientX, y: e.clientY })}>
      {render(coords)}
    </div>
  );
}

// Consumer:
<MouseTracker render={({ x, y }) => <p>Cursor at: {x}, {y}</p>} />
```

### Evolution Note for Interviews:
* Render props and HOCs were the primary way to reuse stateful logic before React 16.8.
* In modern React, **Custom Hooks** (`useMousePosition()`) have replaced 90% of render props use cases because hooks avoid JSX nesting ("wrapper hell").
* *When are Render Props still used today?* Virtualized lists (e.g. `react-window`), where layout control must be handed to the consumer.

---

## 4. Higher-Order Components (HOC) (Topic 74)

### What is an HOC?
A pure function that takes a component as an argument and returns a **new, enhanced component**.
```jsx
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

### Example (`withAuth`):
```jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <Component {...props} />;
  };
}

// Usage:
const ProtectedProfile = withAuth(ProfilePage);
```

---

## 5. TanStack React Query (Server State Management) (Topic 72)

### Client State vs Server State
- **Client State:** Synchronous, locally owned (e.g. modal open, form input). Managed via `useState` / `useReducer`.
- **Server State:** Asynchronous, remotely owned, shared, and prone to becoming **stale** (outdated).

### Why React Query instead of `useEffect` + `fetch`?
1. **Automatic Caching & Deduplication:** Multiple components requesting the same key share one network request.
2. **Background Refetching:** Automatically updates data on window focus or network reconnect.
3. **Out-of-the-box States:** `isLoading`, `isError`, `data`, `error`.
4. **Mutations with Optimistic Updates:** Updates UI instantly before the server confirms.

```jsx
import { useQuery } from '@tanstack/react-query';

function UsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 mins
  });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {error.message}</span>;
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

## 6. Supabase (Backend as a Service) (Topic 71)

Supabase is an open-source alternative to Firebase built on PostgreSQL.
- Provides PostgreSQL database, Instant REST / GraphQL APIs, Authentication, and Realtime subscriptions.

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://xyz.supabase.co', 'public-anon-key');

// Querying data:
const { data, error } = await supabase
  .from('posts')
  .select('id, title, created_at')
  .eq('status', 'published');
```

---

## 7. Styled Components (Topics 69 & 70)

### CSS-in-JS Syntax:
```jsx
import styled, { css } from 'styled-components';

// Dynamic props and conditional css helper:
const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  background: ${props => props.$primary ? '#1a73e8' : '#ffffff'};
  color: ${props => props.$primary ? '#ffffff' : '#333333'};

  ${props => props.$outlined && css`
    border: 2px solid #1a73e8;
  `}
`;

// Usage with Transient Props ($ avoids passing custom prop to real DOM):
<Button $primary $outlined>Click Me</Button>
```

---

## 8. Third-Party DOM Integration Pattern (e.g., Leaflet Maps) (Topic 50)

To integrate imperative DOM libraries (like Leaflet, D3, Chart.js) that mutate DOM directly:
1. Provide a container element with `useRef`: `<div ref={mapContainerRef} />`.
2. Initialize the library inside `useEffect` with an empty dependency array `[]`.
3. **Always destroy the instance in the cleanup function** to prevent memory leaks!

```jsx
useEffect(() => {
  const map = L.map(mapRef.current).setView([51.505, -0.09], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  return () => {
    map.remove(); // Cleanup: destroys Leaflet DOM and event listeners
  };
}, []);
```

---

## 🎯 Quick Interview Checklist for Module 12
1. **What is the purpose of `createPortal`?** $\rightarrow$ Renders an element into a different DOM node (e.g. `document.body`) while preserving React component hierarchy and event bubbling.
2. **What is a Compound Component?** $\rightarrow$ A pattern where a group of components work together sharing state implicitly via Context (e.g. `<Accordion><Accordion.Header />...`).
3. **How do Custom Hooks compare to HOCs and Render Props?** $\rightarrow$ Custom Hooks reuse stateful logic without introducing wrapper components or extra JSX nesting ("wrapper hell").
4. **Why use TanStack Query instead of `useEffect` for data fetching?** $\rightarrow$ It provides automatic caching, background refetching, deduplication, retry logic, and pagination out of the box.
5. **Why do we use transient props (`$prop`) in styled-components?** $\rightarrow$ To prevent custom styling props from being forwarded to the native HTML DOM element as invalid attributes.

