import AdminLayout from '../../components/admin/AdminLayout'
import { useAdminAuth, adminHeaders } from '../../lib/useAdminAuth'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const EMPTY_FORM = {
  name: '', description: '', price: '', stock: 0,
  category_id: '', image_url: '', is_preorder: false,
  preorder_release_date: '', preorder_limit: ''
}

function ProductModal({ product, categories, token, onClose, onSave }) {
  const isEdit = !!product
  const [form, setForm] = useState(
    isEdit ? {
      ...product,
      price: product.price.toString(),
      stock: product.stock,
      preorder_release_date: product.preorder_release_date || '',
      preorder_limit: product.preorder_limit || '',
    } : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const body = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      preorder_limit: form.preorder_limit ? parseInt(form.preorder_limit) : null,
      preorder_release_date: form.preorder_release_date || null,
      category_id: form.category_id || null,
    }
    if (isEdit) body.id = product.id

    const res = await fetch('/api/admin/products', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: adminHeaders(token),
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Error saving'); setSaving(false); return }
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-poke-card border border-poke-border rounded-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-poke-border">
          <h2 className="font-display text-2xl tracking-wide">{isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</h2>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="label">Product Name *</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Scarlet & Violet Booster Pack" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (SGD) *</label>
              <input className="input" type="number" step="0.01" min="0" value={form.price}
                onChange={e => set('price', e.target.value)} required placeholder="9.90" />
            </div>
            <div>
              <label className="label">Stock Qty</label>
              <input className="input" type="number" min="0" value={form.stock}
                onChange={e => set('stock', e.target.value)} disabled={form.is_preorder} />
            </div>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">Uncategorized</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product details..." />
          </div>
          {/* Pre-order toggle */}
          <div className="flex items-center gap-3 p-3 bg-poke-dark rounded-lg">
            <input type="checkbox" id="preorder" checked={form.is_preorder}
              onChange={e => set('is_preorder', e.target.checked)}
              className="w-4 h-4 accent-poke-yellow" />
            <label htmlFor="preorder" className="text-sm font-semibold cursor-pointer">This is a Pre-Order product</label>
          </div>
          {form.is_preorder && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Release Date</label>
                <input className="input" type="date" value={form.preorder_release_date}
                  onChange={e => set('preorder_release_date', e.target.value)} />
              </div>
              <div>
                <label className="label">Order Limit (optional)</label>
                <input className="input" type="number" min="1" value={form.preorder_limit}
                  onChange={e => set('preorder_limit', e.target.value)} placeholder="No limit" />
              </div>
            </div>
          )}
          {error && <p className="text-poke-red text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const { token, ready } = useAdminAuth()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | product object
  const [search, setSearch] = useState('')

  const fetch_ = () => {
    fetch('/api/admin/products', { headers: adminHeaders(token) })
      .then(r => r.json())
      .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => {
    if (!ready) return
    fetch_()
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }, [ready])

  const handleDelete = async (id) => {
    if (!confirm('Archive this product? It will be hidden from the shop.')) return
    await fetch('/api/admin/products', {
      method: 'DELETE', headers: adminHeaders(token),
      body: JSON.stringify({ id }),
    })
    fetch_()
  }

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (!ready) return null

  return (
    <AdminLayout title="Products">
      {modal !== null && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          categories={categories}
          token={token}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); fetch_() }}
        />
      )}

      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h1 className="font-display text-4xl tracking-wide">PRODUCTS</h1>
        <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="mb-4 relative max-w-xs">
        <input className="input pl-4" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 text-xs font-semibold uppercase tracking-wider text-poke-muted p-4 border-b border-poke-border">
          <span className="col-span-5">Product</span>
          <span className="col-span-2">Price</span>
          <span className="col-span-2">Stock</span>
          <span className="col-span-2">Type</span>
          <span className="col-span-1"></span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-poke-muted">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-poke-muted">No products found.</div>
        ) : (
          filtered.map(product => (
            <div key={product.id} className="grid grid-cols-12 items-center p-4 border-b border-poke-border last:border-0 hover:bg-poke-border/20">
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-poke-border flex-shrink-0">
                  {product.image_url
                    ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-lg">🃏</div>
                  }
                </div>
                <span className="text-sm font-medium leading-tight line-clamp-2">{product.name}</span>
              </div>
              <span className="col-span-2 font-display text-lg text-poke-yellow">${parseFloat(product.price).toFixed(2)}</span>
              <span className="col-span-2 text-sm">{product.is_preorder ? '—' : product.stock}</span>
              <span className="col-span-2">
                {product.is_preorder
                  ? <span className="badge-preorder">Pre-Order</span>
                  : product.stock === 0
                    ? <span className="badge-outofstock">Out of Stock</span>
                    : <span className="badge-instock">In Stock</span>
                }
              </span>
              <div className="col-span-1 flex gap-1 justify-end">
                <button onClick={() => setModal(product)} className="p-1.5 hover:text-poke-yellow transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-1.5 hover:text-poke-red transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  )
}
