from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction
from typing import List, Optional


class WalletService:
    """Service for wallet operations."""

    def __init__(self, db: Session):
        self.db = db

    def get_balance(self) -> float:
        """
        Calculate current balance from all transactions.
        Balance = sum(income) - sum(expenses)
        Returns 0 if no transactions exist.
        """
        income = self.db.query(func.sum(Transaction.amount)).filter(
            Transaction.type == "income"
        ).scalar() or 0.0

        expenses = self.db.query(func.sum(Transaction.amount)).filter(
            Transaction.type == "expense"
        ).scalar() or 0.0

        return round(income - expenses, 2)

    def create_transaction(
        self, 
        amount: float, 
        transaction_type: str, 
        description: Optional[str] = None
    ) -> Transaction:
        """Create a new transaction."""
        transaction = Transaction(
            amount=amount,
            type=transaction_type,
            description=description
        )
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def get_transactions(self, limit: int = 100) -> List[Transaction]:
        """Get all transactions, ordered by date (newest first)."""
        return self.db.query(Transaction).order_by(
            Transaction.created_at.desc()
        ).limit(limit).all()

    def get_transaction_by_id(self, transaction_id: int) -> Optional[Transaction]:
        """Get a transaction by ID."""
        return self.db.query(Transaction).filter(
            Transaction.id == transaction_id
        ).first()
