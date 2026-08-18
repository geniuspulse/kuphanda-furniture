import { NextResponse } from 'next/server';
import { createOrder, buildWhatsAppOrderMessage } from '@/lib/orders';
import { getSettings } from '@/lib/settings';

// POST: Create a new order
export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, delivery } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!customer || !customer.name || !customer.phone) {
      return NextResponse.json({ error: 'Customer name and phone are required' }, { status: 400 });
    }

    // Calculate total
    const total = items.reduce((sum, item) => {
      return sum + ((item.price || 0) * item.quantity);
    }, 0);

    const order = await createOrder({
      items,
      customer,
      delivery: delivery || { zone: 'Lilongwe' },
      total,
    });

    // Build WhatsApp message
    const whatsappMessage = buildWhatsAppOrderMessage(order);
    const settings = getSettings();
    const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({
      success: true,
      order,
      whatsappUrl,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
