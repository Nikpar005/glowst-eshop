import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"
import { useState, useEffect } from "react"

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleCheckout() {
    setLoading(true)
    const res = await axios.post("http://localhost:8000/create-checkout-session", { items: cart })
    window.location.href = res.data.url
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.5rem 3rem", borderBottom: "1px solid var(--border)",
        background: "rgba(8,8,8,0.9)", backdropFilter: "blur(10px)"
      }}>
        <span
          onClick={() => navigate("/")}
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", letterSpacing: "0.2em", color: "var(--gold)", cursor: "pointer" }}
        >
          GLOWST
        </span>
        <span style={{ fontSize: "0.8rem", letterSpacing: "0.2em", color: "var(--text-muted)", textTransform: "uppercase" }}>
          Your Bag
        </span>
      </nav>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem" }}>

        {cart.length === 0 ? (
          <div style={{
            textAlign: "center", paddingTop: "6rem",
            opacity: visible ? 1 : 0, transition: "opacity 0.8s ease"
          }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, marginBottom: "1rem" }}>
              Your bag is empty
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
              Discover our collection and find something you love.
            </p>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none", border: "1px solid var(--gold)", color: "var(--gold)",
                padding: "0.8rem 2.5rem", letterSpacing: "0.2em", fontSize: "0.75rem", textTransform: "uppercase"
              }}
              onMouseEnter={e => { e.target.style.background = "var(--gold)"; e.target.style.color = "#000" }}
              onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "var(--gold)" }}
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", fontWeight: 300,
              marginBottom: "2rem", opacity: visible ? 1 : 0, transition: "opacity 0.8s"
            }}>
              Your Bag ({cart.length})
            </h1>

            {/* ITEMS */}
            <div style={{ borderTop: "1px solid var(--border)" }}>
              {cart.map((item, index) => (
                <div key={index} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "1.5rem 0", borderBottom: "1px solid var(--border)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: `all 0.6s ease ${index * 0.1}s`
                }}>
                  <div>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}>
                      {item.name}
                    </p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", letterSpacing: "0.1em", marginTop: "0.3rem" }}>
                      {item.color} · {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <span style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}>
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(index)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1rem", transition: "color 0.3s" }}
                      onMouseEnter={e => e.target.style.color = "#ff4444"}
                      onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "2rem 0", borderBottom: "1px solid var(--border)"
            }}>
              <span style={{ fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Total
              </span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "var(--gold)" }}>
                €{total.toFixed(2)}
              </span>
            </div>

            {/* CHECKOUT */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                marginTop: "2rem", width: "100%", padding: "1.2rem",
                fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase",
                background: loading ? "var(--bg-3)" : "var(--gold)",
                border: "1px solid var(--gold)", color: loading ? "var(--gold)" : "#000",
                transition: "all 0.4s", cursor: loading ? "wait" : "pointer"
              }}
              onMouseEnter={e => { if (!loading) { e.target.style.background = "none"; e.target.style.color = "var(--gold)" }}}
              onMouseLeave={e => { if (!loading) { e.target.style.background = "var(--gold)"; e.target.style.color = "#000" }}}
            >
              {loading ? "Redirecting..." : "Proceed to Checkout"}
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
                marginTop: "1rem", width: "100%", padding: "1rem",
                fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase",
                background: "none", border: "1px solid var(--border)", color: "var(--text-muted)",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => { e.target.style.borderColor = "var(--text)"; e.target.style.color = "var(--text)" }}
              onMouseLeave={e => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--text-muted)" }}
            >
              Continue Shopping
            </button>
          </>
        )}
      </div>
    </div>
  )
}