from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.wallet_service import WalletService
from app.schemas.wallet import WalletBalance
from app.schemas.transaction import TransactionCreate, TransactionResponse

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


@router.post("/transactions", response_model=TransactionResponse, status_code=201)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new transaction (income or expense).
    
    Used to add money (income) or record spending (expense).
    """
    service = WalletService(db)
    new_transaction = service.create_transaction(
        amount=transaction.amount,
        transaction_type=transaction.type.value,
        description=transaction.description
    )
    return new_transaction


@router.get("/transactions", response_model=List[TransactionResponse])
def get_transactions(limit: int = 100, db: Session = Depends(get_db)):
    """Get transaction history (newest first)."""
    service = WalletService(db)
    return service.get_transactions(limit=limit)
