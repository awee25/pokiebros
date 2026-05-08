import AdminLayout from '../../components/admin/AdminLayout'
import { useAdminAuth, adminHeaders } from '../../lib/useAdminAuth'
import { useEffect, useState } from 'react'
import { ShoppingBag, Package, Clock, DollarSign } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-poke-muted text-xs uppercase tracking-wider">{label}</p>
        <p className="font-display text-3xl tracking-wide">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { token, ready } = useAdminAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ready) return
    fetch('/api/admin/orders', { headers: adminHeaders(token) })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [ready, token])

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => ['confirmed', 'payment_requested'].includes(o.status)).length,
    revenue: orders.filter(o => ['paid', 'shipped', 'completed'].includes(o.status))
      .reduce((s, o) => s + parseFloat(o.subtotal), 0).toFixed(2),
  }

  const recent = orders.slice(0, 5)

  if (!ready) return null

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide">DASHBOARD</h1>
        <p className="text-poke-muted text-sm mt-1">Welcome back!</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} color="bg-blue-900/50 text-blue-400" />
        <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-yellow-900/50 text-yellow-400" />
        <StatCard icon={Package} label="Confirmed" value={stats.confirmed} color="bg-green-900/50 text-green-400" />
        <StatCard icon={DollarSign} label="Revenue (SGD)" value={`$${stats.revenue}`} color="bg-poke-yellow/20 text-poke-yellow" />
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-poke-border flex items-center justify-between">
          <h2 className="font-display text-xl tracking-wide">RECENT ORDERS</h2>
          <a href="/admin/orders" className="text-poke-yellow text-sm hover:underline">View all →</a>
        </div>
        {loading ? (
          <div className="p-8 text-center text-poke-muted">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-poke-muted">No orders yet.</div>
        ) : (
          <div className="divide-y divide-poke-border">
            {recent.map(order => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-poke-border/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm">{order.order_number}</p>
                  <p className="text-poke-muted text-xs">{order.customer_name} · {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-poke-yellow">${parseFloat(order.subtotal).toFixed(2)}</p>
                  <span className="text-xs text-poke-muted capitalize">{order.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
