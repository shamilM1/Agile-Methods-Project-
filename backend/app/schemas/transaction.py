from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class TransactionType(str, Enum):
    """Transaction type: income adds to balance, expense subtracts."""
    INCOME = "income"
    EXPENSE = "expense"


class TransactionCreate(BaseModel):
    """Schema for creating a new transaction."""
    amount: float = Field(..., gt=0, description="Transaction amount (must be positive)")
    type: TransactionType = Field(..., description="Transaction type: income or expense")
    description: Optional[str] = Field(None, max_length=255, description="Optional description")


class TransactionResponse(BaseModel):
    """Schema for transaction response."""
    id: int
    amount: float
    type: str
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
