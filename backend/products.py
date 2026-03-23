from pydantic import BaseModel
from typing import List

class Variant(BaseModel):
    color: str
    size: str
    price: float
    stock: int
    image: str = ""

class Product(BaseModel):
    id: int
    name: str
    description: str
    image: str
    variants: List[Variant]

# Helper function για να προσθέτει αυτόματα Performance Parameters στα Unsplash URLs
def optimize_img(url: str, width: int = 1000):
    if "unsplash.com" in url:
        return f"{url.split('?')[0]}?fm=webp&w={width}&q=75&fit=crop"
    return url

products_db: List[Product] = [
    Product(
        id=1,
        name="Polo Shirt",
        description="Κλασικό polo shirt από 100% βαμβάκι piqué.",
        image=optimize_img("https://images.unsplash.com/photo-1586790170083-2f9ceadc732d"),
        variants=[
            Variant(color="Μαύρο", size="S", price=30.0, stock=10, image=optimize_img("https://images.unsplash.com/photo-1618354691373-d851c5c3a990", 800)),
            Variant(color="Άσπρο", size="S", price=40.0, stock=7, image=optimize_img("https://images.unsplash.com/photo-1586790170083-2f9ceadc732d", 800)),
        ]
    ),
    Product(
        id=2,
        name="Oversized Hoodie",
        description="Βαριά μπλούζα με κουκούλα σε relaxed fit.",
        image=optimize_img("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633"),
        variants=[
            Variant(color="Γκρι", size="M", price=55.0, stock=9, image=optimize_img("https://images.unsplash.com/photo-1620799140408-edc6dcb6d633", 800)),
        ]
    ),
    Product(
        id=3,
        name="Linen Trousers",
        description="Ελαφριά λινά παντελόνια για κάθε περίσταση.",
        image=optimize_img("https://images.unsplash.com/photo-1624378439575-d8705ad7ae80"),
        variants=[
            Variant(color="Μπεζ", size="M", price=75.0, stock=6, image=optimize_img("https://images.unsplash.com/photo-1624378439575-d8705ad7ae80", 800)),
        ]
    ),
    Product(
        id=4,
        name="Wool Coat",
        description="Κλασικό παλτό από μαλλί με structured γραμμή.",
        image=optimize_img("https://images.unsplash.com/photo-1539533018447-63fcce2678e3"),
        variants=[
            Variant(color="Καμηλό", size="M", price=220.0, stock=4, image=optimize_img("https://images.unsplash.com/photo-1539533018447-63fcce2678e3", 800)),
        ]
    ),
    Product(
        id=5,
        name="Silk Shirt",
        description="Πουκάμισο από φυσικό μετάξι σε fluid γραμμή.",
        image=optimize_img("https://images.unsplash.com/photo-1598033129183-c4f50c736f10"),
        variants=[
            Variant(color="Κρέμ", size="M", price=110.0, stock=7, image=optimize_img("https://images.unsplash.com/photo-1598033129183-c4f50c736f10", 800)),
        ]
    ),
    Product(
        id=6,
        name="Denim Jacket",
        description="Vintage-inspired denim jacket με washed finish.",
        image=optimize_img("https://images.unsplash.com/photo-1551537482-f2075a1d41f2"),
        variants=[
            Variant(color="Ανοιχτό", size="M", price=130.0, stock=6, image=optimize_img("https://images.unsplash.com/photo-1551537482-f2075a1d41f2", 800)),
        ]
    ),
]