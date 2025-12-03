# 💰 Wallet Management - Agile Methods Project

A Single Page Application (SPA) for personal wallet management. Track your income and expenses with a simple, clean interface.

**Built with:** Python (FastAPI) + React (Vite) + SQLite

---

## 📁 Project Structure

```
agile project/
├── backend/                    # Python FastAPI backend
│   ├── app/
│   │   ├── models/            # Database models (Transaction)
│   │   ├── routes/            # API endpoints (health, wallet)
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── services/          # Business logic (WalletService)
│   │   ├── config.py          # App configuration
│   │   └── database.py        # SQLite database setup
│   ├── main.py                # Application entry point
│   ├── requirements.txt       # Python dependencies
│   └── wallet.db              # SQLite database (auto-created)
│
├── frontend/                   # React SPA (Vite)
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── App.css            # Component styles
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # React entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Node.js dependencies
│   └── vite.config.js         # Vite configuration
│
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- **Python 3.9+** → [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** → [Download Node.js](https://nodejs.org/)

To verify installation, run:
```bash
python --version   # Should show Python 3.9 or higher
node --version     # Should show v18 or higher
npm --version      # Should show 9 or higher
```

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd "agile project"
```

### Step 2: Set Up the Backend

Open a terminal and run:

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On Windows (Command Prompt):
venv\Scripts\activate.bat
# On Mac/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python main.py
```

✅ **Backend is running at:** http://localhost:8000

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 3: Set Up the Frontend

Open a **new terminal** (keep the backend running!) and run:

```bash
# Navigate to frontend folder
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm run dev
```

✅ **Frontend is running at:** http://localhost:3000

You should see:
```
VITE ready in 300 ms
➜  Local:   http://localhost:3000/
```

### Step 4: Open the App

Open your browser and go to: **http://localhost:3000**

You should see:
- 💰 Wallet Management header
- Green "API: ✓ Connected" badge
- Current balance display (0.00 EUR if fresh database)
- Refresh button

---

## 🧪 Testing the Application

### Test via the Web Interface

1. Open http://localhost:3000
2. Verify the API status shows "✓ Connected"
3. Check that the balance is displayed

### Test via API Documentation (Swagger UI)

1. Open http://localhost:8000/docs
2. Try out the endpoints:
   - **GET /health** → Should return `{"status": "ok"}`
   - **GET /wallet/balance** → Returns current balance
   - **POST /wallet/transactions** → Create a transaction
   - **GET /wallet/transactions** → View transaction history

### Test via Command Line (PowerShell)

```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:8000/health"

# Check wallet balance
Invoke-RestMethod -Uri "http://localhost:8000/wallet/balance"

# Add income (100 EUR)
$body = '{"amount": 100, "type": "income", "description": "Salary"}'
Invoke-RestMethod -Uri "http://localhost:8000/wallet/transactions" -Method POST -Body $body -ContentType "application/json"

# Add expense (25.50 EUR)
$body = '{"amount": 25.50, "type": "expense", "description": "Groceries"}'
Invoke-RestMethod -Uri "http://localhost:8000/wallet/transactions" -Method POST -Body $body -ContentType "application/json"

# Check balance again (should be 74.50)
Invoke-RestMethod -Uri "http://localhost:8000/wallet/balance"

# View all transactions
Invoke-RestMethod -Uri "http://localhost:8000/wallet/transactions"
```

### Test via Command Line (Mac/Linux - curl)

```bash
# Test health endpoint
curl http://localhost:8000/health

# Check wallet balance
curl http://localhost:8000/wallet/balance

# Add income
curl -X POST http://localhost:8000/wallet/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "type": "income", "description": "Salary"}'

# Add expense
curl -X POST http://localhost:8000/wallet/transactions \
  -H "Content-Type: application/json" \
  -d '{"amount": 25.50, "type": "expense", "description": "Groceries"}'

# Check balance again
curl http://localhost:8000/wallet/balance
```

---

## 📡 API Reference

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/health` | Health check | - |
| GET | `/wallet/balance` | Get current balance | - |
| POST | `/wallet/transactions` | Create transaction | `{amount, type, description}` |
| GET | `/wallet/transactions` | Get all transactions | - |

### Request/Response Examples

#### GET /health
```json
{"status": "ok"}
```

#### GET /wallet/balance
```json
{"balance": 74.5, "currency": "EUR"}
```

#### POST /wallet/transactions
Request:
```json
{
  "amount": 100.00,
  "type": "income",
  "description": "Salary"
}
```
Response:
```json
{
  "id": 1,
  "amount": 100.0,
  "type": "income",
  "description": "Salary",
  "created_at": "2025-12-03T12:00:00"
}
```

#### GET /wallet/transactions
```json
[
  {"id": 2, "amount": 25.5, "type": "expense", "description": "Groceries", "created_at": "..."},
  {"id": 1, "amount": 100.0, "type": "income", "description": "Salary", "created_at": "..."}
]
```

### Interactive API Documentation
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## ✅ Completed Features (MVP-T1: Project Setup)

### Backend ✓
- [x] FastAPI project with clear structure (app, routes, models, services)
- [x] SQLite database auto-created and connected
- [x] `/health` endpoint returning `{"status": "ok"}`
- [x] Basic logging and structured JSON error handling
- [x] CORS enabled for frontend connection
- [x] Transaction model (id, amount, type, description, created_at)
- [x] Wallet balance calculation (income - expenses)

### Frontend ✓
- [x] React + Vite project setup
- [x] Dashboard page with wallet balance display
- [x] API health status indicator
- [x] Loading spinner while fetching
- [x] Error state with retry button
- [x] Refresh button for manual update

### Next Steps (To Do)
- [ ] Add transaction form (income/expense)
- [ ] Transaction history list view
- [ ] Delete transaction functionality

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend | FastAPI | Python web framework |
| Backend | SQLAlchemy | ORM for database |
| Backend | SQLite | Lightweight database |
| Backend | Pydantic | Data validation |
| Backend | Uvicorn | ASGI server |
| Frontend | React 18 | UI library |
| Frontend | Vite | Build tool & dev server |
| Frontend | CSS | Styling |

---

## 🐛 Troubleshooting

### Backend won't start
- Make sure virtual environment is activated (`venv\Scripts\activate`)
- Check if port 8000 is already in use
- Try: `python -m uvicorn main:app --reload --port 8000`

### Frontend shows "API: ✗ Disconnected"
- Make sure the backend is running first
- Check if backend is on http://localhost:8000
- Check browser console for CORS errors

### "npm" or "python" not recognized
- Make sure Python and Node.js are installed
- Restart your terminal after installation
- Check if they're in your system PATH

### Database issues
- Delete `wallet.db` file and restart backend (creates fresh database)

---

## 👥 Team

**Agile Methods Project** - University Class

---

## 📝 License

This project is for educational purposes.
