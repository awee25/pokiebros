import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export function useAdminAuth() {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = sessionStorage.getItem('admin_auth')
    if (!t) {
      router.replace('/admin/login')
    } else {
      setToken(t)
      setReady(true)
    }
  }, [])

  return { token, ready }
}

export function adminHeaders(token) {
  return { 'Content-Type': 'application/json', 'x-admin-token': token }
}
