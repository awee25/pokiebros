import AdminLayout from '../../components/admin/AdminLayout'
import { useAdminAuth, adminHeaders } from '../../lib/useAdminAuth'
import { useEffect, useState } from 'react'
import { Clock, ExternalLink } from 'lucide-react'

export default function AdminPreorders() {
  const { token, ready } = useAdminAuth()
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    Promise.all([
      fetch('/api/admin/orders', { headers: adminHeaders(token) }).then(r => r.json()),
      fetch('/api/admin/products', { headers: adminHeaders(token) }).then(r => r.json()),
    ]).then(([ordersData, productsData]) => {
      setOrders(Array.isArray(ordersData) ? ordersData : [])
      setProducts(Array.isArray(productsData) ? productsData.filter(p => p.is_preorder && p.active) : [])
      setLoading(false)
    })
  }, [ready])

  // Orders containing at least one pre-order item
  const preOrders = orders.filter(o =>
    o.order_items?.some(i => i.is_preorder)
  )

  const updateStatus = async (id, status) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify({ id, status }),
    })
    // Refresh
    fetch('/api/admin/orders', { headers: adminHeaders(token) })
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
  }

  if (!ready) return null

  return (
    <AdminLayout title="Pre-Orders">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide">PRE-ORDER MANAGEMENT</h1>
        <p className="text-poke-muted text-sm mt-1">Manage upcoming product pre-orders</p>
      </div>

      {/* Pre-order products summary */}
      <section className="mb-10">
        <h2 className="font-display text-2xl tracking-wide mb-4">ACTIVE PRE-ORDER PRODUCTS</h2>
        {loading ? <div className="text-poke-muted">Loading...</div> : products.length === 0 ? (
          <div className="card p-6 text-poke-muted text-sm text-center">
            No pre-order products yet. Add them in the Products section.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => {
              const itemOrders = preOrders.filter(o =>
                o.order_items?.some(i => i.is_preorder && i.product_id === p.id)
              )
              const totalQty = itemOrders.reduce((sum, o) =>
                sum + (o.order_items?.find(i => i.product_id === p.id)?.quantity || 0), 0
              )
              return (
                <div key={p.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-poke-border flex-shrink-0">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center">🃏</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight">{p.name}</p>
                      <p className="font-display text-xl text-poke-yellow">${parseFloat(p.price).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-poke-border grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="font-display text-xl text-white">{itemOrders.length}</p>
                      <p className="text-poke-muted text-xs">Orders</p>
                    </div>
                    <div>
                      <p className="font-display text-xl text-white">{totalQty}</p>
                      <p className="text-poke-muted text-xs">Units</p>
                    </div>
                    <div>
                      <p className="font-display text-xl text-poke-yellow">
                        ${(totalQty * parseFloat(p.price)).toFixed(0)}
                      </p>
                      <p className="text-poke-muted text-xs">Value</p>
                    </div>
                  </div>
                  {p.preorder_release_date && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-400">
                      <Clock size={12} />
                      Release: {new Date(p.preorder_release_date).toLocaleDateString('en-SG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Pre-order orders */}
      <section>
        <h2 className="font-display text-2xl tracking-wide mb-4">PRE-ORDER ORDERS ({preOrders.length})</h2>
        <div className="card overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-poke-muted">Loading...</div>
          ) : preOrders.length === 0 ? (
            <div className="p-8 text-center text-poke-muted">No pre-orders placed yet.</div>
          ) : (
            <div className="divide-y divide-poke-border">
              {preOrders.map(order => (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{order.order_number}</span>
                        <span className="badge-preorder">Pre-Order</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          order.status === 'pending' ? 'bg-gray-800 text-gray-300' :
                          order.status === 'confirmed' ? 'bg-blue-900 text-blue-300' :
                          order.status === 'shipped' ? 'bg-poke-yellow/20 text-poke-yellow' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-poke-muted text-xs">{order.customer_name} · {order.customer_email}</p>
                      <div className="mt-2 space-y-0.5">
                        {order.order_items?.filter(i => i.is_preorder).map(item => (
                          <p key={item.id} className="text-sm text-gray-400">
                            {item.product_name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="input w-auto text-xs py-1.5"
                        defaultValue={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                      >
                        {['pending', 'confirmed', 'payment_requested', 'paid', 'shipped', 'completed', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  )
}
