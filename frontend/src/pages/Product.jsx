import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, cart } = useCart()

  const [product, setProduct] = useState(null)
  const [suggestedProducts, setSuggestedProducts] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    setVisible(false)
    setProduct(null)
    window.scrollTo({ top: 0, behavior: "smooth" })

    axios.get(`http://localhost:8000/products/${id}`).then(res => {
      setProduct(res.data)
      if (res.data.variants && res.data.variants.length > 0) {
        setSelectedColor(res.data.variants[0].color)
        setSelectedSize(res.data.variants[0].size)
      }
      setTimeout(() => setVisible(true), 100)
    })

    axios.get("http://localhost:8000/products").then(res => {
      const filtered = res.data
        .filter(p => p.id !== parseInt(id))
        .slice(0, 4)
      setSuggestedProducts(filtered)
    })
  }, [id])

  if (!product) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", letterSpacing: "0.3em", fontSize: "0.8rem", textTransform: "uppercase" }}>
      Loading The Edit...
    </div>
  )

  const colors = product.variants ? [...new Set(product.variants.map(v => v.color))] : []
  const sizes = product.variants ? [...new Set(product.variants.map(v => v.size))] : []
  const selectedVariant = product.variants ? product.variants.find(v => v.color === selectedColor && v.size === selectedSize) : null

  function handleAddToCart() {
    if (!selectedVariant) return
    addToCart({ name: product.name, color: selectedColor, size: selectedSize, price: selectedVariant.price, image: selectedVariant.image || product.image })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", overflowX: "hidden" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.5rem 3rem", borderBottom: "1px solid var(--border)",
        position: "sticky", top: 0, background: "rgba(8,8,8,0.9)",
        backdropFilter: "blur(10px)", zIndex: 100
      }}>
        <span
          onClick={() => navigate("/")}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", letterSpacing: "0.2em", color: "var(--gold)", cursor: "pointer" }}
        >
          GLOWST
        </span>
        <button
          onClick={() => navigate("/cart")}
          style={{ background: "none", border: "1px solid var(--border)", color: "var(--text)", padding: "0.5rem 1.2rem", letterSpacing: "0.1em", fontSize: "0.8rem", transition: "all 0.3s", cursor: "pointer" }}
          onMouseEnter={e => { e.target.style.borderColor = "var(--gold)"; e.target.style.color = "var(--gold)" }}
          onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text)" }}
        >
          BAG ({cart ? cart.length : 0})
        </button>
      </nav>

      {/* BACK BUTTON */}
      <div style={{ padding: "1.5rem 3rem" }}>
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", transition: "color 0.3s", cursor: "pointer" }}
          onMouseEnter={e => e.target.style.color = "var(--gold)"}
          onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
        >
          ← Back to Collection
        </button>
      </div>

      {/* PRODUCT DETAIL */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        gap: "4rem", padding: "0 3rem 5rem", maxWidth: "1200px", margin: "0 auto",
        borderBottom: "1px solid var(--border)"
      }}>

        {/* IMAGE */}
        <div style={{
          aspectRatio: "3/4", overflow: "hidden", background: "var(--bg-2)",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)"
        }}>
          <img
            src={selectedVariant?.image || product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s ease" }}
          />
        </div>

        {/* INFO */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s"
        }}>
          <p style={{ letterSpacing: "0.4em", fontSize: "0.7rem", color: "var(--gold)", textTransform: "uppercase", marginBottom: "1rem" }}>
            The Edit
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 300, lineHeight: 1.1 }}>
            {product.name}
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "1rem", lineHeight: 1.7, fontSize: "0.95rem", maxWidth: "90%" }}>
            {product.description}
          </p>

          {/* PRICE */}
          <div style={{ marginTop: "2.5rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "var(--gold)" }}>
            €{selectedVariant ? selectedVariant.price.toFixed(2) : "0.00"}
          </div>

          {/* COLORS */}
          <div style={{ marginTop: "2.5rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Color — <span style={{ color: "var(--text)" }}>{selectedColor}</span>
            </p>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              {colors.map(color => (
                <button key={color} onClick={() => setSelectedColor(color)} style={{
                  padding: "0.6rem 1.5rem", fontSize: "0.75rem", letterSpacing: "0.1em",
                  background: selectedColor === color ? "var(--bg-2)" : "none",
                  cursor: "pointer", transition: "all 0.3s",
                  border: selectedColor === color ? "1px solid var(--gold)" : "1px solid var(--border)",
                  color: selectedColor === color ? "var(--gold)" : "var(--text-muted)",
                }}>
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div style={{ marginTop: "2rem" }}>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Size — <span style={{ color: "var(--text)" }}>{selectedSize}</span>
            </p>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              {sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} style={{
                  width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", letterSpacing: "0.1em",
                  background: selectedSize === size ? "var(--bg-2)" : "none",
                  cursor: "pointer", transition: "all 0.3s",
                  border: selectedSize === size ? "1px solid var(--gold)" : "1px solid var(--border)",
                  color: selectedSize === size ? "var(--gold)" : "var(--text-muted)",
                }}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            style={{
              marginTop: "3rem", padding: "1.2rem 2rem", fontSize: "0.8rem",
              letterSpacing: "0.3em", textTransform: "uppercase", cursor: selectedVariant ? "pointer" : "not-allowed",
              transition: "all 0.4s", border: "1px solid",
              background: added ? "var(--gold)" : "none",
              borderColor: added ? "var(--gold)" : "var(--text)",
              color: added ? "#000" : "var(--text)",
              opacity: selectedVariant ? 1 : 0.5
            }}
          >
            {added ? "✓ Added to Bag" : "Add to Bag"}
          </button>
        </div> {/* ΤΕΛΟΣ INFO DIV */}
      </div> {/* ΤΕΛΟΣ PRODUCT DETAIL GRID */}

      {/* SUGGESTED PRODUCTS SECTION */}
      {suggestedProducts.length > 0 && (
        <div style={{ padding: "5rem 3rem", maxWidth: "1300px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ letterSpacing: "0.3em", fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Complete the look
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300, marginTop: "0.5rem" }}>
              You Might Also Like
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1.5rem"
          }}>
            {suggestedProducts.map((item, i) => (
              <div
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  cursor: "pointer", background: "var(--bg-2)",
                  border: `1px solid ${hoveredId === item.id ? "var(--gold)" : "var(--border)"}`,
                  overflow: "hidden",
                  transition: "all 0.3s",
                  boxShadow: hoveredId === item.id ? "0 10px 30px rgba(201,168,76,0.05)" : "none"
                }}
              >
                <div style={{ overflow: "hidden", aspectRatio: "3/4", position: "relative" }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                      transform: hoveredId === item.id ? "scale(1.05)" : "scale(1)"
                    }}
                  />
                </div>
                <div style={{ padding: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 400, margin: 0 }}>
                    {item.name}
                  </h3>
                  <span style={{ color: "var(--gold)", fontSize: "0.8rem" }}>
                    €{item.variants && item.variants.length > 0 ? Math.min(...item.variants.map(v => v.price)).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem 3rem", display: "flex", justifyContent: "space-between", color: "var(--text-muted)", fontSize: "0.8rem" }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)", fontSize: "1.2rem" }}>GLOWST</span>
        <p>© Nikpar 2026 — All rights reserved</p>
      </footer>
    </div>
  )
}