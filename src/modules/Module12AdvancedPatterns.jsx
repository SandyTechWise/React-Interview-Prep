import React, { useState, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import styles from './Module12AdvancedPatterns.module.css'

// ----------------------------------------------------------------------------
// Topic 76: React Portal (Renders into document.body to avoid CSS clipping)
// ----------------------------------------------------------------------------
function ModalPortal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  // createPortal renders children into a different DOM subtree (document.body)
  // while preserving React SyntheticEvent bubbling!
  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <div className={styles.modalBody}>{children}</div>
        <button type="button" onClick={onClose} className={styles.btnPrimary}>
          Close Modal
        </button>
      </div>
    </div>,
    document.body
  )
}

// ----------------------------------------------------------------------------
// Topic 75: Compound Component Pattern (Accordion with internal Context)
// ----------------------------------------------------------------------------
const AccordionContext = createContext(null)

function CompoundAccordion({ children }) {
  const [openId, setOpenId] = useState(null)
  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  )
}

function CompoundItem({ id, children }) {
  return (
    <div className={styles.compoundItem}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, { itemId: id }) : child
      )}
    </div>
  )
}

function CompoundHeader({ itemId, title }) {
  const { openId, toggle } = useContext(AccordionContext)
  const isOpen = openId === itemId

  return (
    <button
      type="button"
      onClick={() => toggle(itemId)}
      className={styles.compoundHeader}
    >
      <span>{title}</span>
      <span>{isOpen ? '▲' : '▼'}</span>
    </button>
  )
}

function CompoundBody({ itemId, children }) {
  const { openId } = useContext(AccordionContext)
  if (openId !== itemId) return null

  return <div className={styles.compoundBody}>{children}</div>
}

// Attach sub-components to parent for dot-notation syntax
CompoundAccordion.Item = CompoundItem
CompoundAccordion.Header = CompoundHeader
CompoundAccordion.Body = CompoundBody

// ----------------------------------------------------------------------------
// Topic 73: Render Props Pattern (Sharing state logic via a function prop)
// ----------------------------------------------------------------------------
function MouseTracker({ render }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setCoords({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top),
    })
  }

  return (
    <div onMouseMove={handleMouseMove} className={styles.trackerBox}>
      {render(coords)}
    </div>
  )
}

// ----------------------------------------------------------------------------
// Topic 74: Higher Order Component (HOC)
// ----------------------------------------------------------------------------
function withPremiumBadge(WrappedComponent) {
  return function EnhancedComponent(props) {
    return (
      <div className={styles.hocWrapper}>
        <WrappedComponent {...props} />
        <span className={styles.badge}>PRO Tier</span>
      </div>
    )
  }
}

function BaseProfile({ name }) {
  return <strong>{name}</strong>
}

const PremiumProfile = withPremiumBadge(BaseProfile)

// ----------------------------------------------------------------------------
// Main Module 12 Component
// ----------------------------------------------------------------------------
export default function Module12AdvancedPatterns() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Advanced Patterns & Ecosystem</h2>
      <p className={styles.subtitle}>
        Portals, Compound Components, Render Props, and HOC design patterns.
      </p>

      {/* Part 1: Topic 76 - React Portal */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 76: React Portal (createPortal)</span>
          <span className={styles.badge}>DOM Escape Hatch</span>
        </div>
        <p style={{ fontSize: '13px', color: '#5f6368', margin: '0 0 12px 0' }}>
          Portals inject children directly into <code>document.body</code> while maintaining
          normal React event bubbling and context trees.
        </p>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={styles.btnPrimary}
        >
          Open Portal Modal
        </button>

        <ModalPortal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="React Portal Modal"
        >
          This modal was rendered into <code>document.body</code>, completely immune to parent{' '}
          <code>overflow: hidden</code> or <code>z-index</code> stacking restrictions!
        </ModalPortal>
      </div>

      {/* Part 2: Topic 75 - Compound Components */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 75: Compound Component Pattern</span>
          <span className={styles.badge}>Implicit State Sharing</span>
        </div>

        <CompoundAccordion>
          <CompoundAccordion.Item id="item-1">
            <CompoundAccordion.Header title="What is a Compound Component?" />
            <CompoundAccordion.Body>
              A design pattern where parent and child components communicate implicitly via
              internal context, providing a highly flexible and clean declarative API.
            </CompoundAccordion.Body>
          </CompoundAccordion.Item>

          <CompoundAccordion.Item id="item-2">
            <CompoundAccordion.Header title="When should you use this pattern?" />
            <CompoundAccordion.Body>
              Whenever building reusable design-system primitives like Tabs, Select menus,
              Accordions, or Modals where children need layout freedom.
            </CompoundAccordion.Body>
          </CompoundAccordion.Item>
        </CompoundAccordion>
      </div>

      {/* Part 3: Topic 73 - Render Props Pattern */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 73: Render Props Pattern</span>
          <span className={styles.badge}>Function as Prop</span>
        </div>

        <MouseTracker
          render={({ x, y }) => (
            <div>
              Hover inside this box! Cursor coordinates: <strong>X: {x}px, Y: {y}px</strong>
            </div>
          )}
        />
      </div>

      {/* Part 4: Topic 74 - Higher Order Component (HOC) */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>
          <span>Topic 74: Higher Order Component (HOC)</span>
          <span className={styles.badge}>Component Wrapper</span>
        </div>

        <div>
          Enhanced via <code>withPremiumBadge(BaseProfile)</code>:
          <div style={{ marginTop: '8px' }}>
            <PremiumProfile name="Sarah Connor" />
          </div>
        </div>
      </div>
    </div>
  )
}

