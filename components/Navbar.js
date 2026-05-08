import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-poke-dark/95 backdrop-blur border-b border-poke-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-3xl text-poke-yellow tracking-wider">POKÉSTORE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/shop" className="text-gray-300 hover:text-poke-yellow transition-colors">Shop</Link>
          <Link href="/shop?preorder=true" className="text-blue-400 hover:text-blue-300 transition-colors">Pre-Orders</Link>
        </div>

        {/* Cart */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 hover:text-poke-yellow transition-colors">
            <ShoppingCart size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-poke-yellow text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1">
              <span className="block w-5 h-0.5 bg-white"></span>
              <span className="block w-5 h-0.5 bg-white"></span>
              <span className="block w-5 h-0.5 bg-white"></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-poke-border px-4 py-3 space-y-3 bg-poke-dark">
          <Link href="/shop" className="block text-gray-300 hover:text-poke-yellow" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/shop?preorder=true" className="block text-blue-400 hover:text-blue-300" onClick={() => setMenuOpen(false)}>Pre-Orders</Link>
        </div>
      )}
    </nav>
  )
}
