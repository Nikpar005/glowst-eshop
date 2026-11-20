import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"

const API = "http://localhost:8000";

// ── 1. Custom Cursor (Optimized) ────────────────
function CustomCursor() {
  const cursorRef = useRef(null)
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    }
    const handleMouseOver = (e) => setHovering(!!e.target.closest('a, button, .product-card'));

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    }
  }, [])

  return (
    <div ref={cursorRef} style={{
      position: "fixed", top: 0, left: 0,
      width: hovering ? "65px" : "22px", height: hovering ? "65px" : "22px",
      border: "1px solid #c9a84c", borderRadius: "50%",
      pointerEvents: "none", zIndex: 9999,
      transform: "translate3d(-100px, -100px, 0)",
      marginTop: hovering ? "-32px" : "-11px", marginLeft: hovering ? "-32px" : "-11px",
      transition: "width 0.3s ease-out, height 0.3s ease-out, margin 0.3s ease-out",
      mixBlendMode: "difference",
    }} />
  )
}

// ── 2. Constellation Canvas (High Performance) ────────────────
function ConstellationCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas.getContext("2d");
    let animId; let isVisible = true;

    // Σταματάει το animation αν ο χρήστης σκρολάρει χαμηλά
    const observer = new IntersectionObserver(([entry]) => isVisible = entry.isIntersecting);
    if (canvas) observer.observe(canvas);

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1, // Έντονες τελείες
      dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4
    }))

    const draw = () => {
      if (!isVisible) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, i) => {
        p.x += p.dx; p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1

        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.shadowBlur = 10; ctx.shadowColor = "#c9a84c"; // Gold Glow
        ctx.fillStyle = "rgba(201, 168, 76, 0.9)"; ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]; const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2)
          if (dist < 140) {
            ctx.beginPath(); ctx.strokeStyle = `rgba(201, 168, 76, ${0.25 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6; ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke()
          }
        }
      })
      animId = requestAnimationFrame(draw)
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); observer.disconnect(); }
  }, [])
  return <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />
}

export default function Home() {
  const [products, setProducts] = useState([]); const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); const [hoveredId, setHoveredId] = useState(null);
  const collectionRef = useRef(null); const navigate = useNavigate(); const { cart } = useCart();

  useEffect(() => {
    axios.get(`${API}/products`).then(res => {
      setProducts(res.data); setLoading(false);
    }).catch(() => setLoading(false)).finally(() => setTimeout(() => setVisible(true), 100))
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#fff", overflowX: "hidden" }}>
      <CustomCursor />

      {/* NAVBAR */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 3rem",
        position: "fixed", top: 0, width: "100%", background: "rgba(5,5,5,0.7)", backdropFilter: "blur(12px)", zIndex: 100, boxSizing: "border-box"
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", letterSpacing: "0.2em", color: "#c9a84c" }}>GLOWST</span>
        <button onClick={() => navigate("/cart")} style={{ background: "none", border: "1px solid #c9a84c", color: "#c9a84c", padding: "0.5rem 1.5rem", cursor: "pointer", fontSize: "0.85rem", borderRadius: "2px", transition: "0.3s" }}>
          BAG ({cart?.length || 0})
        </button>
      </nav>

      {/* HERO */}
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <ConstellationCanvas />
        <div style={{ position: "absolute", width: "100%", height: "100%", background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 75%)", zIndex: 1 }} />
        <div style={{ textAlign: "center", zIndex: 2 }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3.5rem, 12vw, 9.5rem)", fontWeight: 300, margin: 0, letterSpacing: "-0.02em",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            Wear the <em style={{ color: "#c9a84c", fontStyle: "italic" }}>Silence</em>
          </h1>
          <button
            onClick={() => collectionRef.current?.scrollIntoView({ behavior: "smooth" })}
            style={{ marginTop: "3rem", background: "none", border: "1px solid rgba(201, 168, 76, 0.5)", color: "#c9a84c", padding: "1.2rem 2.5rem", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer", transition: "0.4s", opacity: visible ? 1 : 0 }}
          >
            Explore Collection ↓
          </button>
        </div>
      </div>

      {/* GRID */}
      <div ref={collectionRef} style={{ padding: "0 5vw 10vw" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "70px 40px", maxWidth: "1650px", margin: "0 auto" }}>
          {loading ? [1, 2, 3, 4].map(i => <div key={i} style={{ aspectRatio: "3/4", background: "#111" }} />) :
            products.map((p, idx) => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)} onMouseEnter={() => setHoveredId(p.id)} onMouseLeave={() => setHoveredId(null)} style={{ cursor: "pointer" }}>
                <div style={{ overflow: "hidden", aspectRatio: "3/4", background: "#0a0a0a", marginBottom: "1.5rem" }}>
                  <img 
                  src={p.image} 
                  alt={p.name} 
                  loading={idx < 2 ? "eager" : "lazy"} 
                  decoding="async"
                  style={{ 
                   width: "100%", 
                   height: "100%", 
                    objectFit: "cover", 
                    transition: "1.8s cubic-bezier(0.16, 1, 0.3, 1)", 
                    transform: hoveredId === p.id ? "scale(1.1)" : "scale(1)" 
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0 5px" }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 400, margin: 0 }}>{p.name}</h3>
                  <span style={{ color: "#c9a84c", fontSize: "1.15rem" }}>€{(p.variants?.[0]?.price || 0).toFixed(2)}</span>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');
        body { margin: 0; cursor: none !important; background: #050505; }
        button, a, .product-card { cursor: none !important; }
        @media (max-width: 768px) { body, .product-card { cursor: auto !important; } }
      `}</style>
    </div>
  )
}