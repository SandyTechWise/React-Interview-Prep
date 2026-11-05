import React, { useReducer, useState, useEffect } from 'react'
import styles from './Module08ComplexStateAndCustomHooks.module.css'

// ----------------------------------------------------------------------------
// Topic 38: Custom Hook (starts with 'use', encapsulates state + effect)
// ----------------------------------------------------------------------------
function useLocalStorageState(key, defaultValue) {
  // Topic 35 (recap): Lazy state initialization with localStorage
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  // Synchronizing state with localStorage whenever value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error('Failed to save to localStorage:', err)
    }
  }, [key, value])

  return [value, setValue]
}

// ----------------------------------------------------------------------------
// Topic 39: useReducer (Reducer pure function: (state, action) => nextState)
// ----------------------------------------------------------------------------
const INITIAL_ACCOUNT_STATE = {
  balance: 0,
  loan: 0,
  isActive: false,
  error: null,
}

function bankReducer(state, action) {
  switch (action.type) {
    case 'OPEN_ACCOUNT':
      return {
        ...state,
        balance: 500,
        isActive: true,
        error: null,
      }

    case 'DEPOSIT':
      return {
        ...state,
        balance: state.balance + action.payload,
        error: null,
      }

    case 'WITHDRAW':
      if (state.balance < action.payload) {
        return { ...state, error: 'Insufficient funds for withdrawal!' }
      }
      return {
        ...state,
        balance: state.balance - action.payload,
        error: null,
      }

    case 'REQUEST_LOAN':
      if (state.loan > 0) {
        return { ...state, error: 'You already have an active loan to pay first!' }
      }
      return {
        ...state,
        loan: action.payload,
        balance: state.balance + action.payload,
        error: null,
      }

    case 'PAY_LOAN':
      if (state.balance < state.loan) {
        return { ...state, error: 'Not enough balance to pay off the entire loan!' }
      }
      return {
        ...state,
        balance: state.balance - state.loan,
        loan: 0,
        error: null,
      }

    case 'CLOSE_ACCOUNT':
      if (state.balance > 0 || state.loan > 0) {
        return {
          ...state,
          error: 'Cannot close account: Balance must be $0 and loan must be paid off!',
        }
      }
      return INITIAL_ACCOUNT_STATE

    default:
      return state
  }
}

// ----------------------------------------------------------------------------
// Main Module 8 Component
// ----------------------------------------------------------------------------
export default function Module08ComplexStateAndCustomHooks() {
  // Topic 38: Consuming our Custom Hook
  const [accountTag, setAccountTag] = useLocalStorageState('acc_tag', 'Primary Wallet')

  // Topic 39: useReducer Hook
  const [account, dispatch] = useReducer(bankReducer, INITIAL_ACCOUNT_STATE)

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Complex State & Custom Hooks</h2>
      <p className={styles.subtitle}>
        State machines with useReducer and logic reuse with Custom Hooks.
      </p>

      {/* Part 1: Topic 38 - Custom Hook Demonstration */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 38: Custom Hook (useLocalStorageState)</span>
          <span className={`${styles.badge} ${styles.badgeActive}`}>Persistent</span>
        </div>

        <label style={{ fontSize: '12px', color: '#5f6368' }}>
          Wallet Label (persisted in localStorage automatically):
        </label>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={accountTag}
            onChange={(e) => setAccountTag(e.target.value)}
            className={styles.inputField}
          />
        </div>
      </div>

      {/* Part 2: Topic 39 & Topic 41 - useReducer State Machine */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>
            Topic 39 & 41: Bank Account ({accountTag})
          </span>
          <span
            className={`${styles.badge} ${
              account.isActive ? styles.badgeActive : styles.badgeInactive
            }`}
          >
            {account.isActive ? 'Active' : 'Closed'}
          </span>
        </div>

        {/* Error Feedback */}
        {account.error && (
          <div className={styles.errorBanner}>⚠️ {account.error}</div>
        )}

        {/* Account Metrics */}
        <div className={styles.metricsRow}>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Balance</span>
            <span className={styles.metricValue}>${account.balance}</span>
          </div>
          <div className={styles.metricBox}>
            <span className={styles.metricLabel}>Active Loan</span>
            <span className={styles.metricValue}>${account.loan}</span>
          </div>
        </div>

        {/* Action Buttons Dispatching Events to Reducer */}
        <div className={styles.btnGrid}>
          <button
            type="button"
            disabled={account.isActive}
            onClick={() => dispatch({ type: 'OPEN_ACCOUNT' })}
            className={`${styles.btnAction} ${styles.btnPrimary}`}
          >
            Open Account ($500)
          </button>

          <button
            type="button"
            disabled={!account.isActive}
            onClick={() => dispatch({ type: 'CLOSE_ACCOUNT' })}
            className={styles.btnAction}
          >
            Close Account
          </button>

          <button
            type="button"
            disabled={!account.isActive}
            onClick={() => dispatch({ type: 'DEPOSIT', payload: 150 })}
            className={styles.btnAction}
          >
            Deposit $150
          </button>

          <button
            type="button"
            disabled={!account.isActive}
            onClick={() => dispatch({ type: 'WITHDRAW', payload: 100 })}
            className={styles.btnAction}
          >
            Withdraw $100
          </button>

          <button
            type="button"
            disabled={!account.isActive}
            onClick={() => dispatch({ type: 'REQUEST_LOAN', payload: 1000 })}
            className={styles.btnAction}
          >
            Request $1,000 Loan
          </button>

          <button
            type="button"
            disabled={!account.isActive || account.loan === 0}
            onClick={() => dispatch({ type: 'PAY_LOAN' })}
            className={styles.btnAction}
          >
            Pay Loan (${account.loan})
          </button>
        </div>
      </div>
    </div>
  )
}

