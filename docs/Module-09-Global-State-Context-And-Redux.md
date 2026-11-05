# Module 09: Global State Management (Context API & Redux Toolkit)

> **Reference Topics**: 48, 49, 51, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67  
> **Code Implementation**: [`test/src/modules/Module09GlobalState.jsx`](../src/modules/Module09GlobalState.jsx)

---

## 1. Context API Core (Topic 48)

The Context API provides a way to pass data through the component tree without having to pass props down manually at every level.

### The 3 Steps of Context:
1. **Create the Context:**
   ```jsx
   const ThemeContext = createContext('light');
   ```
2. **Provide the Context:**
   ```jsx
   <ThemeContext.Provider value={theme}>
     <App />
   </ThemeContext.Provider>
   ```
3. **Consume the Context:**
   ```jsx
   const theme = useContext(ThemeContext);
   ```

---

## 2. The Senior Custom Provider & Hook Pattern (Topic 49)

In production apps, never export the raw Context object directly! Instead, encapsulate it into a **Custom Provider** and a **Custom Hook with a Safety Guard**:

```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ SENIOR PATTERN: Custom hook that enforces proper usage inside the tree
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}
```

---

## 3. Context API + `useReducer` Architecture (Topic 51)

For medium-sized applications that don't need external libraries like Redux, combining **Context API with `useReducer`** provides a complete, scalable global state solution:

```jsx
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
```
* **Benefit:** Any deeply nested component can dispatch actions (`dispatch({ type: 'ADD_ITEM', payload })`) without passing callback props down!

---

## 4. Redux Core & Redux Toolkit (RTK) (Topics 58–66)

### Legacy Redux vs Modern Redux Toolkit (RTK)
| Legacy Redux (Avoid in new code) | Redux Toolkit (RTK - Modern Standard) |
| :--- | :--- |
| Hand-written action types (`const ADD = 'ADD'`) | Auto-generated action creators |
| Verbose `switch-case` reducers | `createSlice({ name, initialState, reducers })` |
| Manual immutable spread (`{ ...state, a: { ...state.a } }`) | **Immer built-in**: mutate directly (`state.count++`) |
| Complex middleware & devtools wiring | `configureStore()` sets up Thunks & DevTools automatically |

### Modern RTK Slice Example:
```javascript
import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';

// Topic 64 & 65: Async Thunk for API Calls
export const fetchUser = createAsyncThunk('user/fetch', async (userId) => {
  const res = await fetch(`/api/users/${userId}`);
  return res.json();
});

// Topic 62: State Slice
const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle' },
  reducers: {
    logout(state) {
      // Immer allows direct "mutations" safely!
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      });
  },
});

export const { logout } = userSlice.actions; // Topic 61: Action Creators
export const store = configureStore({ reducer: { user: userSlice.reducer } }); // Topic 60: Store
```

---

## 5. Context API vs Redux Toolkit: When to Use Which? (Topic 67)

### 💡 The #1 State Management Interview Question:
> **Interviewer:** *"Is Redux dead? Why not just use Context API for everything?"*  
> **Senior Answer:**  
> *"No, Redux is not dead. They solve different problems:  
> 1. **Context API is a Dependency Injection mechanism**, not a state management library. Whenever a Context value changes, **every single component that consumes that context re-renders**, even if it only uses one unrelated property.  
> 2. **Redux Toolkit is a dedicated state engine** that provides **granular selectors** (`useSelector(state => state.user.name)`). A component only re-renders if its selected slice of state changes.  
> 3. Therefore:  
>    - **Use Context API** for low-frequency global values (Authenticated User, UI Theme, Language).  
>    - **Use Redux Toolkit (or Zustand / TanStack Query)** for high-frequency, complex relational data, large teams, and apps requiring advanced middleware and time-travel debugging."*

---

## 🎯 Quick Interview Checklist for Module 9
1. **What are the 3 parts of the Context API?** $\rightarrow$ `createContext`, `<Context.Provider value={...}>`, and `useContext(Context)`.
2. **Why wrap Context in a custom hook (`useAuth`)?** $\rightarrow$ Encapsulates null-checking, throws a descriptive error if called outside the Provider, and improves code ergonomics.
3. **Why can Context API cause performance issues in large apps?** $\rightarrow$ Because it lacks selective re-rendering; any change to the provider's `value` triggers a re-render in all consuming components.
4. **How does Redux Toolkit eliminate immutable boilerplate?** $\rightarrow$ It integrates Immer under the hood, allowing developers to write mutating code (`state.user = action.payload`) which is safely converted into immutable updates.
5. **What is a Redux Thunk?** $\rightarrow$ Middleware that allows action creators to return a function instead of a plain action object, enabling asynchronous operations (like API calls) before dispatching.

