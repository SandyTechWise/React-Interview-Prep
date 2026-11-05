# Fullstack & Frontend Interview Master Guide

> **Core Domains**:  
> 1. **HTML & CSS** (Accessibility, Core Web Vitals, Layouts, Specificity, Browser Engine)  
> 2. **Next.js (App Router)** (RSC, SSR/ISR, Server Actions, Caching, Middleware)  
> 3. **Node.js & Nest.js** (Event Loop, Libuv, Streams, DI/IoC, Lifecycle Pipeline)

---

# Part 1: HTML & CSS Core

### Q1: What is the difference between `async` and `defer` in `<script>` tags?
* **Regular `<script>`**: Parsing pauses, fetches the script, executes it immediately, then resumes HTML parsing (blocks rendering).
* **`<script async>`**: Fetches the script asynchronously while HTML parsing continues. **Executes immediately upon download**, pausing HTML parsing. Script execution order is **not guaranteed**. (Use for independent analytics/ads).
* **`<script defer>`**: Fetches asynchronously while parsing continues. **Executes only after the full HTML document is parsed**, in the exact order they appear in markup. (Use for application bundles).

---

### Q2: What is the Critical Rendering Path?
The sequence of steps a browser takes to convert HTML, CSS, and JS into pixels on screen:
1. **DOM Construction**: HTML parsed into Document Object Model.
2. **CSSOM Construction**: CSS rules parsed into CSS Object Model.
3. **Render Tree**: Combining DOM + CSSOM (ignores `display: none` elements).
4. **Layout (Reflow)**: Calculates geometric position and size of every visible node.
5. **Paint**: Fills pixels with colors, borders, images, and text.
6. **Composite**: Stacks layers on GPU and renders the final screen.

---

### Q3: `box-sizing: content-box` vs `border-box`
* **`content-box` (Default)**: `width` and `height` apply only to the content. Adding padding and border expands the element beyond the specified width (`Total width = width + padding + border`).
* **`border-box` (Standard)**: `width` and `height` include content, padding, and border. Adding padding shrinks the content area instead of expanding element dimensions.

---

### Q4: How does CSS Specificity work?
Specificity determines which CSS rule wins when multiple rules target the same element:
1. **Inline styles**: `style="..."` (1000 points)
2. **IDs**: `#header` (100 points)
3. **Classes, Attributes, Pseudo-classes**: `.btn`, `[type="text"]`, `:hover` (10 points)
4. **Elements & Pseudo-elements**: `div`, `p`, `::before` (1 point)
5. **Universal selector (`*`)**: 0 points
> `!important` overrides normal specificity, but should be avoided as it breaks cascade maintainability.

---

### Q5: Flexbox vs CSS Grid: When to use which?
* **Flexbox (1-Dimensional)**: Best for content-first alignment along a single axis (row OR column). Ideal for navbars, button groups, vertical centering, and dynamic card rows.
* **CSS Grid (2-Dimensional)**: Best for layout-first alignment across rows AND columns simultaneously. Ideal for full-page dashboards, photo galleries, and complex magazine grids.

---

### Q6: What triggers a Layout (Reflow) vs a Paint vs a Composite?
* **Reflow (Most Expensive)**: Changing geometry/layout properties (`width`, `height`, `margin`, `padding`, `top`, `fontSize`). Forces browser to recalculate entire layout tree.
* **Paint**: Changing visual appearance without altering geometry (`color`, `background-color`, `visibility`, `box-shadow`).
* **Composite (Cheapest & GPU-accelerated)**: Changing properties handled by GPU layers (`transform: translate3d()`, `opacity`). Zero reflow, zero repaint!

---

### Q7: `localStorage` vs `sessionStorage` vs `Cookies`
| Feature | `localStorage` | `sessionStorage` | Cookies (`httpOnly`) |
| :--- | :--- | :--- | :--- |
| **Capacity** | ~5-10 MB | ~5 MB | ~4 KB |
| **Lifetime** | Persistent until manually cleared | Cleared on tab/window close | Configured via `Expires` / `Max-Age` |
| **Sent to Server?** | No (Client only) | No (Client only) | Automatically sent in HTTP headers |
| **Security** | Vulnerable to XSS | Vulnerable to XSS | `httpOnly` prevents XSS script access |

---

# Part 2: Next.js (App Router)

### Q8: What is the core difference between RSC (React Server Components) and SSR?
* **SSR (Server-Side Rendering)**: Generates initial HTML on the server and sends both HTML and the **full JavaScript bundle** to the client so React can hydrate it.
* **RSC (Server Components)**: Runs **only on the server**. They stream a serialized UI format to the browser and send **0 KB of client JavaScript**. They cannot use `useState` or browser event listeners.

---

### Q9: What does the `'use client'` directive actually do?
`'use client'` does **not** make a component render only in the browser. It marks the **boundary** where client interactivity is required. Components marked with `'use client'` are still pre-rendered into static HTML on the server during initial load, then hydrated in the browser.

---

### Q10: How do you pass a Server Component into a Client Component?
**Golden Rule:** You cannot directly *import* a Server Component into a Client Component. But you **can pass it as `children` or as a slot prop**:
```jsx
// app/page.js (Server Component)
import ClientWrapper from './ClientWrapper';
import HeavyServerReport from './HeavyServerReport';

export default function Page() {
  return (
    <ClientWrapper>
      <HeavyServerReport /> {/* Rendered on server, 0 KB client bundle! */}
    </ClientWrapper>
  );
}
```

---

### Q11: What is Incremental Static Regeneration (ISR)?
ISR allows you to update static pages in the background without rebuilding the entire site:
```javascript
// Re-fetches and updates cache every 60 seconds:
const res = await fetch('https://api.example.com/products', {
  next: { revalidate: 60 }
});
```
When a user visits after 60s, the cached page is served immediately (stale-while-revalidate), while Next.js triggers a background regeneration.

---

### Q12: How do Server Actions work and how do they handle security?
Server Actions are asynchronous functions tagged with `'use server'` that execute securely on the server.
* Invoked via forms (`<form action={myAction}>`) or buttons inside `startTransition`.
* Next.js automatically creates a secure POST endpoint behind the scenes.
* **Security:** Always authorize the user inside the Server Action and validate incoming inputs with schemas (e.g. **Zod**):
```javascript
'use server';
export async function deletePost(postId) {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
  await db.post.delete({ where: { id: postId, userId: session.user.id } });
  revalidatePath('/dashboard');
}
```

---

### Q13: Next.js App Router Caching Architecture (The 4 Caches)
1. **Request Memoization**: Deduplicates identical `fetch(url)` calls within a single render pass.
2. **Data Cache**: Persistent server cache across requests (`next: { revalidate: 3600 }`).
3. **Full Route Cache**: Caches static HTML and RSC payloads on the server at build time.
4. **Router Cache (Client-side)**: In-memory cache in the browser storing visited and prefetched route segments.

---

# Part 3: Node.js & Nest.js

### Q14: How does the Node.js Event Loop work?
Node.js is single-threaded using the **libuv** library for non-blocking asynchronous I/O.  
The Event Loop executes in phases:
1. **Timers**: Executes callbacks from `setTimeout()` and `setInterval()`.
2. **Pending Callbacks**: I/O callbacks deferred to the next loop iteration.
3. **Idle / Prepare**: Internal libuv housekeeping.
4. **Poll**: Retrieves new I/O events (network, disk reads); executes I/O callbacks.
5. **Check**: Executes `setImmediate()` callbacks.
6. **Close Callbacks**: Socket or handle close events (e.g. `socket.on('close')`).
> **Microtask Priority:** `process.nextTick()` runs immediately after the current operation finishes (before any other microtask), followed by Promise microtasks (`Promise.then`).

---

### Q15: `process.nextTick()` vs `setImmediate()`
* **`process.nextTick()`**: Fires immediately after the currently running operation, before the Event Loop continues to the next phase. (Heavy recursive nextTick will starve the event loop!).
* **`setImmediate()`**: Queued in the **Check phase** of the Event Loop, running on the subsequent tick after I/O polling.

---

### Q16: How do Streams handle Backpressure in Node.js?
Streams process data in chunks without loading the entire file into memory.
* **Backpressure** occurs when the `Readable` stream produces data faster than the `Writable` stream can write it.
* Calling `readable.pipe(writable)` automatically handles backpressure:
  - If `writable.write(chunk)` returns `false`, reading is paused.
  - When the write buffer drains, the `'drain'` event fires, resuming the readable stream.

---

### Q17: What is Dependency Injection (DI) and Inversion of Control (IoC) in Nest.js?
* **Inversion of Control**: Instead of a class instantiating its own dependencies (`const service = new UserService()`), control is inverted and handed to an external container.
* **Dependency Injection**: The design pattern Nest.js uses to supply dependencies to a class via its constructor:
```typescript
@Injectable()
export class UsersService { ... }

@Controller('users')
export class UsersController {
  // Nest IoC container injects UsersService automatically:
  constructor(private readonly usersService: UsersService) {}
}
```

---

### Q18: What is the exact execution order of the Nest.js Request Lifecycle?
When an incoming HTTP request hits a Nest.js application, it flows through this strict pipeline:
```
1. Global Middleware
   └── 2. Module Middleware
        └── 3. Global Guards
             └── 4. Controller / Route Guards (Auth)
                  └── 5. Global / Controller Interceptors (Pre-controller)
                       └── 6. Global / Route Pipes (DTO Validation & Transformation)
                            └── 7. Controller Route Handler (Business Logic)
                       └── 8. Interceptors (Post-controller / Response mapping)
9. Exception Filters (Catches any unhandled exceptions throughout the pipeline)
```

---

### Q19: How do Pipes and DTOs enforce data validation in Nest.js?
By pairing **Data Transfer Objects (DTOs)** with `class-validator` and the global `ValidationPipe`:
```typescript
// create-user.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// main.ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
```
* `whitelist: true`: Strips away any extra malicious properties not declared in the DTO.
* `forbidNonWhitelisted: true`: Throws a 400 Bad Request error if unknown fields are sent.

---

### Q20: What are Guards in Nest.js and how do they differ from Middleware?
* **Middleware**: Generic HTTP request handlers (e.g. logging, body parsing) that run *before* route handlers. They have no knowledge of which controller or method will handle the request.
* **Guards**: Have access to the `ExecutionContext`, meaning they know the exact controller class and handler function being invoked. They return a boolean (`true`/`false`) to determine if the request is permitted (used for JWT authentication and Role-Based Access Control).

---

## 🎯 Quick 30-Second Interview Cheatsheet

| Question | The 1-Line Answer |
| :--- | :--- |
| **`defer` vs `async`?** | `defer` preserves order and runs after DOM parsing; `async` runs immediately on download and order is random. |
| **CSS Reflow vs Repaint?** | Reflow recalculates layout geometry; Repaint updates pixels without geometry change. Use `transform` for GPU compositing. |
| **RSC vs SSR?** | SSR sends HTML + JS bundle for client hydration; RSC runs purely on the server sending 0 KB client JS. |
| **What is ISR?** | Static pages served from cache and regenerated in the background via `revalidate`. |
| **Node.js Single-Threaded?** | JS execution is single-threaded; asynchronous I/O and CPU tasks are offloaded to libuv thread pool. |
| **Nest.js Guard vs Middleware?** | Middleware handles generic requests before routing; Guards have `ExecutionContext` knowledge to enforce Auth/RBAC. |

