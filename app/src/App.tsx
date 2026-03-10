import { useState } from 'react'
import WebApp from '@twa-dev/sdk'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <div className="glass-card">
        <h1>TON Pet</h1>
        <div className="user-info">
          <p>Welcome, <b>{WebApp.initDataUnsafe.user?.first_name || 'Player'}</b>!</p>
        </div>
        
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Tap to Earn: {count}
          </button>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
            Collect coins and upgrade your pet.
          </p>
        </div>

        <button className="cta-button" onClick={() => WebApp.showAlert(`You have ${count} coins!`)}>
          Show Balance Alert
        </button>
      </div>
    </div>
  )
}

export default App
