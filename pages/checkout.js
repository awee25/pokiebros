import { useState } from 'react'
import Layout from '../components/Layout'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Checkout() {
  const { items, total, dispatch } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', notes: ''
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  if (items.length === 0) {
    return (
      <Layout title="Checkout — PokéStore">
        <div className="text-center py-20">
          <p className="text-poke-muted mb-4">Your cart is empty.</p>
          <Link href="/shop" className="btn-primary">Go to Shop</Link>
        </div>
      </Layout>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.address) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items, subtotal: total }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to place order')
      dispatch({ type: 'CLEAR' })
      router.push(`/order/${data.order.id}`)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Layout title="Checkout — PokéStore">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="font-display text-5xl tracking-wide mb-8">CHECKOUT</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
            <div className="card p-6">
              <h2 className="font-display text-2xl tracking-wide mb-5">YOUR DETAILS</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input" placeholder="John Tan" value={form.name}
                    onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Email *</label>
                    <input className="input" type="email" placeholder="john@email.com" value={form.email}
                      onChange={e => set('email', e.target.value)} required />
                  </div>
                  <div>
                    <label className="label">WhatsApp / Phone</label>
                    <input className="input" placeholder="+65 9xxx xxxx" value={form.phone}
                      onChange={e => set('phone', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Delivery Address *</label>
                  <textarea className="input" rows={3} placeholder="Block 123, Street Name, #01-23, Singapore 123456"
                    value={form.address} onChange={e => set('address', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Notes for Seller (optional)</label>
                  <textarea className="input" rows={2}
                    placeholder="Any special requests, gift wrapping, etc."
                    value={form.notes} onChange={e => set('notes', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="card p-4 text-sm text-poke-muted">
              <p className="font-semibold text-white mb-1">How it works:</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Place your order here</li>
                <li>We review and confirm your order (usually within 24h)</li>
                <li>We'll contact you via WhatsApp/email with payment details</li>
                <li>Once payment is received, we ship your order</li>
              </ol>
            </div>

            {error && <p className="text-poke-red text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          {/* Summary */}
          <div className="card p-6 h-fit">
            <h2 className="font-display text-2xl tracking-wide mb-4">ORDER SUMMARY</h2>
            <div className="space-y-3 mb-4 pb-4 border-b border-poke-border">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="text-white leading-tight">{item.name}</p>
                    <p className="text-poke-muted">Qty: {item.quantity}{item.is_preorder ? ' · Pre-Order' : ''}</p>
                  </div>
                  <span className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-display text-2xl text-poke-yellow">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
