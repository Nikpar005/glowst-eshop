import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useEffect, useState } from "react"

export default function Success() {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    clearCart()
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

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
      </nav>

      {/* CONTENT */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "3rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 1s ease"
      }}>
        {/* glow */}
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "5rem", marginBottom: "1rem" }}>
          ✦
        </p>

        <p style={{ letterSpacing: "0.4em", fontSize: "0.7rem", color: "var(--gold)", textTransform: "uppercase", marginBottom: "1rem" }}>
          Order Confirmed
        </p>

        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300, lineHeight: 1.1, marginBottom: "1.5rem" }}>
          Thank you for<br /><em>your order</em>
        </h1>

        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "400px", lineHeight: 1.8, marginBottom: "3rem" }}>
          Your order has been received and is being processed. You will receive a confirmation email shortly.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            background: "none", border: "1px solid var(--gold)", color: "var(--gold)",
            padding: "0.8rem 2.5rem", letterSpacing: "0.2em", fontSize: "0.75rem",
            textTransform: "uppercase", transition: "all 0.4s"
          }}
          onMouseEnter={e => { e.target.style.background = "var(--gold)"; e.target.style.color = "#000" }}
          onMouseLeave={e => { e.target.style.background = "none"; e.target.style.color = "var(--gold)" }}
        >
          Continue Shopping
        </button>
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid var(--border)", padding: "2rem 3rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "var(--text-muted)", fontSize: "0.8rem", letterSpacing: "0.1em"
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", color: "var(--gold)" }}>GLOWST</span>
        <span>© 2026 — All rights reserved</span>
      </footer>

    </div>
  )
}