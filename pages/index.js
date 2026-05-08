import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function Home({ featuredProducts, preorderProducts }) {
  return (
    <Layout title="PokéStore — Pokémon Cards & More">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-poke-card via-poke-dark to-black">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #FFD700 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E3350D 0%, transparent 50%)' }}
        />
        <div className="max-w-7xl mx-auto px-4 py-24 relative">
          <div className="max-w-2xl">
            <p className="text-poke-yellow text-sm font-semibold tracking-[0.3em] uppercase mb-4">Singapore's Premier</p>
            <h1 className="font-display text-7xl md:text-8xl tracking-wider text-white leading-none mb-6">
              POKÉMON<br />
              <span className="text-poke-yellow">STORE</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Singles, sealed products, booster boxes, and exclusive pre-orders. 
              Fast shipping across Singapore.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/shop" className="btn-primary text-base px-8 py-3">
                Browse Shop
              </Link>
              <Link href="/shop?preorder=true" className="btn-secondary text-base px-8 py-3">
                View Pre-Orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Pre-Orders Section */}
        {preorderProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-4xl tracking-wide">PRE-ORDERS</h2>
                <p className="text-poke-muted text-sm mt-1">Reserve yours before they sell out</p>
              </div>
              <Link href="/shop?preorder=true" className="text-poke-yellow text-sm font-semibold hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {preorderProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Featured Section */}
        {featuredProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-4xl tracking-wide">LATEST PRODUCTS</h2>
                <p className="text-poke-muted text-sm mt-1">Fresh arrivals in our store</p>
              </div>
              <Link href="/shop" className="text-poke-yellow text-sm font-semibold hover:underline">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {featuredProducts.length === 0 && preorderProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🃏</p>
            <h2 className="font-display text-4xl mb-2">COMING SOON</h2>
            <p className="text-poke-muted">Products are being added. Check back soon!</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const { data: featuredProducts = [] } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('active', true)
    .eq('is_preorder', false)
    .order('created_at', { ascending: false })
    .limit(10)

  const { data: preorderProducts = [] } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('active', true)
    .eq('is_preorder', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    props: {
      featuredProducts: featuredProducts || [],
      preorderProducts: preorderProducts || [],
    },
  }
}
