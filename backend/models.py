from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    image = Column(String)
    is_active = Column(Boolean, default=True)

    # Σύνδεση με τα Variants
    variants = relationship("Variant", back_populates="product", cascade="all, delete-orphan")

class Variant(Base):
    __tablename__ = "variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    
    color = Column(String)
    size = Column(String)
    price = Column(Float)
    stock = Column(Integer)
    image = Column(String)

    # Σύνδεση με το Product
    product = relationship("Product", back_populates="variants")

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)  # <-- Πρέπει να λέγεται ακριβώς έτσι!