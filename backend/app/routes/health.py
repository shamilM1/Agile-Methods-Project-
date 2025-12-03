from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    """
    Health check endpoint.
    Returns simple JSON to confirm the API is running.
    """
    return {"status": "ok"}
