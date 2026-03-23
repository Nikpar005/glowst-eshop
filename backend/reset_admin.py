from database import SessionLocal
import models
from auth import get_password_hash

def reset():
    db = SessionLocal()
    # Βρίσκουμε τον admin
    admin = db.query(models.Admin).filter(models.Admin.username == "admin").first()
    
    new_hash = get_password_hash("glowst2026")
    
    if admin:
        admin.hashed_password = new_hash
        print("Ο υπάρχων Admin ενημερώθηκε με το νέο hash!")
    else:
        new_admin = models.Admin(username="admin", hashed_password=new_hash)
        db.add(new_admin)
        print("Δημιουργήθηκε νέος Admin!")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    reset()