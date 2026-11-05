import { useState } from 'react'
import Module01Foundations from './modules/Module01Foundations.jsx'
import Module02PropsAndComposition from './modules/Module02PropsAndComposition.jsx'
import Module03StateAndEvents from './modules/Module03StateAndEvents.jsx'
import Module04FormsAndStateLifting from './modules/Module04FormsAndStateLifting.jsx'
import Module05ReactInternalsAndKeys from './modules/Module05ReactInternalsAndKeys.jsx'
import Module06EffectsAndAsyncFlow from './modules/Module06EffectsAndAsyncFlow.jsx'
import Module07DOMAndRefs from './modules/Module07DOMAndRefs.jsx'
import Module08ComplexStateAndCustomHooks from './modules/Module08ComplexStateAndCustomHooks.jsx'
import Module09GlobalState from './modules/Module09GlobalState.jsx'
import Module10ClientRouting from './modules/Module10ClientRouting.jsx'
import Module11PerformanceAndClosures from './modules/Module11PerformanceAndClosures.jsx'
import Module12AdvancedPatterns from './modules/Module12AdvancedPatterns.jsx'
import Module13NextAndModernFullStack from './modules/Module13NextAndModernFullStack.jsx'
import styles from './App.module.css'

function App() {
  const [activeModule, setActiveModule] = useState(1)

  return (
    <main className={styles.main}>
      <nav className={styles.navBar}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setActiveModule(num)}
            className={`${styles.navButton} ${
              activeModule === num ? styles.navButtonActive : ''
            }`}
          >
            Mod {num}
          </button>
        ))}
      </nav>

      {activeModule === 1 && <Module01Foundations />}
      {activeModule === 2 && <Module02PropsAndComposition />}
      {activeModule === 3 && <Module03StateAndEvents />}
      {activeModule === 4 && <Module04FormsAndStateLifting />}
      {activeModule === 5 && <Module05ReactInternalsAndKeys />}
      {activeModule === 6 && <Module06EffectsAndAsyncFlow />}
      {activeModule === 7 && <Module07DOMAndRefs />}
      {activeModule === 8 && <Module08ComplexStateAndCustomHooks />}
      {activeModule === 9 && <Module09GlobalState />}
      {activeModule === 10 && <Module10ClientRouting />}
      {activeModule === 11 && <Module11PerformanceAndClosures />}
      {activeModule === 12 && <Module12AdvancedPatterns />}
      {activeModule === 13 && <Module13NextAndModernFullStack />}
    </main>
  )
}

export default App
