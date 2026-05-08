import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    if (res.ok) {
      sessionStorage.setItem('admin_auth', data.token)
      router.push('/admin')
    } else {
      setError('Invalid password')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Admin Login — PokéStore</title></Head>
      <div className="min-h-screen bg-poke-dark flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="font-display text-4xl text-poke-yellow tracking-wider">POKÉSTORE</span>
            <p className="text-poke-muted text-sm mt-1">Admin Panel</p>
          </div>
          <div className="card p-8">
            <h1 className="font-display text-2xl tracking-wide mb-6">LOGIN</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Admin Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-poke-red text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
