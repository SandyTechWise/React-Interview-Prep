import React from 'react'
import styles from './Module02PropsAndComposition.module.css'

function Badge({ label, variant = 'info' }) {
  const variantMap = {
    info: styles.badgeInfo,
    success: styles.badgeSuccess,
    warning: styles.badgeWarning,
  }

  const variantClass = variantMap[variant] || styles.badgeInfo

  return <span className={`${styles.badge} ${variantClass}`}>{label}</span>
}

function Card({ title, badge, icon, actionSlot, children }) {
  return (
    <div className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.cardTitleGroup}>
          {icon}
          <h3 className={styles.cardTitle}>{title}</h3>
          {badge}
        </div>
        {actionSlot}
      </header>

      <div className={styles.cardBody}>{children}</div>
    </div>
  )
}

function UserOverview({ user, onPromote }) {
  return (
    <div className={styles.userOverview}>
      <div>
        <p className={styles.userName}>{user.name}</p>
        <span className={styles.userEmail}>{user.email}</span>
      </div>
      <button
        type="button"
        onClick={() => onPromote(user.id)}
        className={styles.promoteBtn}
      >
        Promote
      </button>
    </div>
  )
}

export default function Module02PropsAndComposition() {
  const currentUser = {
    id: 101,
    name: 'Sarah Connor',
    email: 'sarah@skynet.dev',
    role: 'Lead Architect',
  }

  const handlePromote = (id) => {
    alert(`Callback fired to parent: User ${id} promoted!`)
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Props & Component Composition</h2>

      <Card
        title="System Status"
        icon={<span>⚡</span>}
        badge={<Badge label="Operational" variant="success" />}
        actionSlot={
          <button
            type="button"
            onClick={() => alert('Refreshing status...')}
            className={styles.actionBtn}
          >
            Refresh
          </button>
        }
      >
        <p className={styles.cardText}>
          All nodes are healthy. Latency is currently below 15ms across all regions.
        </p>
      </Card>

      <Card
        title="Team Directory"
        icon={<span>👥</span>}
        badge={<Badge label={currentUser.role} variant="info" />}
      >
        <UserOverview user={currentUser} onPromote={handlePromote} />
      </Card>
    </div>
  )
}
