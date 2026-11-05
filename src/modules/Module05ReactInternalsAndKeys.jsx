import React, { useState } from 'react'
import styles from './Module05ReactInternalsAndKeys.module.css'

// Topic 25: Component Instance & Topic 30: Component Lifecycle
// Topic 27: Reset state with key Prop
function UserFeedbackForm({ user }) {
  // Topic 27: Local state inside child
  // When parent changes the `key` on this component, React destroys the previous instance and mounts a fresh one!
  const [draftNote, setDraftNote] = useState('')

  // Topic 8: Render phase logging (React calculates Virtual DOM here)
  console.log(`[Render Phase] Rendering UserFeedbackForm for: ${user.name}`)

  return (
    <div>
      <p style={{ margin: '0 0 6px 0', fontSize: '13px' }}>
        Editing feedback for: <strong>{user.name}</strong> ({user.role})
      </p>
      <input
        type="text"
        placeholder={`Write a confidential note for ${user.name}...`}
        value={draftNote}
        onChange={(e) => setDraftNote(e.target.value)}
        className={styles.inputField}
      />
      <div className={styles.infoBox}>
        Draft status: {draftNote ? `"${draftNote}"` : 'Empty (fresh state)'}
      </div>
    </div>
  )
}

export default function Module05ReactInternalsAndKeys() {
  const users = [
    { id: 'usr-1', name: 'Alice Walker', role: 'Frontend Architect' },
    { id: 'usr-2', name: 'Bob Roberts', role: 'DevOps Lead' },
  ]

  const [activeUserId, setActiveUserId] = useState('usr-1')
  const [useKeyReset, setUseKeyReset] = useState(true)

  // Topic 26: The key prop demonstration in dynamic lists
  const [tasks, setTasks] = useState([
    { id: 'task-1', title: 'Code review PR #42' },
    { id: 'task-2', title: 'Configure CI/CD Pipeline' },
  ])

  const activeUser = users.find((u) => u.id === activeUserId)

  // Topic 26: Prepending item to test reconciliation with stable keys
  const handlePrependTask = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: `Urgent Task #${tasks.length + 1}`,
    }
    setTasks((prev) => [newTask, ...prev])
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>React Internals, Keys & Lifecycle</h2>
      <p className={styles.subtitle}>
        Render vs commit, component instances, and the key prop superpower.
      </p>

      {/* Part 1: Resetting state with key */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 27: Reset State with Key Prop</span>
          <span className={styles.badge}>
            {useKeyReset ? 'key={activeUserId} (Clean Reset)' : 'No key (Sticky State Bug)'}
          </span>
        </div>

        <div className={styles.tabGroup}>
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setActiveUserId(u.id)}
              className={`${styles.tabButton} ${
                activeUserId === u.id ? styles.tabButtonActive : ''
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>

        {/* Topic 27: Passing key forces full unmount and state reset */}
        {useKeyReset ? (
          <UserFeedbackForm key={activeUser.id} user={activeUser} />
        ) : (
          <UserFeedbackForm user={activeUser} />
        )}

        <div style={{ marginTop: '12px' }}>
          <label style={{ fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              checked={useKeyReset}
              onChange={(e) => setUseKeyReset(e.target.checked)}
            />
            Enable key-based state reset (Uncheck to see draft note bleed into other user)
          </label>
        </div>
      </div>

      {/* Part 2: The key prop in dynamic lists */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 26: List Reconciliation with Unique Keys</span>
          <button
            type="button"
            onClick={handlePrependTask}
            className={styles.btnAction}
          >
            + Prepend Task
          </button>
        </div>

        <div className={styles.itemList}>
          {tasks.map((task) => (
            // Topic 26: Stable unique ID key (never index when reordering or prepending)
            <div key={task.id} className={styles.itemRow}>
              <span>{task.title}</span>
              <code style={{ fontSize: '11px', color: '#888' }}>key: {task.id}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

