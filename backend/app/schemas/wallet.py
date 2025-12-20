from pydantic import BaseModel


class WalletBalance(BaseModel):
    """
    Schema for wallet balance response.
    
    MVP-W1: Returns current balance calculated from transactions.
    Currency is fixed to EUR for MVP.
    """
    balance: float
    currency: str = "EUR"
