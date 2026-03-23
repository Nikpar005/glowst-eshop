from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import Optional

from database import get_db
from auth import verify_password, create_access_token, get_current_admin
import models

router = APIRouter(prefix="/admin")

# --- SCHEMAS ---
class VariantUpdate(BaseModel):
    price: Optional[float] = None
    stock: Optional[int] = None
    image: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    description: str
    image: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None

# --- LOGIN ---
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    admin = db.query(models.Admin).filter(models.Admin.username == form_data.username).first()
    
    if not admin or not verify_password(form_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": admin.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- PRODUCTS ---
@router.get("/products")
def get_products(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    # Προσθέτουμε το .order_by(models.Product.id) για να μην "χορεύουν" τα προϊόντα
    return db.query(models.Product)\
             .options(joinedload(models.Product.variants))\
             .order_by(models.Product.id)\
             .all()


@router.post("/products")
def create_product(data: ProductCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    product = models.Product(**data.model_dump(), is_active=True)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.patch("/products/{product_id}")
def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, val in data.model_dump(exclude_none=True).items():
        setattr(product, key, val)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"ok": True}

# --- VARIANTS ---
@router.patch("/variants/{variant_id}")
def update_variant(variant_id: int, variant_data: VariantUpdate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    db_variant = db.query(models.Variant).filter(models.Variant.id == variant_id).first()
    if not db_variant:
        raise HTTPException(status_code=404, detail="Variant not found")
    
    # Μετατρέπουμε τα δεδομένα σε dict, αγνοώντας όσα δεν στάλθηκαν
    update_data = variant_data.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(db_variant, key, value)
    
    db.commit()
    db.refresh(db_variant)
    return db_variant