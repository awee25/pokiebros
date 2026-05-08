import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Clock } from 'lucide-react'

export default function ProductCard({ product }) {
  const { dispatch, items } = useCart()
  const inCart = items.find(i => i.id === product.id)

  const stockLabel = () => {
    if (product.is_preorder) return <span className="badge-preorder">Pre-Order</span>
    if (product.stock === 0) return <span className="badge-outofstock">Out of Stock</span>
    if (product.stock <= 5) return <span className="badge-instock">Only {product.stock} left</span>
    return <span className="badge-instock">In Stock</span>
  }

  const canAdd = product.is_preorder || product.stock > 0

  return (
    <div className="card group hover:border-poke-yellow/40 transition-all duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-poke-border relative overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">🃏</span>
            </div>
          )}
          {product.is_preorder && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              <Clock size={10} /> PRE-ORDER
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-sm leading-tight hover:text-poke-yellow transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="font-display text-2xl text-poke-yellow tracking-wide">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            {stockLabel()}
          </div>
          {canAdd && (
            <button
              onClick={() => dispatch({ type: 'ADD_ITEM', product })}
              className="p-2 rounded-lg bg-poke-yellow text-black hover:bg-yellow-400 transition-colors"
              title={inCart ? 'Add another' : 'Add to cart'}
            >
              <ShoppingCart size={16} />
            </button>
          )}
        </div>
        {product.is_preorder && product.preorder_release_date && (
          <p className="text-xs text-poke-muted mt-2">
            Releases: {new Date(product.preorder_release_date).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  )
}
