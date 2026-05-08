import { supabaseAdmin } from '../../../lib/supabaseAdmin'

function generateOrderNumber() {
  const now = new Date()
  const date = now.toISOString().slice(0,10).replace(/-/g,'')
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `PKS-${date}-${rand}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, phone, address, notes, items, subtotal } = req.body

  if (!name || !email || !address || !items?.length) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const orderNumber = generateOrderNumber()

  // Create order
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_name: name,
      customer_email: email,
      customer_phone: phone || null,
      customer_address: address,
      customer_notes: notes || null,
      subtotal,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) {
    console.error(orderError)
    return res.status(500).json({ error: 'Failed to create order' })
  }

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    is_preorder: item.is_preorder || false,
  }))

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error(itemsError)
    // Rollback order if items fail
    await supabaseAdmin.from('orders').delete().eq('id', order.id)
    return res.status(500).json({ error: 'Failed to create order items' })
  }

  // Decrement stock for non-preorder items
  for (const item of items.filter(i => !i.is_preorder)) {
    await supabaseAdmin.rpc('decrement_stock', {
      product_id: item.id,
      qty: item.quantity
    }).catch(() => {}) // Non-blocking
  }

  return res.status(200).json({ order })
}
