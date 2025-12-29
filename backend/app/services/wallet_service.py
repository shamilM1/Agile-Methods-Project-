from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.transaction import Transaction
from typing import List, Optional


class WalletService:
    """
    Service for wallet operations.
    
    MVP-W1: Handles balance calculation and transaction management.
    """

    def __init__(self, db: Session):
        self.db = db

    def get_balance(self) -> float:
        """
        Calculate current balance from all transactions.
        
        Formula: Balance = sum(income) - sum(expenses)
        Returns 0 if no transactions exist.
        
        MVP-W1 Requirement: Handle case of no transactions (return 0)
        """
        # Sum all income transactions
        income = self.db.query(func.sum(Transaction.amount)).filter(
            Transaction.type == "income"
        ).scalar() or 0.0

        # Sum all expense transactions
        expenses = self.db.query(func.sum(Transaction.amount)).filter(
            Transaction.type == "expense"
        ).scalar() or 0.0

        # Balance = income - expenses
        return round(income - expenses, 2)

    def create_transaction(
        self, 
        amount: float, 
        transaction_type: str, 
        description: Optional[str] = None,
        date: Optional[str] = None
    ) -> Transaction:
        """
        Create a new transaction (income or expense).
        
        MVP-W2: Add Money to Wallet
        - Inserts row into transactions table
        - Date defaults to 'now' if not provided
        """
        from datetime import datetime
        
        transaction = Transaction(
            amount=amount,
            type=transaction_type,
            description=description,
            created_at=date if date else datetime.utcnow()
        )
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction
    
    def create_transaction_with_balance(self, amount: float, transaction_type: str, 
                                        description: Optional[str] = None,
                                        date: Optional[str] = None) -> dict:
        """
        MVP-W2: Create transaction and return it with updated balance.
        """
        transaction = self.create_transaction(amount, transaction_type, description, date)
        balance = self.get_balance()
        return {
            "transaction": transaction,
            "balance": balance,
            "currency": "EUR"
        }

    def get_transactions(self, limit: int = 100, offset: int = 0) -> List[Transaction]:
        """
        Get all transactions, ordered by date (newest first).
        
        MVP-W4: View Wallet Transaction History
        - Supports pagination with limit and offset
        - Default: returns first 100 transactions
        """
        return self.db.query(Transaction).order_by(
            Transaction.created_at.desc()
        ).offset(offset).limit(limit).all()
