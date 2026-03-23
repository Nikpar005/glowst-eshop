import stripe
import os
from dotenv import load_dotenv
from fastapi import APIRouter
from pydantic import BaseModel

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
print("Stripe key loaded:", stripe.api_key[:20] if stripe.api_key else "NOT FOUND")
class CartItem(BaseModel):
    name: str
    color: str
    size: str
    price: float
    quantity: int

class CartRequest(BaseModel):
    items: list[CartItem]

@router.post("/create-checkout-session")
async def create_checkout_session(cart: CartRequest):
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

    line_items = []
    for item in cart.items:
        line_items.append({
            "price_data": {
                "currency": "eur",
                "product_data": {
                    "name": f"{item.name} - {item.color} / {item.size}",
                },
                "unit_amount": int(item.price * 100),  # Stripe θέλει cents
            },
            "quantity": item.quantity,
        })

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        success_url=f"{frontend_url}/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{frontend_url}/cart",
    )

    return {"url": session.url}