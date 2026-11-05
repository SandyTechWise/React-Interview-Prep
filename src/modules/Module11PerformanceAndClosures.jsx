import React, { useState, useMemo, useCallback, useEffect, memo } from 'react'
import styles from './Module11PerformanceAndClosures.module.css'

// ----------------------------------------------------------------------------
// Topic 56: Helper Functions (Pure utilities placed OUTSIDE component scope)
// ----------------------------------------------------------------------------
function heavyCalculation(num) {
  let result = 1
  for (let i = 1; i <= num * 100000; i++) {
    result = (result + i) % 1000000
  }
  return result
}

function formatTimestamp(date) {
  return date.toLocaleTimeString()
}

// ----------------------------------------------------------------------------
// Topic 54: React.memo (Skips re-rendering if props have not changed shallowly)
// ----------------------------------------------------------------------------
const MemoizedChild = memo(function MemoizedChild({ onAction, label }) {
  console.log('[Child Rendered] MemoizedChild executed!')

  return (
    <div className={styles.childBox}>
      <span style={{ fontSize: '13px', fontWeight: 600 }}>
        Child Component: {label}
      </span>
      <p style={{ margin: '4px 0 10px 0', fontSize: '12px', color: '#5f6368' }}>
        Check browser console — if onAction reference is stable, this child does NOT re-render!
      </p>
      <button type="button" onClick={onAction} className={styles.btnSecondary}>
        Trigger Child Callback
      </button>
    </div>
  )
})

// ----------------------------------------------------------------------------
// Main Module 11 Component
// ----------------------------------------------------------------------------
export default function Module11PerformanceAndClosures() {
  const [parentCount, setParentCount] = useState(0)
  const [numberInput, setNumberInput] = useState(25)
  const [useCallbackEnabled, setUseCallbackEnabled] = useState(true)

  // Stale Closure Demonstration States
  const [staleTimer, setStaleTimer] = useState(0)
  const [correctTimer, setCorrectTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // --------------------------------------------------------------------------
  // Topic 55: useMemo (Caches the RESULT of an expensive calculation)
  // --------------------------------------------------------------------------
  const calculatedValue = useMemo(() => {
    return heavyCalculation(numberInput)
  }, [numberInput]) // Only recalculates when numberInput changes, not on parentCount change!

  // --------------------------------------------------------------------------
  // Topic 55: useCallback (Caches the FUNCTION REFERENCE across renders)
  // --------------------------------------------------------------------------
  const memoizedCallback = useCallback(() => {
    alert(`Action executed from stable callback! Parent count is: ${parentCount}`)
  }, [parentCount])

  // Unstable inline callback recreated on every render
  const unstableCallback = () => {
    alert(`Action from unstable callback! Parent count: ${parentCount}`)
  }

  const activeCallback = useCallbackEnabled ? memoizedCallback : unstableCallback

  // --------------------------------------------------------------------------
  // Topic 57: Closures & Stale Closure Traps in Timers
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isTimerRunning) return

    const intervalId = setInterval(() => {
      // ❌ STALE CLOSURE TRAP: Captures 'staleTimer' value at effect mount time!
      // staleTimer is frozen at 0 inside this closure!
      setStaleTimer(staleTimer + 1)

      // ✅ SENIOR PATTERN: Functional update always reads the freshest state from React
      setCorrectTimer((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isTimerRunning]) // Note: staleTimer is omitted intentionally to show the bug!

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Performance Optimization & Closures</h2>
      <p className={styles.subtitle}>
        React.memo, useMemo, useCallback, and escaping stale closure traps.
      </p>

      {/* Part 1: Topic 55 - useMemo for Expensive Calculations */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 55: useMemo (Heavy Calculation Cache)</span>
          <span className={`${styles.badge} ${styles.badgeMemo}`}>useMemo</span>
        </div>

        <div className={styles.gridTwo}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Number Multiplier</span>
            <span className={styles.statValue}>{numberInput}</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Computed Result</span>
            <span className={styles.statValue}>{calculatedValue}</span>
          </div>
        </div>

        <div className={styles.btnGroup}>
          <button
            type="button"
            onClick={() => setNumberInput((n) => n + 5)}
            className={styles.btnPrimary}
          >
            Increase Number (+5)
          </button>
          <button
            type="button"
            onClick={() => setParentCount((c) => c + 1)}
            className={styles.btnSecondary}
          >
            Re-render Parent (Count: {parentCount})
          </button>
        </div>
        <div className={styles.infoBox}>
          Clicking "Re-render Parent" updates state without re-running the heavy calculation,
          thanks to <code>useMemo</code>!
        </div>
      </div>

      {/* Part 2: Topic 54 & 55 - React.memo + useCallback */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 54 & 55: React.memo & useCallback Pairing</span>
          <span
            className={`${styles.badge} ${
              useCallbackEnabled ? styles.badgeMemo : styles.badgeWarning
            }`}
          >
            {useCallbackEnabled ? 'useCallback Active' : 'Unstable Function Prop'}
          </span>
        </div>

        <label style={{ fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            checked={useCallbackEnabled}
            onChange={(e) => setUseCallbackEnabled(e.target.checked)}
          />
          Enable <code>useCallback</code> for child prop (uncheck to break React.memo!)
        </label>

        {/* Passing callback to memoized child */}
        <MemoizedChild
          label="Profile Actions"
          onAction={activeCallback}
        />
      </div>

      {/* Part 3: Topic 57 - Stale Closure Demonstration */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 57: Closures & Stale State in Timers</span>
          <span className={`${styles.badge} ${styles.badgeWarning}`}>Closure Trap</span>
        </div>

        <div className={styles.gridTwo}>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Buggy (Stale Closure: count + 1)</span>
            <span className={styles.statValue} style={{ color: '#c5221f' }}>
              {staleTimer}s
            </span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Fixed (Functional: prev =&gt; prev + 1)</span>
            <span className={styles.statValue} style={{ color: '#137333' }}>
              {correctTimer}s
            </span>
          </div>
        </div>

        <div className={styles.btnGroup}>
          <button
            type="button"
            onClick={() => setIsTimerRunning((r) => !r)}
            className={styles.btnPrimary}
          >
            {isTimerRunning ? 'Stop Interval' : 'Start Interval'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStaleTimer(0)
              setCorrectTimer(0)
            }}
            className={styles.btnSecondary}
          >
            Reset Timers
          </button>
        </div>

        <div className={styles.infoBox}>
          Notice how the buggy timer freezes at 1s! The callback formed a closure over{' '}
          <code>staleTimer = 0</code> on mount and never saw newer values. The fixed timer uses{' '}
          <code>prev =&gt; prev + 1</code>.
        </div>
      </div>
    </div>
  )
}

