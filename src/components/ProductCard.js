'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';

export default function ProductCard({ product }) {
  const {
    id,
    name,
    description,
    price,
    salePrice,
    image,
    category,
    badge,
    inStock,
    stockCount,
  } = product;

  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Price formatting
  const formatLocalPrice = (val) => {
    if (val === null || val === undefined) return 'Price on request';
    return `MWK ${Number(val).toLocaleString('en-US')}`;
  };

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, 1, {});
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Stock indicator text
  const getStockText = () => {
    if (!inStock) return 'Out of Stock';
    if (stockCount <= 3) return `Only ${stockCount} left!`;
    return 'In Stock';
  };

  // Stock indicator color
  const getStockColor = () => {
    if (!inStock) return '#dc3545';
    if (stockCount <= 3) return '#e05a47';
    return 'var(--whatsapp-dark)';
  };

  const badgeText = !inStock ? 'Out of Stock' : badge;

  return (
    <div className="product-card">
      <Link href={`/products/${id}`} className="product-image" style={{ display: 'block', textDecoration: 'none' }}>
        {badgeText && (
          <span
            className="product-badge"
            style={!inStock ? { backgroundColor: '#dc3545', color: '#fff' } : undefined}
          >
            {badgeText}
          </span>
        )}
        <img src={image || (product.images && product.images[0])} alt={name} />
      </Link>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>

        {/* Price — right below name */}
        <div className="product-price-block">
          {salePrice && salePrice < price ? (
            <>
              <span className="product-price-sale">{formatLocalPrice(salePrice)}</span>
              <span className="product-price-original">{formatLocalPrice(price)}</span>
            </>
          ) : (
            <span className="product-price-main">{formatLocalPrice(price)}</span>
          )}
        </div>

        <p className="product-desc">{description}</p>

        <div className="product-card-footer">
          <div
            className="product-stock"
            style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              color: getStockColor(),
            }}
          >
            {getStockText()}
          </div>
          <div className="product-actions">
            <Link
              href={`/products/${id}`}
              className="btn-cart"
              style={{
                background: 'transparent',
                border: '2px solid var(--brown)',
                color: 'var(--brown)',
              }}
            >
              View
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-cart"
              style={
                !inStock
                  ? { opacity: 0.5, cursor: 'not-allowed' }
                  : { background: 'var(--brown)', color: '#fff' }
              }
            >
              {added ? 'Added ✓' : 'Make an Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
