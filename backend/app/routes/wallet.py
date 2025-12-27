from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.wallet_service import WalletService
from app.schemas.wallet import WalletBalance
from app.schemas.transaction import TransactionCreate, TransactionResponse, TransactionWithBalanceResponse

router = APIRouter(prefix="/wallet", tags=["Wallet"])


@router.get("/balance", response_model=WalletBalance)
def get_balance(db: Session = Depends(get_db)):
    """
    Get current wallet balance.
    
    MVP-W1: Main endpoint for viewing wallet balance.
    - Balance is calculated from all stored transactions (income - expenses)
    - Returns 0 if no transactions exist
    - Currency is fixed to EUR for MVP
    
    Returns:
        WalletBalance: { balance: float, currency: str }
    """
    service = WalletService(db)
    balance = service.get_balance()
    return WalletBalance(balance=balance, currency="EUR")


@router.post("/transactions", response_model=TransactionWithBalanceResponse, status_code=201)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new transaction (income or expense).
    
    MVP-W2: Add Money to Wallet (Income)
    MVP-W3: Record Expense (Subtract from Wallet)
    
    - Request body: amount (required), type (required), description (optional), date (optional)
    - Validates: amount > 0, numeric; type must be 'income' or 'expense'
    - MVP-W3: For expenses, validates sufficient balance (overdraft protection)
    - Returns: created transaction AND updated balance
    
    Example request:
    {
        "amount": 100.00,
        "type": "expense",
        "description": "Groceries",
        "date": "2025-12-21T10:00:00"  // optional
    }
    
    Example response:
    {
        "transaction": { "id": 1, "amount": 100.0, ... },
        "balance": 50.0,
        "currency": "EUR"
    }
    
    Error (insufficient funds):
    HTTP 400: {"detail": "Insufficient balance. Current balance: 50.0 EUR"}
    """
    service = WalletService(db)
    
    # MVP-W3: Overdraft protection - block expenses exceeding balance
    if transaction.type.value == "expense":
        current_balance = service.get_balance()
        if transaction.amount > current_balance:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient balance. Current balance: {current_balance} EUR"
            )
    
    result = service.create_transaction_with_balance(
        amount=transaction.amount,
        transaction_type=transaction.type.value,
        description=transaction.description,
        date=transaction.date
    )
    return result


@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(limit: int = 100, db: Session = Depends(get_db)):
    """Get transaction history (newest first)."""
    service = WalletService(db)
    return service.get_transactions(limit=limit)
