from pydantic import BaseModel


class WalletBalance(BaseModel):
    """Schema for wallet balance response."""
    balance: float
    currency: str = "EUR"
