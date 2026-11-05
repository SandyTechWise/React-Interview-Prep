# Module 10: Client-Side Routing (React Router)

> **Reference Topics**: 42, 43, 44, 45, 46, 47, 52, 68  
> **Code Implementation**: [`test/src/modules/Module10ClientRouting.jsx`](../src/modules/Module10ClientRouting.jsx)

---

## 1. Client-Side Routing & SPA (Topic 42)

In traditional Multi-Page Applications (MPAs), clicking a link requests a brand-new HTML document from the server, causing a white-flash page reload.  
In a **Single Page Application (SPA)** with React Router:
- The browser fetches one initial HTML/JS bundle.
- React Router intercepts URL changes using the browser's HTML5 `History API` (`pushState`, `replaceState`).
- Components swap in and out dynamically **without reloading the page**.

---

## 2. `<Link>` and `<NavLink>` (Topic 43)

### ❌ Junior Mistake: Using `<a href="...">` in React
```jsx
// ❌ WRONG: Causes a full browser reload, discarding all React state!
<a href="/products">Products</a>

// ✅ SENIOR PATTERN: Use <Link> for seamless SPA transitions
<Link to="/products">Products</Link>
```

### `<NavLink>`: Automatic Active Link Styling
`<NavLink>` is a specialized `<Link>` that knows whether its target URL matches the current URL. It accepts a function in `className` or `style`:

```jsx
<NavLink
  to="/products"
  className={({ isActive, isPending }) =>
    isActive ? 'nav-link active' : 'nav-link'
  }
>
  Products
</NavLink>
```

---

## 3. Nested Routes & Index Routes (Topic 44)

Nested routing allows parent layouts to remain mounted while child components render inside a designated placeholder called **`<Outlet />`**.

```jsx
<Routes>
  <Route path="/" element={<AppLayout />}>
    {/* Index Route renders when URL matches parent exactly ("/") */}
    <Route index element={<Home />} />
    <Route path="products" element={<ProductList />} />
    <Route path="products/:id" element={<ProductDetail />} />
  </Route>
</Routes>

function AppLayout() {
  return (
    <div>
      <Sidebar />
      <main>
        {/* Child routes render here */}
        <Outlet />
      </main>
    </div>
  );
}
```

---

## 4. Storing State in the URL (`useSearchParams`) (Topic 45)

### 💡 The Senior State Secret: The URL is Global State!
Whenever UI state needs to be:
1. **Bookmarkable** (user saves the link).
2. **Shareable** (sending a link with active filters to a teammate).
3. **History-friendly** (browser back/forward button restores the filter).

**Store it in the URL Search Parameters** instead of `useState`!

```jsx
import { useSearchParams } from 'react-router-dom';

function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';

  const handleFilter = (cat) => {
    // Updates URL to /products?category=laptops
    setSearchParams({ category: cat });
  };

  return <button onClick={() => handleFilter('laptops')}>Laptops</button>;
}
```

---

## 5. Dynamic Routes & URL Parameters (`useParams`) (Topic 46)

Dynamic segments are declared with a colon (`:id`):

```jsx
<Route path="products/:id" element={<ProductDetail />} />
```

Inside the component, extract the parameter using `useParams()`:
```jsx
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams(); // Returns { id: "p1" } for /products/p1
  return <h2>Product ID: {id}</h2>;
}
```

---

## 6. Programmatic Navigation & `<Navigate />` (Topic 47)

### `useNavigate` Hook:
Used when navigation happens in response to an action (submitting a form, button click, timer):

```jsx
const navigate = useNavigate();

const handleCheckout = async () => {
  await submitPayment();
  navigate('/order-success'); // Navigates forward
  // navigate(-1); // Navigates one step back in history
};
```

### `<Navigate />` Component:
Used for declarative, in-render redirects:
```jsx
// replace: replaces current entry in browser history (prevents back-button loops)
<Navigate to="/login" replace />
```

---

## 7. The Protected Route Pattern (Topic 52)

To restrict access to authenticated users, wrap the protected view in a gatekeeper component:

```jsx
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    // Redirects unauthenticated users to login and prevents back-button loops
    return <Navigate to="/login" replace />;
  }
  return children;
}

// In Route definitions:
<Route
  path="/admin"
  element={
    <ProtectedRoute isAuthenticated={user !== null}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

---

## 8. React Router Loaders & Actions (Topic 68)

In modern React Router (v6.4+), data fetching and mutations move out of `useEffect` into route-level **Loaders** and **Actions**:

```javascript
// Loader: Fetches data BEFORE the component renders (eliminates fetch waterfalls)
export async function productLoader({ params }) {
  const res = await fetch(`/api/products/${params.id}`);
  return res.json();
}

// In Route definition:
// <Route path="products/:id" element={<ProductDetail />} loader={productLoader} />

// In Component:
function ProductDetail() {
  const product = useLoaderData(); // Data is already loaded when component mounts!
  return <h1>{product.name}</h1>;
}
```

---

## 🎯 Quick Interview Checklist for Module 10
1. **Why use `<Link>` instead of `<a href>` in React?** $\rightarrow$ `<Link>` prevents full page reloads by using the browser History API, keeping application state intact.
2. **What is `<Outlet />`?** $\rightarrow$ A placeholder in a parent layout route where child route elements are rendered.
3. **When should you store state in the URL (`useSearchParams`)?** $\rightarrow$ When state should be shareable, bookmarkable, or responsive to browser back/forward buttons (search queries, filters, active tabs).
4. **How do you read URL parameters like `/users/:id`?** $\rightarrow$ Via the `useParams()` hook.
5. **Why use `replace` with `<Navigate />` in login redirects?** $\rightarrow$ It replaces the current history entry instead of pushing a new one, preventing the user from getting trapped in an infinite back-button loop.

