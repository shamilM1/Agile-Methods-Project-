from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from enum import Enum


class TransactionType(str, Enum):
    """Transaction type: income adds to balance, expense subtracts."""
    INCOME = "income"
    EXPENSE = "expense"


class TransactionCreate(BaseModel):
    """
    Schema for creating a new transaction.
    
    MVP-W2: Add Money to Wallet (Income)
    - amount: required, must be positive number
    - type: required, must be 'income' or 'expense'
    - description: optional
    - date: optional, defaults to now if not provided
    """
    amount: float = Field(..., gt=0, description="Transaction amount (must be positive)")
    type: TransactionType = Field(..., description="Transaction type: income or expense")
    description: Optional[str] = Field(None, max_length=255, description="Optional description")
    date: Optional[datetime] = Field(None, description="Transaction date (defaults to now if not provided)")
    
    @field_validator('amount')
    @classmethod
    def validate_amount(cls, v):
        """MVP-W2: Validate amount is numeric and > 0"""
        if v <= 0:
            raise ValueError('Amount must be greater than 0')
        if not isinstance(v, (int, float)):
            raise ValueError('Amount must be a number')
        return round(v, 2)


class TransactionResponse(BaseModel):
    """Schema for transaction response."""
    id: int
    amount: float
    type: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionWithBalanceResponse(BaseModel):
    """
    Schema for transaction response with updated balance.
    
    MVP-W2: Return created transaction AND updated balance.
    """
    transaction: TransactionResponse
    balance: float
    currency: str = "EUR"
