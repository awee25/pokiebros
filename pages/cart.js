import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function Cart() {
  const { items, total, count, dispatch } = useCart()

  if (count === 0) return (
    <Layout title="Cart — PokéStore">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={64} className="mx-auto text-poke-muted mb-4" />
        <h1 className="font-display text-4xl mb-2">YOUR CART IS EMPTY</h1>
        <p className="text-poke-muted mb-8">Add some Pokémon products to get started!</p>
        <Link href="/shop" className="btn-primary text-base px-8 py-3">Browse Shop</Link>
      </div>
    </Layout>
  )

  return (
    <Layout title="Cart — PokéStore">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-display text-5xl tracking-wide mb-8">YOUR CART</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="card p-4 flex gap-4">
                <div className="w-20 h-20 bg-poke-border rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🃏</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-sm hover:text-poke-yellow transition-colors line-clamp-2">{item.name}</h3>
                    </Link>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
                      className="text-poke-muted hover:text-poke-red transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {item.is_preorder && (
                    <span className="badge-preorder text-xs mt-1 inline-block">Pre-Order</span>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-poke-border rounded-lg">
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.quantity - 1 })}
                        className="p-2 hover:text-poke-yellow transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, qty: item.quantity + 1 })}
                        className="p-2 hover:text-poke-yellow transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-display text-xl text-poke-yellow">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit">
            <h2 className="font-display text-2xl tracking-wide mb-4">ORDER SUMMARY</h2>
            <div className="space-y-2 mb-4 pb-4 border-b border-poke-border">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-poke-muted truncate mr-2">{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold mb-6">
              <span>Subtotal</span>
              <span className="font-display text-2xl text-poke-yellow">${total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-poke-muted mb-4">
              Shipping will be confirmed when your order is processed.
            </p>
            <Link href="/checkout" className="btn-primary w-full text-center block text-base py-3">
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="btn-secondary w-full text-center block mt-2 text-base py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
