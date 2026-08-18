'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import { whatsappLink } from '@/lib/config';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailClient({ product, relatedProducts, settings }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [selectedVariations, setSelectedVariations] = useState({});
  const [addedToCart, setAddedToCart] = useState(false);

  // Handle dynamic product transitions (e.g. from related products)
  useEffect(() => {
    if (product) {
      setMainImage(product.image || (product.images && product.images[0]) || '');
      
      const initial = {};
      if (product.variations && product.variations.length > 0) {
        product.variations.forEach(v => {
          initial[v.name] = v.options && v.options.length > 0 ? v.options[0] : '';
        });
      }
      setSelectedVariations(initial);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const formatLocalPrice = (val) => {
    if (val === null || val === undefined) return 'Price on request';
    return `MWK ${Number(val).toLocaleString('en-US')}`;
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product, quantity, selectedVariations);
    setAddedToCart(true);
  };

  const handleWhatsAppOrder = async () => {
    setWhatsappLoading(true);
    try {
      // Create order via API (same flow as cart checkout)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: product.id,
            name: product.name,
            price: (product.salePrice && product.salePrice < product.price) ? product.salePrice : product.price,
            quantity: quantity,
            selectedVariations: selectedVariations || {},
          }],
          customer: {
            name: 'WhatsApp Direct Order',
            phone: 'Pending via WhatsApp',
          },
          delivery: { zone: 'Lilongwe' },
        }),
      });

      const data = await response.json();

      if (response.ok && data.whatsappUrl) {
        // Order created — open WhatsApp with rich pre-filled message
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback: build message manually and open WhatsApp
        const siteUrl = window.location.origin;
        let msg = '*NEW ORDER - ' + (data.order?.id || 'Direct') + '*\n';
        msg += '----------------------------------\n\n';
        msg += '*ORDER SUMMARY*\n\n';
        msg += '1. *' + product.name + '*\n';
        Object.entries(selectedVariations || {}).forEach(([k, v]) => {
          msg += '   - ' + k + ': ' + v + '\n';
        });
        const unitPrice = product.price ? 'MWK ' + Number(product.price).toLocaleString() : 'Price on request';
        const lineTotal = product.price ? 'MWK ' + (product.price * quantity).toLocaleString() : 'TBD';
        msg += '   Qty: ' + quantity + ' x ' + unitPrice + ' = ' + lineTotal + '\n';
        msg += '   Link: ' + siteUrl + '/products/' + product.id + '\n';
        msg += '\n----------------------------------\n';
        if (product.price) {
          msg += '*TOTAL: MWK ' + (product.price * quantity).toLocaleString() + '*\n';
          msg += 'Delivery: FREE (Lilongwe)\n';
        } else {
          msg += '*TOTAL: Price on request*\n';
        }
        msg += '----------------------------------\n\n';
        msg += '*CUSTOMER*\n';
        msg += 'Name: (Please provide your name)\n';
        msg += 'Phone: (Please provide your phone)\n\n';
        msg += '*DELIVERY*\n';
        msg += 'Zone: Lilongwe\n';
        msg += '\n----------------------------------\n';
        msg += 'I would like to order this product. Please confirm availability and delivery.';
        const url = whatsappLink(msg, settings?.whatsapp);
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('WhatsApp order error:', err);
      // Final fallback: simple message
      const siteUrl = window.location.origin;
      let msg = 'Hello, I would like to order: ' + product.name + ' (Qty: ' + quantity + ')\n';
      msg += 'Link: ' + siteUrl + '/products/' + product.id;
      const url = whatsappLink(msg, settings?.whatsapp);
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setWhatsappLoading(false);
    }
  };

  return (
    <div>
      <div className="product-detail-grid">
        {/* Left Column: Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="product-detail-image">
            <img src={mainImage} alt={product.name} />
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  style={{
                    border: mainImage === img ? '2px solid var(--brown)' : '2px solid transparent',
                    borderRadius: 'var(--radius)',
                    overflow: 'hidden',
                    padding: 0,
                    cursor: 'pointer',
                    flexShrink: 0,
                    width: '80px',
                    height: '80px',
                    background: 'none',
                  }}
                >
                  <img src={img} alt={`${product.name} gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Info & Actions */}
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          
          <div className="product-detail-price">
            {product.salePrice && product.salePrice < product.price ? (
              <>
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: 'var(--text-muted)',
                    fontSize: '1.4rem',
                    marginRight: '12px',
                    fontWeight: 'normal',
                  }}
                >
                  {formatLocalPrice(product.price)}
                </span>
                <span>{formatLocalPrice(product.salePrice)}</span>
              </>
            ) : (
              formatLocalPrice(product.price)
            )}
          </div>

          <p className="product-detail-desc">{product.description}</p>
          
          <div className="product-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Stock Status</span>
              <span
                className="meta-value"
                style={{
                  color: !product.inStock
                    ? '#dc3545'
                    : product.stockCount <= 3
                    ? '#e05a47'
                    : 'var(--whatsapp-dark)',
                }}
              >
                {!product.inStock ? 'Out of Stock' : product.stockCount <= 3 ? `Only ${product.stockCount} left!` : 'In Stock'}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Delivery</span>
              <span className="meta-value" style={{ color: 'var(--brown-light)' }}>Free in Lilongwe</span>
            </div>
          </div>

          {/* Dynamic Variation Selectors */}
          {product.variations && product.variations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {product.variations.map((v) => (
                <div key={v.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span className="meta-label" style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                    {v.name}
                  </span>
                  <select
                    value={selectedVariations[v.name] || ''}
                    onChange={(e) => setSelectedVariations(prev => ({ ...prev, [v.name]: e.target.value }))}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius)',
                      border: '2px solid var(--border)',
                      backgroundColor: 'var(--warm-white)',
                      color: 'var(--text-dark)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      width: '100%',
                      maxWidth: '300px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {v.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-selector" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="meta-label" style={{ fontWeight: '600', color: 'var(--text-dark)', marginBottom: '8px' }}>
              Quantity
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button className="quantity-btn" onClick={handleDecrease} aria-label="Decrease quantity">-</button>
              <span className="quantity-value">{quantity}</span>
              <button className="quantity-btn" onClick={handleIncrease} aria-label="Increase quantity">+</button>
            </div>
          </div>



          {/* Action Buttons */}
          <div className="product-detail-actions">
            {addedToCart ? (
              <a
                href="/cart"
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                View Cart
              </a>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{ width: '100%', opacity: !product.inStock ? 0.5 : 1, cursor: !product.inStock ? 'not-allowed' : 'pointer' }}
              >
                Make an Order
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div style={{ marginTop: '50px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--text-dark)', marginBottom: '20px' }}>
            Product Specifications
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px 14px 0', fontWeight: '600', color: 'var(--text-dark)', width: '30%' }}>{key}</td>
                  <td style={{ padding: '14px 0', color: 'var(--text-body)' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Related Products Grid */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section style={{ marginTop: '80px', borderTop: '1px solid var(--border)', paddingTop: '60px' }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '40px' }}>
            <p className="section-eyebrow">You May Also Like</p>
            <h2 className="section-title">Related Products</h2>
          </div>
          <div className="products-grid">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
