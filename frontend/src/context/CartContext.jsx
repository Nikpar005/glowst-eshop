import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export function CartProvider({ children }) {
  // Φόρτωσε από localStorage αν υπάρχει
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("glowst-cart")
    return saved ? JSON.parse(saved) : []
  })

  // Αποθήκευσε κάθε φορά που αλλάζει το cart
  useEffect(() => {
    localStorage.setItem("glowst-cart", JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(
        i => i.name === item.name && i.color === item.color && i.size === item.size
      )
      if (existing) {
        return prev.map(i =>
          i.name === item.name && i.color === item.color && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index))
  }

  function clearCart() {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}