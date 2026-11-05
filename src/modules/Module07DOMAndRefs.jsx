import React, { useState, useRef, useEffect } from 'react'
import styles from './Module07DOMAndRefs.module.css'

export default function Module07DOMAndRefs() {
  // Topic 36: useRef for DOM element access
  const inputRef = useRef(null)

  // Topic 37: useRef as a mutable variable that persists WITHOUT triggering re-render
  const timerRef = useRef(null)
  const renderCountRef = useRef(1)

  // Tracking previous values
  const prevKeystrokeRef = useRef('')
  const prevSubmittedQueryRef = useRef('')

  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  // Topic 37: Tracking render count without triggering infinite re-renders
  useEffect(() => {
    renderCountRef.current += 1
  })

  // Topic 37: Tracking previous keystroke
  useEffect(() => {
    prevKeystrokeRef.current = query
  }, [query])

  // Topic 37: Tracking previous submitted search
  useEffect(() => {
    prevSubmittedQueryRef.current = submittedQuery
  }, [submittedQuery])

  // Topic 36: Imperative DOM method invocation (.focus())
  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setSubmittedQuery(query)
  }

  // Topic 37: Storing interval ID in a ref
  const handleStartTimer = () => {
    if (isRunning) return
    setIsRunning(true)
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)
  }

  const handleStopTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setIsRunning(false)
  }

  const handleResetTimer = () => {
    handleStopTimer()
    setSeconds(0)
  }

  // Topic 37: Always clean up timer refs on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>DOM Access & Mutable Refs</h2>
      <p className={styles.subtitle}>
        Accessing native DOM nodes and storing mutable variables without triggering re-renders.
      </p>

      {/* Part 1: Topic 36 - DOM Element Selection & Previous Value Tracking */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 36 & 37: DOM Access & Tracking Previous State</span>
          <span className={styles.badge}>useRef + useEffect</span>
        </div>

        <form onSubmit={handleSearchSubmit} className={styles.inputGroup}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type and click Search (e.g. 'React')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.inputField}
          />
          <button type="submit" className={styles.btnPrimary}>
            Search
          </button>
          <button
            type="button"
            onClick={handleFocusInput}
            className={styles.btnSecondary}
          >
            Focus
          </button>
        </form>

        <div className={styles.infoBox}>
          <div>
            <strong>1. Submitted Search Tracking:</strong>
            <br />
            Current Search: <strong>{submittedQuery || '(none yet)'}</strong> | Previous Search:{' '}
            <strong>{prevSubmittedQueryRef.current || '(none yet)'}</strong>
          </div>
          <div style={{ marginTop: '8px', borderTop: '1px solid #e0e0e0', paddingTop: '6px' }}>
            <strong>2. Live Keystroke Tracking:</strong>
            <br />
            Current Input: <code>"{query}"</code> | Previous Keystroke:{' '}
            <code>"{prevKeystrokeRef.current}"</code>
          </div>
        </div>
      </div>

      {/* Part 2: Topic 37 - Storing Mutable Values (Timer ID) */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 37: Mutable Variables Without Re-renders</span>
          <span className={styles.badge}>Persistent Reference</span>
        </div>

        <div className={styles.timerDisplay}>
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:
          {String(seconds % 60).padStart(2, '0')}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStartTimer}
              className={styles.btnPrimary}
            >
              Start Timer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopTimer}
              className={styles.btnSecondary}
            >
              Pause Timer
            </button>
          )}
          <button
            type="button"
            onClick={handleResetTimer}
            className={styles.btnSecondary}
          >
            Reset
          </button>
        </div>

        <div className={styles.infoBox} style={{ marginTop: '12px' }}>
          Component Render Count: <strong>{renderCountRef.current}</strong> (updated via ref
          without causing extra renders).
        </div>
      </div>
    </div>
  )
}
