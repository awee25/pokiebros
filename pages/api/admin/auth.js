export function requireAdmin(req, res) {
  const token = req.headers['x-admin-token']
  if (!token || token !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}
