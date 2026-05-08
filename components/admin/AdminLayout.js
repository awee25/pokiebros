import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { LayoutDashboard, Package, ShoppingBag, Clock, LogOut } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/preorders', label: 'Pre-Orders', icon: Clock },
]

export default function AdminLayout({ children, title = 'Admin' }) {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }

  return (
    <>
      <Head><title>{title} — PokéStore Admin</title></Head>
      <div className="min-h-screen bg-poke-dark flex">
        {/* Sidebar */}
        <aside className="w-60 bg-poke-card border-r border-poke-border flex flex-col">
          <div className="p-5 border-b border-poke-border">
            <span className="font-display text-2xl text-poke-yellow tracking-wider">POKÉSTORE</span>
            <p className="text-xs text-poke-muted mt-0.5">Admin Panel</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = router.pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-poke-yellow text-black'
                      : 'text-gray-400 hover:text-white hover:bg-poke-border'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="p-3 border-t border-poke-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-poke-border transition-colors w-full"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </>
  )
}
