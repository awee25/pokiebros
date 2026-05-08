import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { requireAdmin } from './auth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { status, search } = req.query
    let query = supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (search) query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_number.ilike.%${search}%`)

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'PATCH') {
    const { id, status, admin_notes } = req.body
    const update = {}
    if (status) update.status = status
    if (admin_notes !== undefined) update.admin_notes = admin_notes

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
