import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { supabase } from '../lib/supabase'
import { Search } from 'lucide-react'
import { useRouter } from 'next/router'

export default function Shop({ products, categories }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [preorderOnly, setPreorderOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (router.query.preorder === 'true') setPreorderOnly(true)
  }, [router.query])

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase())
      const matchCat = !category || p.category_id === category
      const matchPreorder = !preorderOnly || p.is_preorder
      return matchSearch && matchCat && matchPreorder
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <Layout title="Shop — PokéStore">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display text-5xl tracking-wide mb-1">
            {preorderOnly ? 'PRE-ORDERS' : 'SHOP ALL'}
          </h1>
          <p className="text-poke-muted">{filtered.length} products</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-poke-muted" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="input w-auto"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="input w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>

          {/* Pre-order toggle */}
          <button
            onClick={() => setPreorderOnly(!preorderOnly)}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
              preorderOnly
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-poke-card border-poke-border text-gray-400 hover:border-blue-500'
            }`}
          >
            Pre-Orders Only
          </button>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-poke-muted">No products found. Try a different search.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const { data: products = [] } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('active', true)
    .order('created_at', { ascending: false })

  const { data: categories = [] } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return {
    props: {
      products: products || [],
      categories: categories || [],
    },
  }
}
