import { useState, useEffect } from 'react'
import './App.css'

/**
 * MVP-W1: View Wallet Balance
 * 
 * Requirements implemented:
 * - Create "Dashboard" or "Wallet" screen ✓
 * - Call GET /wallet/balance on load ✓
 * - Display balance in a large, clear component ✓
 * - Show loading state while fetching ✓
 * - Show friendly error state if API call fails ✓
 * - (Optional) Auto-refresh button ✓
 */

// API base URL - backend runs on port 8000
const API_URL = 'http://localhost:8000'

function App() {
  // State for wallet balance
  const [balance, setBalance] = useState(null)
  
  // State for API health status
  const [healthStatus, setHealthStatus] = useState(null)
  
  // Loading state - MVP-W1 requirement
  const [loading, setLoading] = useState(true)
  
  // Error state - MVP-W1 requirement
  const [error, setError] = useState(null)

  /**
   * Fetch wallet balance from API
   * MVP-W1: Call GET /wallet/balance on load
   */
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
      // MVP-W1: Show friendly error state if API call fails
      setError('Could not connect to the server. Please make sure the backend is running.')
      console.error('Error fetching balance:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Check if API is healthy
   */
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

  // MVP-W1: Call GET /wallet/balance on load
  useEffect(() => {
    checkHealth()
    fetchBalance()
  }, [])

  return (
    <div className="app">
      {/* Header with API status */}
      <header className="header">
        <h1>💰 Wallet Management</h1>
        <div className={`health-badge ${healthStatus === 'ok' ? 'healthy' : 'unhealthy'}`}>
          API: {healthStatus === 'ok' ? '✓ Connected' : '✗ Disconnected'}
        </div>
      </header>

      <main className="main">
        {/* MVP-W1: Dashboard/Wallet screen with balance display */}
        <section className="balance-card">
          <h2>Current Balance</h2>
          
          {/* MVP-W1: Show loading state while fetching */}
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          )}

          {/* MVP-W1: Show friendly error state if API call fails */}
          {error && (
            <div className="error">
              <p>⚠️ {error}</p>
              <button onClick={fetchBalance} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {/* MVP-W1: Display balance in a large, clear component */}
          {!loading && !error && balance && (
            <div className="balance-display">
              <span className="amount">
                {balance.balance.toFixed(2)}
              </span>
              <span className="currency">{balance.currency}</span>
            </div>
          )}

          {/* MVP-W1 (Optional): Refresh button */}
          {!loading && !error && (
            <button onClick={fetchBalance} className="refresh-btn">
              🔄 Refresh
            </button>
          )}
        </section>

        {/* Health check info */}
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
