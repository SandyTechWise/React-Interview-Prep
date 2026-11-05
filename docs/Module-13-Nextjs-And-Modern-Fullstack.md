# Module 13: Next.js & Modern Full-Stack React

> **Reference Topics**: 78 through 103 (All Next.js & React 19 Full-Stack Topics)  
> **Code Implementation**: [`test/src/modules/Module13NextAndModernFullStack.jsx`](../src/modules/Module13NextAndModernFullStack.jsx)

---

## 1. RSC vs SSR: The Ultimate Showdown (Topics 78, 80 & 81)

This is the **#1 question asked in modern React/Next.js interviews**:

| Feature | Server-Side Rendering (SSR) | React Server Components (RSC) |
| :--- | :--- | :--- |
| **Where it runs** | Runs on the server during initial load | Runs **only and always** on the server |
| **Client Bundle Size** | Sends JavaScript for hydration | **0 KB JavaScript** sent to client |
| **Hydration** | Entire HTML page is hydrated | **Never hydrated**; remains pure static UI |
| **Interactivity** | Supports `useState`, `onClick` after hydration | Cannot use state, effects, or browser listeners |
| **Database Access** | Limited to `getServerSideProps` | Direct `async/await` database queries inside component body |

> 💡 **Interview Summary:** *"SSR is a pre-rendering technique that sends HTML + JS bundle to speed up First Contentful Paint. RSC is an architecture where components run exclusively on the server and stream a lightweight JSON-like format to the browser without contributing a single byte to the client JavaScript bundle."*

---

## 2. Hydration & Hydration Mismatch Errors (Topic 79)

### What is Hydration?
Hydration is the process where React in the browser attaches event listeners and state to the server-rendered HTML document, bringing the static page to life.

### ❌ The Common Hydration Mismatch Bug:
A hydration error occurs when the server-rendered HTML differs from the HTML produced on initial client render.

```jsx
// ❌ BROKEN: Server renders one time, client renders a later time!
function Timestamp() {
  return <span>{new Date().toLocaleTimeString()}</span>; // MISMATCH!
}

// ❌ BROKEN: Browser-only check inside render body
function UserAgent() {
  return <div>{typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'}</div>;
}
```

### ✅ Senior Solutions:
1. **Move client-only reads into `useEffect`:**
   ```jsx
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   if (!mounted) return null; // Safe: server and initial client render match!
   ```
2. **Suppress hydration warnings for intentional text differences:**
   `<span suppressHydrationWarning>{date}</span>`

---

## 3. The `'use client'` Directive & Composition Rules (Topics 93 & 94)

### What does `'use client'` actually mean?
`'use client'` does **NOT** mean *"render this only in the browser"*.  
It defines the **boundary** between the Server and Client component trees. Components marked with `'use client'` still pre-render into HTML on the server during initial load!

### ⚠️ The Golden Composition Rule:
> **You CANNOT directly import a Server Component into a Client Component!**  
> But you **CAN pass a Server Component as `children`** (or slot prop) into a Client Component!

```jsx
// ❌ WRONG: Importing Server Component into Client Component
'use client';
import ServerUserList from './ServerUserList'; // Forces ServerUserList into client bundle!

// ✅ SENIOR PATTERN: Composition via children
// app/page.js (Server Component)
import ClientModal from './ClientModal';
import ServerUserList from './ServerUserList';

export default function Page() {
  return (
    <ClientModal>
      {/* Runs on server, zero JS bundle sent for ServerUserList! */}
      <ServerUserList />
    </ClientModal>
  );
}
```

---

## 4. App Router Navigation, Layouts & Suspense (Topics 83, 84, 85, 86)

- **Layouts (`layout.js`)**: Shared UI across nested routes (`<Layout>{children}</Layout>`). Layouts **do not re-render** on route changes (preserving state!).
- **Template (`template.js`)**: Similar to layout, but creates a fresh instance and re-mounts on every navigation.
- **`<Link>` & `useRouter()`**: Client-side navigation with automatic prefetching of links in the viewport.
- **`<Image>` (`next/image`)**: Automatic WebP conversion, responsive resizing (`sizes`), lazy loading, and prevention of layout shift (CLS).
- **Streaming & Suspense (`loading.js`)**: Break down pages into chunks and stream them to the client as data becomes available:
  ```jsx
  <Suspense fallback={<SkeletonLoader />}>
    <SlowReviewsComponent />
  </Suspense>
  ```

---

## 5. Rendering Modes: Static, Dynamic, SSG & ISR (Topics 87, 88, 89, 90, 91)

| Mode | When it renders | How to trigger |
| :--- | :--- | :--- |
| **Static (SSG)** | At build time | Default for routes without dynamic functions |
| **DynamicParams** | Pre-renders dynamic paths at build | `generateStaticParams()` |
| **Dynamic (SSR)** | On every request | Using `cookies()`, `headers()`, or `noStore()` |
| **ISR (Incremental Static Regeneration)** | Cached; revalidates in background | `fetch(url, { next: { revalidate: 60 } })` |

### Manual Cache Revalidation (Topic 100):
Inside Server Actions or Route Handlers:
- `revalidatePath('/products')` $\rightarrow$ Purges cache for a specific route.
- `revalidateTag('collection-tag')` $\rightarrow$ Purges cache for requests tagged with that tag.

---

## 6. Server Actions & React 19 Action Hooks (Topics 99, 101, 102, 103)

### Server Actions (`'use server'`) (Topic 99):
Asynchronous functions executed on the server, callable directly from forms or client buttons without creating API routes manually:

```javascript
// app/actions.js
'use server';

export async function addComment(formData) {
  const text = formData.get('comment');
  await db.comments.create({ data: { text } });
  revalidatePath('/comments');
}
```

### Modern Action Hooks:

#### 1. `useTransition` (Topic 102):
Marks a state update or server action as non-blocking transition, providing `isPending`:
```jsx
const [isPending, startTransition] = useTransition();

const handleSave = () => {
  startTransition(async () => {
    await serverActionSave();
  });
};
```

#### 2. `useOptimistic` (Topic 103):
Instantly updates the UI before the server request completes. If the server action rejects or fails, React automatically rolls back to the previous state!
```jsx
const [optimisticComments, setOptimistic] = useOptimistic(
  comments,
  (current, newText) => [...current, { text: newText, sending: true }]
);
```

#### 3. `useFormStatus` (Topic 101):
Must be called from a component **nested inside a `<form>`** to read pending status without prop drilling:
```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Submit'}</button>;
}
```

---

## 7. Middleware & Route Handlers (Topics 95, 96, 97, 98)

- **Route Handlers (`app/api/.../route.js`)**: Full-stack REST endpoints export `GET(req)`, `POST(req)`.
- **Middleware (`middleware.js`)**: Runs before any request is completed. Operates at the edge:
  - Rewrites, redirects, header manipulation.
  - Protecting routes with auth tokens / NextAuth:
    ```javascript
    export { default } from 'next-auth/middleware';
    export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
    ```

---

## 🎯 Quick Interview Checklist for Module 13
1. **What is the difference between RSC and SSR?** $\rightarrow$ SSR generates initial HTML from client components and sends the full JS bundle for hydration; RSC runs exclusively on the server, sending 0 KB of client JavaScript.
2. **What causes a hydration error?** $\rightarrow$ A mismatch between the HTML generated on the server and the HTML produced on the initial client-side render (e.g., rendering current time or `window`).
3. **Can a Server Component be passed into a Client Component?** $\rightarrow$ Yes, but only as `children` or slot props, never by direct import.
4. **What does `useOptimistic` do?** $\rightarrow$ Instantly updates the client UI while a server action is in-flight and automatically reverts if an error occurs.
5. **How does ISR (Incremental Static Regeneration) work?** $\rightarrow$ Serves cached static pages instantly, then re-generates the page in the background after the `revalidate` interval expires.

