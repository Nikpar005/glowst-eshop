from database import engine, SessionLocal
import models
from auth import get_password_hash

def seed():
    # Δημιούργησε τους πίνακες
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Αν υπάρχουν ήδη δεδομένα, μην ξανατρέξεις
    if db.query(models.Product).first():
        print("DB already seeded!")
        db.close()
        return

    # --- ADMIN ---
    admin = models.Admin(
        username="admin",
        hashed_password=get_password_hash("glowst2026")
    )
    db.add(admin)

    # --- PRODUCTS ---
    products_data = [
        {
            "name": "Polo Shirt",
            "description": "Κλασικό polo shirt από 100% βαμβάκι piqué.",
            "image": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80",
            "variants": [
                {"color": "Μαύρο",   "size": "S", "price": 30.0, "stock": 10, "image": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"},
                {"color": "Μαύρο",   "size": "M", "price": 30.0, "stock": 8,  "image": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"},
                {"color": "Μαύρο",   "size": "L", "price": 30.0, "stock": 5,  "image": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"},
                {"color": "Άσπρο", "size": "S", "price": 40.0, "stock": 7,  "image": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"},
                {"color": "Άσπρο", "size": "M", "price": 40.0, "stock": 4,  "image": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"},
                {"color": "Άσπρο", "size": "L", "price": 40.0, "stock": 2,  "image": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&q=80"},
            ]
        },
        {
            "name": "Oversized Hoodie",
            "description": "Βαριά μπλούζα με κουκούλα σε relaxed fit.",
            "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
            "variants": [
                {"color": "Γκρι",  "size": "S", "price": 55.0, "stock": 6, "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"},
                {"color": "Γκρι",  "size": "M", "price": 55.0, "stock": 9, "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"},
                {"color": "Γκρι",  "size": "L", "price": 55.0, "stock": 3, "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"},
                {"color": "Μαύρο", "size": "S", "price": 60.0, "stock": 5, "image": "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80"},
                {"color": "Μαύρο", "size": "M", "price": 60.0, "stock": 7, "image": "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80"},
                {"color": "Μαύρο", "size": "L", "price": 60.0, "stock": 1, "image": "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80"},
            ]
        },
        {
            "name": "Linen Trousers",
            "description": "Ελαφριά λινά παντελόνια για κάθε περίσταση.",
            "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
            "variants": [
                {"color": "Μπεζ",  "size": "S", "price": 75.0, "stock": 4, "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"},
                {"color": "Μπεζ",  "size": "M", "price": 75.0, "stock": 6, "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"},
                {"color": "Μπεζ",  "size": "L", "price": 75.0, "stock": 3, "image": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"},
                {"color": "Λευκό", "size": "S", "price": 75.0, "stock": 5, "image": "https://images.unsplash.com/photo-1594938298603-c8148c4b4f5b?w=800&q=80"},
                {"color": "Λευκό", "size": "M", "price": 75.0, "stock": 4, "image": "https://images.unsplash.com/photo-1594938298603-c8148c4b4f5b?w=800&q=80"},
                {"color": "Λευκό", "size": "L", "price": 75.0, "stock": 2, "image": "https://images.unsplash.com/photo-1594938298603-c8148c4b4f5b?w=800&q=80"},
            ]
        },
        {
            "name": "Wool Coat",
            "description": "Κλασικό παλτό από μαλλί με structured γραμμή.",
            "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
            "variants": [
                {"color": "Καμηλό", "size": "S", "price": 220.0, "stock": 3, "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80"},
                {"color": "Καμηλό", "size": "M", "price": 220.0, "stock": 4, "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80"},
                {"color": "Καμηλό", "size": "L", "price": 220.0, "stock": 2, "image": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80"},
                {"color": "Μαύρο",  "size": "S", "price": 220.0, "stock": 3, "image": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80"},
                {"color": "Μαύρο",  "size": "M", "price": 220.0, "stock": 5, "image": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80"},
                {"color": "Μαύρο",  "size": "L", "price": 220.0, "stock": 1, "image": "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80"},
            ]
        },
        {
            "name": "Silk Shirt",
            "description": "Πουκάμισο από φυσικό μετάξι σε fluid γραμμή.",
            "image": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80",
            "variants": [
                {"color": "Κρέμ", "size": "S", "price": 110.0, "stock": 5, "image": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80"},
                {"color": "Κρέμ", "size": "M", "price": 110.0, "stock": 7, "image": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80"},
                {"color": "Κρέμ", "size": "L", "price": 110.0, "stock": 3, "image": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80"},
                {"color": "Μπλε", "size": "S", "price": 115.0, "stock": 4, "image": "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80"},
                {"color": "Μπλε", "size": "M", "price": 115.0, "stock": 6, "image": "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80"},
                {"color": "Μπλε", "size": "L", "price": 115.0, "stock": 2, "image": "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80"},
            ]
        },
        {
            "name": "Denim Jacket",
            "description": "Vintage-inspired denim jacket με washed finish.",
            "image": "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80",
            "variants": [
                {"color": "Ανοιχτό", "size": "S", "price": 130.0, "stock": 4, "image": "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80"},
                {"color": "Ανοιχτό", "size": "M", "price": 130.0, "stock": 6, "image": "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80"},
                {"color": "Ανοιχτό", "size": "L", "price": 130.0, "stock": 3, "image": "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&q=80"},
                {"color": "Σκούρο", "size": "S", "price": 135.0, "stock": 5, "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"},
                {"color": "Σκούρο", "size": "M", "price": 135.0, "stock": 4, "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"},
                {"color": "Σκούρο", "size": "L", "price": 135.0, "stock": 2, "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"},
            ]
        },
        {
            "name": "Knit Sweater",
            "description": "Chunky πλεκτό πουλόβερ από merino wool.",
            "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
            "variants": [
                {"color": "Εκρού", "size": "S", "price": 95.0, "stock": 6, "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"},
                {"color": "Εκρού", "size": "M", "price": 95.0, "stock": 8, "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"},
                {"color": "Εκρού", "size": "L", "price": 95.0, "stock": 4, "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"},
                {"color": "Χακί",  "size": "S", "price": 95.0, "stock": 3, "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"},
                {"color": "Χακί",  "size": "M", "price": 95.0, "stock": 5, "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"},
                {"color": "Χακί",  "size": "L", "price": 95.0, "stock": 2, "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80"},
            ]
        },
    ]

    for p_data in products_data:
        product = models.Product(
            name=p_data["name"],
            description=p_data["description"],
            image=p_data["image"],
            is_active=True
        )
        db.add(product)
        db.flush()  # παίρνουμε το product.id

        for v_data in p_data["variants"]:
            variant = models.Variant(
                product_id=product.id,
                color=v_data["color"],
                size=v_data["size"],
                price=v_data["price"],
                stock=v_data["stock"],
                image=v_data["image"]
            )
            db.add(variant)

    db.commit()
    db.close()
    print("✅ DB seeded successfully!")
    print("👤 Admin: username=admin, password=glowst2026")

if __name__ == "__main__":
    seed()