import AdminLayout from '../../components/admin/AdminLayout'
import { useAdminAuth, adminHeaders } from '../../lib/useAdminAuth'
import { useEffect, useState } from 'react'
import { Search, ChevronDown, ChevronUp, Pencil, X } from 'lucide-react'

const STATUSES = ['pending', 'confirmed', 'payment_requested', 'paid', 'shipped', 'completed', 'cancelled']

const STATUS_COLORS = {
  pending: 'bg-gray-800 text-gray-300',
  confirmed: 'bg-blue-900 text-blue-300',
  payment_requested: 'bg-yellow-900 text-yellow-300',
  paid: 'bg-green-900 text-green-300',
  shipped: 'bg-poke-yellow/20 text-poke-yellow',
  completed: 'bg-green-900 text-green-300',
  cancelled: 'bg-red-900 text-red-300',
}

function OrderRow({ order, token, onUpdate }) {
  const [open, setOpen] = useState(false)
  const [editStatus, setEditStatus] = useState(order.status)
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: adminHeaders(token),
      body: JSON.stringify({ id: order.id, status: editStatus, admin_notes: adminNotes }),
    })
    if (res.ok) onUpdate()
    setSaving(false)
  }

  return (
    <div className="border-b border-poke-border last:border-0">
      <div
        className="flex items-center justify-between p-4 hover:bg-poke-border/20 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-sm">{order.order_number}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-poke-muted text-xs mt-0.5">
            {order.customer_name} · {order.customer_email}
            {order.customer_phone && ` · ${order.customer_phone}`}
          </p>
        </div>
        <div className="text-right ml-4">
          <p className="font-display text-xl text-poke-yellow">${parseFloat(order.subtotal).toFixed(2)}</p>
          <p className="text-poke-muted text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        {open ? <ChevronUp size={16} className="ml-2 text-poke-muted" /> : <ChevronDown size={16} className="ml-2 text-poke-muted" />}
      </div>

      {open && (
        <div className="px-4 pb-5 bg-poke-dark/50 space-y-4">
          {/* Items */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-poke-muted mb-2">Items</p>
            <div className="space-y-1">
              {order.order_items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.product_name} × {item.quantity}{item.is_preorder ? ' (Pre-Order)' : ''}</span>
                  <span className="text-poke-muted">${(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-poke-muted mb-1">Delivery Address</p>
            <p className="text-sm">{order.customer_address}</p>
          </div>

          {order.customer_notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-poke-muted mb-1">Customer Notes</p>
              <p className="text-sm text-gray-400">{order.customer_notes}</p>
            </div>
          )}

          {/* Update status */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-poke-border">
            <div className="flex-1 min-w-[160px]">
              <label className="label">Update Status</label>
              <select className="input" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="label">Admin Notes</label>
              <input className="input" value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Internal notes..." />
            </div>
            <div className="flex items-end">
              <button onClick={save} disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminOrders() {
  const { token, ready } = useAdminAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const fetchOrders = () => {
    if (!ready) return
    const params = new URLSearchParams()
    if (filterStatus) params.set('status', filterStatus)
    if (search) params.set('search', search)
    fetch(`/api/admin/orders?${params}`, { headers: adminHeaders(token) })
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => { if (ready) fetchOrders() }, [ready, filterStatus])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchOrders()
  }

  if (!ready) return null

  return (
    <AdminLayout title="Orders">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-4xl tracking-wide">ORDERS</h1>
        <span className="text-poke-muted text-sm">{orders.length} orders</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1 min-w-[180px] max-w-xs flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-poke-muted" />
            <input className="input pl-8" placeholder="Search name, email, #..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button type="submit" className="btn-secondary px-3">Go</button>
        </form>
        <select className="input w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-poke-muted">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-poke-muted">No orders found.</div>
        ) : (
          orders.map(order => (
            <OrderRow key={order.id} order={order} token={token} onUpdate={fetchOrders} />
          ))
        )}
      </div>
    </AdminLayout>
  )
}
