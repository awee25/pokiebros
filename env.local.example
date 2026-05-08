import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { requireAdmin } from './auth'

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { name, description, price, stock, category_id, image_url, is_preorder, preorder_release_date, preorder_limit } = req.body
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({ name, description, price, stock, category_id, image_url, is_preorder, preorder_release_date, preorder_limit, active: true })
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'PATCH') {
    const { id, ...updates } = req.body
    const { data, error } = await supabaseAdmin
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    const { error } = await supabaseAdmin
      .from('products')
      .update({ active: false })
      .eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
