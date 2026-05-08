import Layout from '../../components/Layout'
import { supabase } from '../../lib/supabase'
import { useCart } from '../../context/CartContext'
import { ShoppingCart, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ProductPage({ product }) {
  const { dispatch, items } = useCart()
  const [added, setAdded] = useState(false)

  if (!product) return (
    <Layout title="Not Found">
      <div className="text-center py-40">
        <p className="text-poke-muted">Product not found.</p>
        <Link href="/shop" className="btn-primary mt-4 inline-block">Back to Shop</Link>
      </div>
    </Layout>
  )

  const canAdd = product.is_preorder || product.stock > 0

  const handleAdd = () => {
    dispatch({ type: 'ADD_ITEM', product })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Layout title={`${product.name} — PokéStore`}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/shop" className="flex items-center gap-2 text-poke-muted hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="aspect-square bg-poke-card border border-poke-border rounded-xl overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🃏</div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.categories && (
              <p className="text-poke-muted text-xs font-semibold uppercase tracking-widest mb-2">
                {product.categories.name}
              </p>
            )}
            <h1 className="font-display text-5xl tracking-wide leading-tight mb-4">{product.name}</h1>

            {product.is_preorder && (
              <div className="flex items-center gap-2 text-blue-400 text-sm mb-4">
                <Clock size={14} />
                <span>Pre-Order Item</span>
                {product.preorder_release_date && (
                  <span className="text-poke-muted">
                    — Releases {new Date(product.preorder_release_date).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
              </div>
            )}

            <p className="font-display text-6xl text-poke-yellow tracking-wide mb-6">
              ${parseFloat(product.price).toFixed(2)}
            </p>

            {product.description && (
              <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="mb-6">
              {product.is_preorder ? (
                <p className="text-blue-400 text-sm">✓ Pre-orders accepted — payment requested after confirmation</p>
              ) : product.stock > 0 ? (
                <p className="text-green-400 text-sm">✓ In stock — {product.stock} available</p>
              ) : (
                <p className="text-gray-500 text-sm">✗ Out of stock</p>
              )}
            </div>

            {canAdd ? (
              <button
                onClick={handleAdd}
                className={`btn-primary w-full flex items-center justify-center gap-2 text-base py-3 ${added ? 'bg-green-400' : ''}`}
              >
                <ShoppingCart size={18} />
                {added ? 'Added to Cart!' : product.is_preorder ? 'Pre-Order Now' : 'Add to Cart'}
              </button>
            ) : (
              <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed py-3">
                Out of Stock
              </button>
            )}

            <div className="mt-6 p-4 bg-poke-card border border-poke-border rounded-lg text-sm text-poke-muted">
              <p>📦 Orders are manually confirmed. You'll be contacted via WhatsApp/email for payment details after placing your order.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', params.id)
    .eq('active', true)
    .single()

  return { props: { product: product || null } }
}
