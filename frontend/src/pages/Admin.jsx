import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const API = "http://localhost:8000"

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("admin-token"))
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) fetchProducts()
  }, [token])

  async function fetchProducts() {
    try {
      const res = await axios.get(`${API}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Ταξινομούμε τα προϊόντα βάσει ID για να μην αλλάζουν σειρά
      const sortedProducts = res.data.sort((a, b) => a.id - b.id);
      setProducts(sortedProducts)
    } catch {
      setToken(null)
      localStorage.removeItem("admin-token")
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams()
      params.append("username", username.trim())
      params.append("password", password.trim())

      const res = await axios.post(`${API}/admin/login`, params)
      
      localStorage.setItem("admin-token", res.data.access_token)
      setToken(res.data.access_token)
    } catch (err) {
      console.error("Login Error:", err.response?.data)
      setError("Λάθος username ή password")
    }
    setLoading(false)
  }

  async function toggleActive(product) {
    await axios.patch(`${API}/admin/products/${product.id}`,
      { is_active: !product.is_active },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchProducts()
  }

  async function updateVariantField(variantId, field, newValue) {
    let payload = {};
    if (field === 'price') payload.price = parseFloat(newValue) || 0;
    if (field === 'color') payload.color = String(newValue).trim();
    if (field === 'size') payload.size = String(newValue).trim();

    try {
      const res = await axios.patch(`${API}/admin/variants/${variantId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.status === 200) {
        console.log("✅ Ενημερώθηκε!");
        // Φρεσκάρουμε τα δεδομένα για να συγχρονιστεί η οθόνη με τη βάση
        await fetchProducts(); 
      }
    } catch (err) {
      console.error(`Σφάλμα στην ενημέρωση:`, err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin-token")
    setToken(null)
  }

  if (!token) return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        border: "1px solid var(--border)", padding: "3rem",
        width: "100%", maxWidth: "400px"
      }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.7rem", letterSpacing: "0.4em", color: "var(--gold)", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          Glowst
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, marginBottom: "2rem" }}>
          Admin Panel
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Username
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                display: "block", width: "100%", marginTop: "0.5rem",
                background: "var(--bg-2)", border: "1px solid var(--border)",
                color: "var(--text)", padding: "0.8rem", fontSize: "0.9rem",
                outline: "none", fontFamily: "'DM Sans', sans-serif"
              }}
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                display: "block", width: "100%", marginTop: "0.5rem",
                background: "var(--bg-2)", border: "1px solid var(--border)",
                color: "var(--text)", padding: "0.8rem", fontSize: "0.9rem",
                outline: "none", fontFamily: "'DM Sans', sans-serif"
              }}
            />
          </div>

          {error && <p style={{ color: "#ff4444", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "1rem", background: "var(--gold)",
              border: "none", color: "#000", fontSize: "0.8rem",
              letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer"
            }}
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.5rem 3rem", borderBottom: "1px solid var(--border)",
        background: "rgba(8,8,8,0.9)", backdropFilter: "blur(10px)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", letterSpacing: "0.2em", color: "var(--gold)" }}>
            GLOWST
          </span>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.3em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            Admin Panel
          </span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/")}
            style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", padding: "0.5rem 1.2rem", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer" }}
          >
            View Shop
          </button>
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "1px solid #ff4444", color: "#ff4444", padding: "0.5rem 1.2rem", fontSize: "0.75rem", letterSpacing: "0.1em", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: "3rem" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 300, marginBottom: "2rem" }}>
          Products ({products.length})
        </h2>

        {products.map(product => (
          <div key={product.id} style={{
            border: `1px solid ${product.is_active ? "var(--border)" : "#ff444433"}`,
            marginBottom: "1rem", background: "var(--bg-2)"
          }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "1.2rem 1.5rem", borderBottom: "1px solid var(--border)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src={product.image} alt={product.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", margin: 0 }}>{product.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0.2rem 0 0 0" }}>{product.description}</p>
                </div>
              </div>
              <button
                onClick={() => toggleActive(product)}
                style={{
                  padding: "0.5rem 1.5rem", fontSize: "0.75rem", letterSpacing: "0.1em",
                  cursor: "pointer", border: "1px solid",
                  background: product.is_active ? "none" : "#ff444422",
                  borderColor: product.is_active ? "var(--gold)" : "#ff4444",
                  color: product.is_active ? "var(--gold)" : "#ff4444",
                  transition: "all 0.3s"
                }}
              >
                {product.is_active ? "✓ Active" : "✕ Inactive"}
              </button>
            </div>

            <div style={{ padding: "1rem 1.5rem" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                Variants
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "0.8rem" }}>
                {product.variants && [...product.variants].sort((a,b) => a.id - b.id).map(variant => (
                  <div key={variant.id} style={{
                    border: "1px solid var(--border)", padding: "0.8rem",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
                    background: "rgba(255,255,255,0.02)"
                  }}>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="text"
                        defaultValue={variant.color}
                        onBlur={e => {
                          if(e.target.value !== variant.color) {
                            updateVariantField(variant.id, 'color', e.target.value)
                          }
                        }}
                        style={{
                          width: "80px", background: "none", border: "none", borderBottom: "1px solid var(--border)",
                          color: "var(--text)", fontSize: "0.85rem", outline: "none", fontFamily: "'DM Sans', sans-serif"
                        }}
                      />
                      <span style={{ color: "var(--border)" }}>/</span>
                      <input
                        type="text"
                        defaultValue={variant.size}
                        onBlur={e => {
                          if(e.target.value !== variant.size) {
                            updateVariantField(variant.id, 'size', e.target.value)
                          }
                        }}
                        style={{
                          width: "40px", background: "none", border: "none", borderBottom: "1px solid var(--border)",
                          color: "var(--text)", fontSize: "0.85rem", outline: "none", textAlign: "center", fontFamily: "'DM Sans', sans-serif"
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <span style={{ color: "var(--gold)", fontSize: "0.8rem" }}>€</span>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={variant.price}
                        onBlur={e => {
                          if(parseFloat(e.target.value) !== variant.price) {
                            updateVariantField(variant.id, 'price', e.target.value)
                          }
                        }}
                        style={{
                          width: "60px", background: "none", border: "none",
                          borderBottom: "1px solid var(--border)", color: "var(--gold)",
                          fontSize: "0.9rem", padding: "0.2rem", textAlign: "right",
                          outline: "none", fontFamily: "'DM Sans', sans-serif"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}