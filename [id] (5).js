import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json(data)
}
