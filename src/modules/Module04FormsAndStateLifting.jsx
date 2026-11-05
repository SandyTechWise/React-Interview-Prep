import React, { useState } from 'react'
import styles from './Module04FormsAndStateLifting.module.css'

// Topic 20: Accordion item component
// Topic 16: Receives state (isOpen) and action (onToggle) as props from parent (Lifting State Up)
function AccordionItem({ faq, isOpen, onToggle }) {
  return (
    <div
      className={`${styles.accordionItem} ${
        isOpen ? styles.accordionItemOpen : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={styles.accordionHeader}
      >
        <div className={styles.headerTitleGroup}>
          <span>{faq.question}</span>
          <span className={styles.tag}>{faq.category}</span>
        </div>
        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className={styles.accordionContent}>
          <p style={{ margin: 0 }}>{faq.answer}</p>
        </div>
      )}
    </div>
  )
}

// Topic 14: Controlled Filter Bar
function FilterBar({ searchQuery, onSearchChange, category, onCategoryChange }) {
  return (
    <div className={styles.filterCard}>
      <div className={styles.formGroup}>
        {/* Topic 14: Controlled Input (value driven by React state, synced via onChange) */}
        <input
          type="text"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.inputField}
        />

        {/* Topic 14: Controlled Select Dropdown */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={styles.selectField}
        >
          <option value="All">All Categories</option>
          <option value="State">State</option>
          <option value="Hooks">Hooks</option>
          <option value="Architecture">Architecture</option>
        </select>
      </div>
    </div>
  )
}

const FAQ_DATA = [
  {
    id: 'f1',
    category: 'State',
    question: 'What is a controlled component?',
    answer:
      'A component where form data is handled by React component state rather than the DOM. State serves as the single source of truth.',
  },
  {
    id: 'f2',
    category: 'Architecture',
    question: 'Why lift state up to the closest parent?',
    answer:
      'When two sibling components need to synchronize or share state, lifting it to their common parent allows clean one-way data flow via props and callbacks.',
  },
  {
    id: 'f3',
    category: 'Hooks',
    question: 'Can you have uncontrolled inputs in React?',
    answer:
      'Yes, by using defaultValue and accessing the element via useRef or native FormData on form submission.',
  },
]

export default function Module04FormsAndStateLifting() {
  // Topic 14: Controlled form state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Topic 16 & Topic 20: Lifting state up for single-open Accordion
  // Storing only the ID of the currently open item (null = all closed)
  const [openFaqId, setOpenFaqId] = useState('f1')

  // Derived filtered items based on controlled inputs
  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesSearch = faq.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleToggle = (id) => {
    // If clicking the already open item, close it (set to null); otherwise open the clicked item
    setOpenFaqId((prevId) => (prevId === id ? null : id))
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Forms, Controlled Inputs & State Lifting</h2>
      <p className={styles.subtitle}>
        Synchronizing form state and coordinating sibling components.
      </p>

      {/* Sibling 1: Controlled Filter Controls */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Sibling 2: Accordion List coordinated by lifted parent state */}
      <div className={styles.accordionContainer}>
        {filteredFaqs.length === 0 ? (
          <div className={styles.emptyState}>No matching questions found.</div>
        ) : (
          filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              faq={faq}
              isOpen={openFaqId === faq.id}
              onToggle={() => handleToggle(faq.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

