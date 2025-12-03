import { useState, useEffect } from 'react'
import './App.css'

// API base URL - in development we use proxy, in production use full URL
const API_URL = 'http://localhost:8000'

function App() {
  const [balance, setBalance] = useState(null)
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch wallet balance
  const fetchBalance = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/wallet/balance`)
      if (!response.ok) {
        throw new Error('Failed to fetch balance')
      }
      const data = await response.json()
      setBalance(data)
    } catch (err) {
      setError('Could not connect to the server. Please make sure the backend is running.')
      console.error('Error fetching balance:', err)
    } finally {
      setLoading(false)
    }
  }

  // Check API health
  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`)
      if (!response.ok) {
        throw new Error('Health check failed')
      }
      const data = await response.json()
      setHealthStatus(data.status)
    } catch (err) {
      setHealthStatus('error')
      console.error('Health check failed:', err)
    }
  }

  useEffect(() => {
    checkHealth()
    fetchBalance()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Wallet Management</h1>
        <div className={`health-badge ${healthStatus === 'ok' ? 'healthy' : 'unhealthy'}`}>
          API: {healthStatus === 'ok' ? '✓ Connected' : '✗ Disconnected'}
        </div>
      </header>

      <main className="main">
        <section className="balance-card">
          <h2>Current Balance</h2>
          
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>⚠️ {error}</p>
              <button onClick={fetchBalance} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && balance && (
            <div className="balance-display">
              <span className="amount">
                {balance.balance.toFixed(2)}
              </span>
              <span className="currency">{balance.currency}</span>
            </div>
          )}

          {!loading && !error && (
            <button onClick={fetchBalance} className="refresh-btn">
              🔄 Refresh
            </button>
          )}
        </section>

        <section className="info-card">
          <h3>📋 Health Check Result</h3>
          <pre className="health-result">
            {JSON.stringify({ status: healthStatus }, null, 2)}
          </pre>
        </section>
      </main>

      <footer className="footer">
        <p>Wallet Management MVP - Agile Methods Project</p>
      </footer>
    </div>
  )
}

export default App
