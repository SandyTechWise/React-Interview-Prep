import React, { useState } from 'react'
import styles from './Module03StateAndEvents.module.css'

// Topic 15: State vs Props (CartItem receives data and callbacks as read-only props)
function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <div className={styles.itemRow}>
      <div className={styles.itemInfo}>
        <span className={styles.itemName}>{item.name}</span>
        <span className={styles.itemPrice}>${item.price.toFixed(2)} each</span>
      </div>

      <div className={styles.quantityControls}>
        {/* Topic 11: Events (SyntheticEvent with callback parameter) */}
        <button
          type="button"
          onClick={() => onDecrement(item.id)}
          className={styles.btnSmall}
        >
          -
        </button>
        <span className={styles.qtyText}>{item.qty}</span>
        <button
          type="button"
          onClick={() => onIncrement(item.id)}
          className={styles.btnSmall}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className={styles.btnDelete}
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function Module03StateAndEvents() {
  // Topic 12: useState (Local state management)
  const [items, setItems] = useState([
    { id: 1, name: 'React 18 Handbook', price: 29.99, qty: 1 },
    { id: 2, name: 'TypeScript Guide', price: 19.99, qty: 2 },
  ])
  const [discount, setDiscount] = useState(0)
  const [batchStatus, setBatchStatus] = useState('Idle')

  // Topic 18: Derived State (Computed on the fly during render, no redundant useState)
  const totalItemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const grandTotal = Math.max(0, subtotal - discount)

  // Topic 17: Immutable Data (Updating object inside array via .map)
  const handleIncrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    )
  }

  // Topic 17: Immutable Data (Conditional update and decrement)
  const handleDecrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
      )
    )
  }

  // Topic 17: Immutable Data (Removing item via .filter)
  const handleRemove = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Topic 17: Immutable Data (Adding item via array spread [...prev])
  const handleAddItem = () => {
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
    const newItem = {
      id: nextId,
      name: `Bonus Course #${nextId}`,
      price: 15.0,
      qty: 1,
    }
    // Topic 12: Functional state update (always use callback when depending on previous state)
    setItems((prev) => [...prev, newItem])
  }

  // Topic 29: State update batching (React 18 automatically batches even in async / setTimeout)
  const handleApplyPromoAndReset = () => {
    setBatchStatus('Processing promo in async...')
    setTimeout(() => {
      // Both state updates are batched together into a single re-render in React 18
      setDiscount(10)
      setBatchStatus('Promo Applied ($10 off)!')
    }, 400)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>State, Events & Immutability</h2>
      <p className={styles.subtitle}>
        Managing dynamic data, derived state, and immutable updates.
      </p>

      <div className={styles.card}>
        {items.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onRemove={handleRemove}
            />
          ))
        )}

        <div className={styles.actionsBar}>
          <button
            type="button"
            onClick={handleAddItem}
            className={styles.btnPrimary}
          >
            + Add Course
          </button>
          <button
            type="button"
            onClick={handleApplyPromoAndReset}
            className={styles.btnSecondary}
          >
            Apply $10 Promo (Async Batch)
          </button>
        </div>

        {/* Displaying Derived State */}
        <div className={styles.summaryBox}>
          <div className={styles.summaryLine}>
            <span>Total Units:</span>
            <span>{totalItemCount}</span>
          </div>
          <div className={styles.summaryLine}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className={styles.summaryLine} style={{ color: '#137333' }}>
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className={styles.summaryLineTotal}>
            <span>Grand Total:</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {batchStatus !== 'Idle' && (
          <span className={styles.batchBadge}>{batchStatus}</span>
        )}
      </div>
    </div>
  )
}

