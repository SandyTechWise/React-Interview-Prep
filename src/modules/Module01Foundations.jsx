import React, { Fragment } from 'react'
import styles from './Module01Foundations.module.css'

function StatusBadge({ isOnline, label = 'Member' }) {
  const statusClass = isOnline ? styles.badgeOnline : styles.badgeOffline

  return (
    <span className={`${styles.badge} ${statusClass}`}>
      {isOnline ? '🟢 Online' : '🔴 Offline'} • {label}
    </span>
  )
}

function SkillList({ skills }) {
  return (
    <ul className={styles.skillsList}>
      {skills.map((skill) => (
        <Fragment key={skill.id}>
          <li className={styles.skillItem}>{skill.name}</li>
        </Fragment>
      ))}
    </ul>
  )
}

export default function Module01Foundations({
  name = 'Alex Developer',
  role = 'Senior Frontend Engineer',
  avatarUrl = 'https://api.dicebear.com/7.x/bottts/svg?seed=Alex',
  isOnline = true,
}) {
  const skills = [
    { id: 's1', name: 'React 18' },
    { id: 's2', name: 'JSX & Purity' },
    { id: 's3', name: 'Modern CSS' },
  ]

  console.log('[Module 1] Component rendered')

  return (
    <div className={styles.card}>
      <header className={styles.header}>
        <img src={avatarUrl} alt={`${name}'s avatar`} className={styles.avatar} />
        <div>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.role}>{role}</p>
          <StatusBadge isOnline={isOnline} label="Pro Dev" />
        </div>
      </header>

      <section>
        <h4 className={styles.skillsTitle}>Key Skills</h4>
        <SkillList skills={skills} />
      </section>
    </div>
  )
}
