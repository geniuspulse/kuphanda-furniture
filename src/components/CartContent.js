'use client';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import { whatsappLink } from '@/lib/config';

export default function CartContent({ settings }) {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, hasPriceItems } = useCart();

  const formatPrice = (val) => {
    if (val === null || val === undefined || val === 0) return 'Price on request';
    return `MWK ${Number(val).toLocaleString('en-US')}`;
  };

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    let msg = `Hello ${settings?.name || 'Kuphanda Furniture'}! I'd like to order:\n\n`;
    cart.forEach(item => {
      const price = item.price ? `MWK ${item.price.toLocaleString()}` : 'Price on request';
      msg += `• ${item.name} (x${item.quantity}) — ${price}\n`;
      if (item.selectedVariations) {
        Object.entries(item.selectedVariations).forEach(([k, v]) => {
          msg += `   - ${k}: ${v}\n`;
        });
      }
    });
    if (cartTotal > 0) {
      msg += `\nSubtotal: MWK ${cartTotal.toLocaleString()}\n`;
    }
    msg += `\nPlease confirm availability and delivery details. Thank you!`;
    const url = whatsappLink(msg, settings?.whatsapp);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <h3>Your cart is empty</h3>
            <p>Browse our collection and add some beautiful furniture to your cart.</p>
            <Link href="/products" className="btn btn-primary">Browse Collection</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginBottom: '32px' }}>
          <p className="section-eyebrow">Your Selection</p>
          <h1 className="section-title">Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {/* Responsive grid: items on left, summary on right (stacks on mobile) */}
        <div className="cart-layout">
          {/* Cart Items List */}
          <div className="cart-items-col">
            {/* Desktop table header */}
            <div className="cart-items-head">
              <span>Product</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
              <span></span>
            </div>

            {cart.map(item => (
              <div className="cart-item" key={item.key}>
                {/* Product info with image */}
                <div className="cart-item-product">
                  <img src={item.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjVlZmUwIi8+PHRleHQgeD0iMTQiIHk9IjM2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iOTk5Ij5ObyBJbWc8L3RleHQ+PC9zdmc+'} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <div className="cart-item-variations">
                        {Object.entries(item.selectedVariations).map(([k, v]) => (
                          <span key={k}>{k}: {v}</span>
                        ))}
                      </div>
                    )}
                    {/* Mobile price shown inline under name */}
                    <div className="cart-item-price-mobile">{formatPrice(item.price)}</div>
                  </div>
                </div>

                {/* Unit price (desktop only) */}
                <div className="cart-item-unit-price">{formatPrice(item.price)}</div>

                {/* Quantity selector */}
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity">+</button>
                </div>

                {/* Line total */}
                <div className="cart-item-total">{item.price ? formatPrice(item.price * item.quantity) : '—'}</div>

                {/* Remove button */}
                <button className="cart-remove" onClick={() => removeFromCart(item.key)} title="Remove item" aria-label="Remove item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                  </svg>
                </button>
              </div>
            ))}

            {/* Footer actions under items */}
            <div className="cart-items-footer">
              <Link href="/products" className="cart-continue-link">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="cart-clear-btn">Clear Cart</button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              <h3 className="cart-summary-title">Order Summary</h3>

              {/* Item count */}
              <div className="summary-row">
                <span>Items ({cartCount})</span>
                <span>{cartCount} {cartCount === 1 ? 'product' : 'products'}</span>
              </div>

              {/* Subtotal */}
              {hasPriceItems && (
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              )}

              {/* Delivery */}
              <div className="summary-row">
                <span>Delivery (Lilongwe)</span>
                <span className="summary-free">FREE</span>
              </div>

              {/* Divider */}
              <div className="summary-divider" />

              {/* Total */}
              <div className="summary-total-row">
                <span>Total</span>
                <span>{hasPriceItems ? formatPrice(cartTotal) : 'Price on request'}</span>
              </div>

              {/* Action buttons */}
              <div className="summary-actions">
                <Link href="/checkout" className="btn btn-primary btn-full" style={{ textAlign: 'center', textDecoration: 'none' }}>
                  Proceed to Checkout
                </Link>
                <button onClick={handleWhatsAppCheckout} className="btn btn-whatsapp btn-full">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Quick WhatsApp Order
                </button>
              </div>

              <p className="summary-note">
                Checkout generates a structured order and opens WhatsApp with all details. You can also use Quick WhatsApp Order for faster ordering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
