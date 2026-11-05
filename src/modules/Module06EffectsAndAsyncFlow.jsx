import React, { useState, useEffect } from 'react'
import styles from './Module06EffectsAndAsyncFlow.module.css'

// Topic 40: Fake API simulator supporting AbortSignal
function fakeFetchUsers(category, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (category === 'error') {
        reject(new Error('Simulated 500: Failed to fetch users from server'))
      } else {
        const data = [
          { id: 1, name: 'Ada Lovelace', category: 'engineers', role: 'Algorithm Pioneer' },
          { id: 2, name: 'Alan Turing', category: 'engineers', role: 'Computing Visionary' },
          { id: 3, name: 'Grace Hopper', category: 'designers', role: 'Compiler Architect' },
          { id: 4, name: 'Margaret Hamilton', category: 'designers', role: 'Apollo Flight Software' },
        ]
        const filtered =
          category === 'all' ? data : data.filter((d) => d.category === category)
        resolve(filtered)
      }
    }, 600)

    // Topic 31: Abort listener for effect cleanup
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('Request aborted by cleanup', 'AbortError'))
    })
  })
}

export default function Module06EffectsAndAsyncFlow() {
  // Topic 34: Rules of Hooks (Always top-level, never inside loops/conditions)

  // Topic 35: Lazy Initial State (Callback runs ONCE on initial mount, not on every render)
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return 'all'
  })

  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [cleanupLog, setCleanupLog] = useState('No cleanup executed yet')

  // Topic 31 & Topic 32: useEffect with Async function & Cleanup function
  useEffect(() => {
    // Topic 31: AbortController handles race conditions and unmounts
    const controller = new AbortController()

    // Topic 32: Async function declared inside the effect (never make the effect callback itself async!)
    async function loadData() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        // Topic 33: Handling errors in React async operations
        const result = await fakeFetchUsers(selectedCategory, controller.signal)
        setUsers(result)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setErrorMessage(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    // Topic 31: Cleanup function runs before effect re-runs AND on component unmount
    return () => {
      controller.abort()
      setCleanupLog(`Cleanup executed for category: [${selectedCategory}] at ${new Date().toLocaleTimeString()}`)
    }
  }, [selectedCategory]) // Effect re-runs only when selectedCategory changes

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Effects, Async & Lifecycle Flow</h2>
      <p className={styles.subtitle}>
        Managing side effects, async data fetching, cancellation, and error states.
      </p>

      <div className={styles.card}>
        <div className={styles.controlsRow}>
          <label htmlFor="categorySelect" style={{ fontSize: '13px', fontWeight: 500 }}>
            Filter Category:
          </label>
          <select
            id="categorySelect"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.selectField}
          >
            <option value="all">All Roles</option>
            <option value="engineers">Engineers Only</option>
            <option value="designers">Designers Only</option>
            <option value="error">Simulate Server Error</option>
          </select>
        </div>

        {/* Topic 33: Error State Feedback */}
        {errorMessage && (
          <div className={`${styles.statusMessage} ${styles.statusError}`}>
            <span>⚠️ {errorMessage}</span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={styles.btnRefetch}
            >
              Reset to All
            </button>
          </div>
        )}

        {/* Loading State Feedback */}
        {isLoading && (
          <div className={`${styles.statusMessage} ${styles.statusLoading}`}>
            Fetching data for category "{selectedCategory}"...
          </div>
        )}

        {/* Data List Display */}
        {!isLoading && !errorMessage && (
          <ul className={styles.dataList}>
            {users.map((user) => (
              <li key={user.id} className={styles.dataItem}>
                <span style={{ fontWeight: 500 }}>{user.name}</span>
                <span className={styles.itemRole}>{user.role}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Topic 31: Real-time Cleanup Activity Monitor */}
        <div className={styles.logBox}>
          <strong>Effect Cleanup Monitor:</strong>
          <div>{cleanupLog}</div>
        </div>
      </div>
    </div>
  )
}

