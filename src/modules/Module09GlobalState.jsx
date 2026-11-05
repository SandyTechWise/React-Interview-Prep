import React, { createContext, useContext, useReducer } from 'react'
import styles from './Module09GlobalState.module.css'

// ----------------------------------------------------------------------------
// Topic 48: Context API - Step 1: Create Context
// ----------------------------------------------------------------------------
const AuthContext = createContext(null)

// ----------------------------------------------------------------------------
// Topic 51: Context combined with useReducer (State machine for Global State)
// ----------------------------------------------------------------------------
const INITIAL_AUTH_STATE = {
  user: null,
  isAuthenticated: false,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      }
    case 'LOGOUT':
      return INITIAL_AUTH_STATE
    default:
      return state
  }
}

// ----------------------------------------------------------------------------
// Topic 49: Custom Provider Component
// ----------------------------------------------------------------------------
export function AuthProvider({ children }) {
  const [authState, dispatch] = useReducer(authReducer, INITIAL_AUTH_STATE)

  const login = (userData) => {
    dispatch({ type: 'LOGIN', payload: userData })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  // Topic 48: Providing state and actions to all children
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// Topic 49: Custom Hook with Safety Guard (Throws error if used outside Provider)
// ----------------------------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}

// ----------------------------------------------------------------------------
// Consumer Child Component (Consumes Context anywhere in the subtree)
// ----------------------------------------------------------------------------
function UserProfileCard() {
  // Topic 48: Consuming Context via custom hook
  const { authState, login, logout } = useAuth()

  const handleDemoLogin = () => {
    login({
      id: 'usr-901',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'Staff Engineer',
    })
  }

  return (
    <div className={styles.card}>
      <div className={styles.sectionTitle}>
        <span>Topic 48, 49 & 51: AuthContext + useReducer</span>
        <span
          className={`${styles.badge} ${
            authState.isAuthenticated ? styles.badgeAuth : styles.badgeGuest
          }`}
        >
          {authState.isAuthenticated ? 'Authenticated' : 'Guest'}
        </span>
      </div>

      <div className={styles.userCard}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>
            {authState.isAuthenticated ? authState.user.name : 'Not Signed In'}
          </span>
          <span className={styles.userEmail}>
            {authState.isAuthenticated
              ? `${authState.user.email} • ${authState.user.role}`
              : 'Sign in to access protected global state'}
          </span>
        </div>

        <div className={styles.buttonGroup}>
          {!authState.isAuthenticated ? (
            <button
              type="button"
              onClick={handleDemoLogin}
              className={styles.btnPrimary}
            >
              Sign In Demo User
            </button>
          ) : (
            <button
              type="button"
              onClick={logout}
              className={styles.btnSecondary}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------------------------------
// Main Module 9 Component
// ----------------------------------------------------------------------------
export default function Module09GlobalState() {
  return (
    <AuthProvider>
      <div className={styles.container}>
        <h2 className={styles.heading}>Global State: Context API & Redux</h2>
        <p className={styles.subtitle}>
          Application-wide state management, custom providers, and RTK comparison.
        </p>

        {/* Live Context API Consumer */}
        <UserProfileCard />

        {/* Topic 67: Redux vs Context API Architecture Reference */}
        <div className={styles.card}>
          <div className={styles.sectionTitle}>
            <span>Topic 67: Context API vs Redux Toolkit (RTK)</span>
            <span className={styles.badge} style={{ background: '#e8f0fe', color: '#1a73e8' }}>
              Interview Matrix
            </span>
          </div>

          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Context API</th>
                <th>Redux Toolkit (RTK)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Primary Purpose</strong></td>
                <td>Dependency injection / passing data down</td>
                <td>Global state management & caching</td>
              </tr>
              <tr>
                <td><strong>Update Frequency</strong></td>
                <td>Low-frequency (Auth, Theme, Locale)</td>
                <td>High-frequency & complex data flows</td>
              </tr>
              <tr>
                <td><strong>Re-render Scope</strong></td>
                <td>Re-renders <em>all</em> consumers of the context</td>
                <td>Selective re-rendering via <code>useSelector</code></td>
              </tr>
              <tr>
                <td><strong>DevTools & Tracing</strong></td>
                <td>Basic React DevTools</td>
                <td>Time-travel Redux DevTools & action log</td>
              </tr>
              <tr>
                <td><strong>Setup Overhead</strong></td>
                <td>Zero dependencies, built-in</td>
                <td>Requires <code>@reduxjs/toolkit</code> & <code>react-redux</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AuthProvider>
  )
}

