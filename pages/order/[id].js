import Layout from '../../components/Layout'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import Link from 'next/link'
import { CheckCircle, Clock, Package, Truck, XCircle, CreditCard } from 'lucide-react'

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: CheckCircle, color: 'text-gray-400' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-blue-400' },
  { key: 'payment_requested', label: 'Payment Requested', icon: CreditCard, color: 'text-yellow-400' },
  { key: 'paid', label: 'Payment Received', icon: CheckCircle, color: 'text-green-400' },
  { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-poke-yellow' },
  { key: 'completed', label: 'Completed', icon: Package, color: 'text-green-400' },
]

const STATUS_ORDER = ['pending', 'confirmed', 'payment_requested', 'paid', 'shipped', 'completed']

function StatusBadge({ status }) {
  const map = {
    pending: 'bg-gray-800 text-gray-300',
    confirmed: 'bg-blue-900 text-blue-300',
    payment_requested: 'bg-yellow-900 text-yellow-300',
    paid: 'bg-green-900 text-green-300',
    shipped: 'bg-poke-yellow/20 text-poke-yellow',
    completed: 'bg-green-900 text-green-300',
    cancelled: 'bg-red-900 text-red-300',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${map[status] || 'bg-gray-800 text-gray-300'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default function OrderPage({ order }) {
  if (!order) return (
    <Layout title="Order Not Found">
      <div className="text-center py-20">
        <p className="text-poke-muted">Order not found.</p>
        <Link href="/" className="btn-primary mt-4 inline-block">Go Home</Link>
      </div>
    </Layout>
  )

  const currentStep = STATUS_ORDER.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <Layout title={`Order ${order.order_number}`}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          {isCancelled ? (
            <XCircle size={56} className="mx-auto text-poke-red mb-3" />
          ) : (
            <CheckCircle size={56} className="mx-auto text-green-400 mb-3" />
          )}
          <h1 className="font-display text-5xl tracking-wide mb-2">
            {order.status === 'pending' ? 'ORDER PLACED!' : 'ORDER STATUS'}
          </h1>
          <p className="text-poke-muted">Order #{order.order_number}</p>
        </div>

        {/* Status tracker */}
        {!isCancelled && (
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-poke-border" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-poke-yellow transition-all duration-500"
                style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
              {STATUS_STEPS.map((step, idx) => {
                const done = idx <= currentStep
                const Icon = step.icon
                return (
                  <div key={step.key} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      done ? 'bg-poke-yellow border-poke-yellow text-black' : 'bg-poke-dark border-poke-border text-poke-muted'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <p className={`text-xs mt-2 text-center hidden md:block ${done ? 'text-white' : 'text-poke-muted'}`}>
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-4">
              <StatusBadge status={order.status} />
            </div>
            {order.status === 'payment_requested' && (
              <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg text-yellow-300 text-sm text-center">
                💳 Payment details have been sent to {order.customer_email}. Please complete payment to proceed.
              </div>
            )}
          </div>
        )}

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="card p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-poke-muted mb-3">Customer Details</h3>
            <p className="font-semibold">{order.customer_name}</p>
            <p className="text-poke-muted text-sm">{order.customer_email}</p>
            {order.customer_phone && <p className="text-poke-muted text-sm">{order.customer_phone}</p>}
            <p className="text-poke-muted text-sm mt-2">{order.customer_address}</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-poke-muted mb-3">Order Info</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-poke-muted">Order #</span><span>{order.order_number}</span></div>
              <div className="flex justify-between"><span className="text-poke-muted">Date</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-poke-muted">Status</span><StatusBadge status={order.status} /></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span className="text-poke-yellow font-display text-xl">${parseFloat(order.subtotal).toFixed(2)}</span></div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="card p-5 mb-6">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-poke-muted mb-4">Items Ordered</h3>
          <div className="space-y-3">
            {order.order_items.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{item.product_name}</p>
                  <p className="text-poke-muted text-xs">Qty: {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}{item.is_preorder ? ' · Pre-Order' : ''}</p>
                </div>
                <span className="font-semibold text-sm">${(item.quantity * item.unit_price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-poke-muted">
          <p>Bookmark this page to track your order. Questions? Reach us via WhatsApp or email.</p>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', params.id)
    .single()

  return { props: { order: order || null } }
}
