import React, { useState, useTransition, useOptimistic } from 'react'
import styles from './Module13NextAndModernFullStack.module.css'

// ----------------------------------------------------------------------------
// Topic 99: Simulated Server Action (Async database write with delay)
// ----------------------------------------------------------------------------
async function fakeServerActionAddComment(text) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (text.toLowerCase().includes('fail')) {
    throw new Error('Server action failed: Transaction reverted by database!')
  }

  return {
    id: `srv-${Date.now()}`,
    text,
    sending: false,
    timestamp: new Date().toLocaleTimeString(),
  }
}

// ----------------------------------------------------------------------------
// Topic 93: Server Component in Client Component (Composition via children)
// ----------------------------------------------------------------------------
function ClientCardBoundary({ title, children }) {
  // 'use client' boundary: Has client-side interactivity
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className={styles.boundaryBox}>
      <div className={styles.boundaryHeader}>
        <span>'use client' Boundary: {title}</span>
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          style={{ fontSize: '11px', cursor: 'pointer', background: 'none', border: 'none', color: '#1a73e8' }}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {/* Topic 93: Children passed from a Server Component run on the server! */}
      {isExpanded && children}
    </div>
  )
}

function ServerComponentContent() {
  // Simulated Server Component (runs on server, sends zero JS bundle to client)
  return (
    <div style={{ fontSize: '12px', color: '#333' }}>
      🔒 <strong>Server-Rendered Content:</strong> Rendered directly on the server with
      direct database access. Zero client-side JavaScript sent for this component!
    </div>
  )
}

// ----------------------------------------------------------------------------
// Main Module 13 Component
// ----------------------------------------------------------------------------
export default function Module13NextAndModernFullStack() {
  const [comments, setComments] = useState([
    { id: 'c1', text: 'SSR generates initial HTML for fast First Contentful Paint.', sending: false },
    { id: 'c2', text: 'RSC streams component HTML with zero client JavaScript bundle.', sending: false },
  ])
  const [inputText, setInputText] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  // --------------------------------------------------------------------------
  // Topic 102: useTransition Hook (Keeps UI responsive during async operations)
  // --------------------------------------------------------------------------
  const [isPending, startTransition] = useTransition()

  // --------------------------------------------------------------------------
  // Topic 103: useOptimistic Hook (Optimistically updates UI before server responds)
  // --------------------------------------------------------------------------
  const [optimisticComments, setOptimisticComments] = useOptimistic(
    comments,
    (currentList, newCommentText) => [
      ...currentList,
      {
        id: `opt-${Date.now()}`,
        text: newCommentText,
        sending: true,
      },
    ]
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const submittedText = inputText
    setInputText('')
    setErrorMessage(null)

    // Topic 102: startTransition handles the async action and manages isPending
    startTransition(async () => {
      // Topic 103: Instantly update optimistic state
      setOptimisticComments(submittedText)

      try {
        // Topic 99: Execute server mutation
        const savedComment = await fakeServerActionAddComment(submittedText)
        setComments((prev) => [...prev, savedComment])
      } catch (err) {
        // Optimistic state automatically rolls back when error is thrown!
        setErrorMessage(err.message)
      }
    })
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Next.js & Modern Full-Stack React</h2>
      <p className={styles.subtitle}>
        Server Actions, useOptimistic, useTransition, and Server vs Client boundaries.
      </p>

      {/* Part 1: Topic 102 & 103 - useOptimistic & useTransition Simulator */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topics 99, 102 & 103: Optimistic UI & Server Actions</span>
          <span
            className={`${styles.badge} ${
              isPending ? styles.badgeOptimistic : styles.badgeClient
            }`}
          >
            {isPending ? 'Syncing with Server...' : 'Ready'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Type comment (type 'fail' to test rollback)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isPending}
            className={styles.inputField}
          />
          <button
            type="submit"
            disabled={isPending || !inputText.trim()}
            className={styles.btnPrimary}
          >
            {isPending ? 'Saving...' : 'Add Comment'}
          </button>
        </form>

        {errorMessage && (
          <div style={{ color: '#c5221f', fontSize: '12px', marginBottom: '10px' }}>
            ⚠️ {errorMessage} (Optimistic comment was automatically rolled back!)
          </div>
        )}

        <div className={styles.commentList}>
          {optimisticComments.map((c) => (
            <div
              key={c.id}
              className={`${styles.commentItem} ${
                c.sending ? styles.commentPending : ''
              }`}
            >
              <span>{c.text}</span>
              {c.sending ? (
                <span style={{ fontSize: '11px', color: '#b06000', fontWeight: 600 }}>
                  ⏳ Optimistic (Saving...)
                </span>
              ) : (
                <span style={{ fontSize: '11px', color: '#137333' }}>
                  ✓ Committed
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Topic 93 - Server Components inside Client Components */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 80, 81 & 93: RSC & Client Boundary Composition</span>
          <span className={`${styles.badge} ${styles.badgeServer}`}>Architecture</span>
        </div>

        {/* Passing Server Component as children into a Client Component */}
        <ClientCardBoundary title="Interactive Client Wrapper">
          <ServerComponentContent />
        </ClientCardBoundary>

        <div className={styles.infoBox}>
          <strong>Rule of RSC Composition:</strong> You cannot directly import a Server Component
          into a Client Component. But you CAN pass a Server Component as <code>children</code> into
          a Client Component!
        </div>
      </div>

      {/* Part 3: Topic 81 - RSC vs SSR Comparison */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 81: RSC vs SSR Interview Showdown</span>
          <span className={`${styles.badge} ${styles.badgeClient}`}>Cheat Sheet</span>
        </div>

        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Server-Side Rendering (SSR)</th>
              <th>React Server Components (RSC)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Execution</strong></td>
              <td>Runs on server for initial page load only</td>
              <td>Runs exclusively on the server, always</td>
            </tr>
            <tr>
              <td><strong>Bundle Size</strong></td>
              <td>Sends full JS to browser for hydration</td>
              <td><strong>Zero KB</strong> sent to browser client bundle</td>
            </tr>
            <tr>
              <td><strong>Hydration</strong></td>
              <td>Requires hydration of the entire HTML</td>
              <td><strong>Never hydrated</strong>; static tree preserved</td>
            </tr>
            <tr>
              <td><strong>Direct DB Access</strong></td>
              <td>Only inside <code>getServerSideProps</code></td>
              <td>Directly inside any async Server Component</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

