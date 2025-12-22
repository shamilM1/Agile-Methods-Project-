import { useState, useEffect } from 'react'
import './App.css'

/**
 * MVP-W1: View Wallet Balance ✓
 * MVP-W2: Add Money to Wallet (Income)
 * 
 * New features:
 * - Add "Add Income" button on dashboard
 * - Income form with amount, description, date
 * - Client-side validation
 * - Success/error feedback
 */

// API base URL - backend runs on port 8000
const API_URL = 'http://localhost:8000'

function App() {
  // State for wallet balance
  const [balance, setBalance] = useState(null)
  
  // State for API health status
  const [healthStatus, setHealthStatus] = useState(null)
  
  // Loading state
  const [loading, setLoading] = useState(true)
  
  // Error state
  const [error, setError] = useState(null)

  // MVP-W2: Form states
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: ''
  })
  const [formError, setFormError] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  /**
   * Fetch wallet balance from API
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

  /**
   * MVP-W2: Validate form data (client-side)
   */
  const validateForm = () => {
    // Amount is required
    if (!formData.amount || formData.amount.trim() === '') {
      setFormError('Amount is required')
      return false
    }

    // Amount must be numeric
    const amount = parseFloat(formData.amount)
    if (isNaN(amount)) {
      setFormError('Please enter a valid number')
      return false
    }

    // Amount must be > 0
    if (amount <= 0) {
      setFormError('Amount must be greater than 0')
      return false
    }

    return true
  }

  /**
   * MVP-W2: Handle form submission - Add Income
   */
  const handleAddIncome = async (e) => {
    e.preventDefault()
    setFormError(null)

    // Client-side validation
    if (!validateForm()) {
      return
    }

    setFormLoading(true)

    try {
      const requestBody = {
        amount: parseFloat(formData.amount),
        type: 'income',
        description: formData.description || null,
        date: formData.date || null
      }

      const response = await fetch(`${API_URL}/wallet/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to add income')
      }

      const data = await response.json()

      // MVP-W2: Update balance immediately from response
      setBalance({
        balance: data.balance,
        currency: data.currency
      })

      // Show success message
      setSuccessMessage(`✓ Income of ${data.transaction.amount.toFixed(2)} EUR added successfully!`)
      
      // Clear form and close
      setFormData({ amount: '', description: '', date: '' })
      setShowIncomeForm(false)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)

    } catch (err) {
      setFormError(err.message || 'Failed to add income. Please try again.')
      console.error('Error adding income:', err)
    } finally {
      setFormLoading(false)
    }
  }

  /**
   * MVP-W2: Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (formError) setFormError(null)
  }

  /**
   * MVP-W2: Close form and reset
   */
  const handleCloseForm = () => {
    setShowIncomeForm(false)
    setFormData({ amount: '', description: '', date: '' })
    setFormError(null)
  }

  // Fetch data on load
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
        {/* MVP-W2: Success Message */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {/* Balance Card */}
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

          {/* MVP-W2: Action Buttons */}
          {!loading && !error && (
            <div className="action-buttons">
              <button 
                onClick={() => setShowIncomeForm(true)} 
                className="add-income-btn"
              >
                ➕ Add Income
              </button>
              <button onClick={fetchBalance} className="refresh-btn">
                🔄 Refresh
              </button>
            </div>
          )}
        </section>

        {/* MVP-W2: Income Form Modal */}
        {showIncomeForm && (
          <div className="modal-overlay" onClick={handleCloseForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add Income</h2>
              
              <form onSubmit={handleAddIncome}>
                {/* Amount Field - Required */}
                <div className="form-group">
                  <label htmlFor="amount">Amount *</label>
                  <div className="input-with-currency">
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      autoFocus
                    />
                    <span className="currency-label">EUR</span>
                  </div>
                </div>

                {/* Description Field - Optional */}
                <div className="form-group">
                  <label htmlFor="description">Description (optional)</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="e.g., Salary, Gift, Refund..."
                    maxLength="255"
                  />
                </div>

                {/* Date Field - Optional */}
                <div className="form-group">
                  <label htmlFor="date">Date (optional)</label>
                  <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Form Error */}
                {formError && (
                  <div className="form-error">
                    ⚠️ {formError}
                  </div>
                )}

                {/* Form Buttons */}
                <div className="form-buttons">
                  <button 
                    type="button" 
                    onClick={handleCloseForm}
                    className="cancel-btn"
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={formLoading}
                  >
                    {formLoading ? 'Adding...' : 'Add Income'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Health check info */}
        <section className="info-card">
          <h3>📋 API Status</h3>
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
