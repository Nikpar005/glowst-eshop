import time
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session, joinedload

# Εισαγωγή των δικών σου αρχείων
import models
import admin
import stripe_api 
from database import SessionLocal, engine

# 1. Δημιουργία πινάκων στη βάση δεδομένων (αν δεν υπάρχουν)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Glowst E-shop API",
    description="Backend για το Glowst e-shop με FastAPI και SQLite",
    version="1.0.0"
)

# 2. Ρυθμίσεις CORS (Επιτρέπει στη React να μιλάει με το API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Σε παραγωγή βάλε το συγκεκριμένο domain σου
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Middleware για μέτρηση χρόνου απόκρισης (Performance Tracking)
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# 4. Global Exception Handler (Προστατεύει τον server από κρασαρίσματα)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "message": "Παρουσιάστηκε εσωτερικό σφάλμα",
            "details": str(exc)
        },
    )

# 5. Σύνδεση των Routers
app.include_router(admin.router)
app.include_router(stripe_api.router, tags=["Payments"])

# 6. Dependency για τη βάση δεδομένων
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ΓΙΑ ΤΟ FRONTEND ---

@app.get("/products", tags=["Store"])
def get_products(q: str = None, db: Session = Depends(get_db)):
    """
    Επιστρέφει όλα τα προϊόντα. 
    Υποστηρίζει αναζήτηση μέσω της παραμέτρου ?q=...
    """
    query = db.query(models.Product).options(joinedload(models.Product.variants))
    
    if q:
        query = query.filter(
            (models.Product.name.ilike(f"%{q}%")) | 
            (models.Product.description.ilike(f"%{q}%"))
        )
    
    return query.all()

@app.get("/products/{product_id}", tags=["Store"])
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Επιστρέφει ένα συγκεκριμένο προϊόν μαζί με τα variants του.
    """
    product = db.query(models.Product).options(
        joinedload(models.Product.variants)
    ).filter(models.Product.id == product_id).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Το προϊόν δεν βρέθηκε")
    
    return product

@app.get("/health", tags=["System"])
def health_check():
    """Ελέγχει αν ο server είναι online"""
    return {
        "status": "online",
        "timestamp": time.time(),
        "environment": "development"
    }

# Τρέξε τον server με: py -3.13 -m uvicorn main:app --reload