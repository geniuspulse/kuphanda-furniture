'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function CheckoutForm({ settings }) {
  const { cart, cartTotal, clearCart, isLoaded } = useCart();
  const [step, setStep] = useState(1);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const [delivery, setDelivery] = useState({
    zone: '',
    preferredDate: '',
    notes: '',
  });
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  // Scroll to top of checkout form on step change
  useEffect(() => {
    const formElement = document.getElementById('checkout-flow');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  if (!isLoaded) {
    return (
      <div className="checkout-loading-state">
        <div className="spinner"></div>
        <p>Loading your cart details...</p>
        <style jsx="true">{`
          .checkout-loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 80px 20px;
            text-align: center;
          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid var(--border, #E8DCC8);
            border-top: 4px solid var(--brown, #6B4226);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="checkout-empty-state">
        <div className="empty-icon">🛒</div>
        <h3>Your Cart is Empty</h3>
        <p>You have not added any furniture items to your cart yet. Browse our unique collection to find your perfect pieces!</p>
        <Link href="/products" className="checkout-btn checkout-btn-primary" style={{ textDecoration: 'none' }}>
          Browse Collection
        </Link>
        <style jsx="true">{`
          .checkout-empty-state {
            text-align: center;
            padding: 80px 24px;
            background: #fff;
            border-radius: var(--radius-lg, 20px);
            box-shadow: var(--shadow-lg, 0 10px 40px rgba(107, 66, 38, 0.15));
            max-width: 600px;
            margin: 40px auto;
          }
          .empty-icon {
            font-size: 4rem;
            margin-bottom: 20px;
          }
          .checkout-empty-state h3 {
            font-family: var(--font-heading, serif);
            color: var(--text-dark, #2C1810);
            font-size: 1.8rem;
            margin-bottom: 12px;
          }
          .checkout-empty-state p {
            color: var(--text-muted, #8A7560);
            margin-bottom: 30px;
            font-size: 1.05rem;
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  }

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setError('Please fill in all required customer details (Name, Phone, and Address).');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBackStep2 = (e) => {
    e.preventDefault();
    setError('');
    setStep(1);
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (!delivery.zone.trim()) {
      setError('Please enter your delivery location.');
      return;
    }
    setError('');
    setStep(3);
  };

  const handleBackStep3 = (e) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();
    if (!confirmed) {
      setError('Please confirm that your order details are correct.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedVariations: item.selectedVariations || {},
          })),
          customer,
          delivery,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setOrderId(data.order.id);
      clearCart();
      setStep(4);

      if (data.whatsappUrl) {
        // Redirect to WhatsApp URL in a new tab
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank');
        }, 1500);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="checkout-flow" style={{ width: '100%' }}>
      {/* Step Indicator */}
      <div className="checkout-steps-wrap">
        <div className="checkout-step-indicator">
          <div className={`step-dot ${step >= 1 ? (step > 1 ? 'completed' : 'active') : ''}`}>
            {step > 1 ? <span>✓</span> : <span>1</span>}
          </div>
          <div className={`step-dot ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>
            {step > 2 ? <span>✓</span> : <span>2</span>}
          </div>
          <div className={`step-dot ${step >= 3 ? (step > 3 ? 'completed' : 'active') : ''}`}>
            {step > 3 ? <span>✓</span> : <span>3</span>}
          </div>
          <div className={`step-dot ${step === 4 ? 'completed' : ''}`}>
            <span>✓</span>
          </div>
        </div>
        <div className="checkout-step-labels">
          <span className={step === 1 ? 'label-active' : step > 1 ? 'label-done' : ''}>Info</span>
          <span className={step === 2 ? 'label-active' : step > 2 ? 'label-done' : ''}>Delivery</span>
          <span className={step === 3 ? 'label-active' : step > 3 ? 'label-done' : ''}>Review</span>
          <span className={step === 4 ? 'label-active' : ''}>Done</span>
        </div>
      </div>

      {error && (
        <div className="checkout-error-banner">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Checkout Form Container */}
      <div className="checkout-step">
        {step === 1 && (
          <form onSubmit={handleNextStep1}>
            <div className="step-header">
              <h3>Customer Information</h3>
              <p>Please enter your details so we can process and coordinate your order.</p>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-label">Full Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="checkout-input"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="info-grid">
              <div className="checkout-form-group">
                <label className="checkout-label">Phone Number <span className="text-danger">*</span></label>
                <input
                  type="tel" pattern="[+]?[0-9 ]{7,15}"
                  className="checkout-input"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="e.g. +265 999 123 456"
                  required
                />
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">Email Address (Optional)</label>
                <input
                  type="email"
                  className="checkout-input"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                />
              </div>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-label">Delivery Address <span className="text-danger">*</span></label>
              <input
                type="text"
                className="checkout-input"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder="e.g. Area 47, Sector 2, House 12, Lilongwe"
                required
              />
            </div>

            <div className="btn-container">
              <div></div>
              <button type="submit" className="checkout-btn checkout-btn-primary">
                Continue →
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNextStep2}>
            <div className="step-header">
              <h3>Delivery Details</h3>
              <p>Let us know where and when you would like your furniture delivered.</p>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-label">Delivery Location <span className="text-danger">*</span></label>
              <input
                type="text"
                className="checkout-input"
                value={delivery.zone}
                onChange={(e) => setDelivery({ ...delivery, zone: e.target.value })}
                placeholder="e.g. Area 18, Kawale, or any specific location"
                required
              />
              <div className="zone-quick-picks">
                <span className="zone-quick-label">Quick pick:</span>
                {['Lilongwe City', 'Area 47', 'Area 49', 'Area 25', 'Lilongwe Rural'].map(z => (
                  <button
                    key={z}
                    type="button"
                    className={`zone-chip ${delivery.zone === z ? 'zone-chip-active' : ''}`}
                    onClick={() => setDelivery({ ...delivery, zone: z })}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            <div className="checkout-form-group">
              <label className="checkout-label">Preferred Delivery Date</label>
              <input
                type="date"
                className="checkout-input"
                value={delivery.preferredDate}
                onChange={(e) => setDelivery({ ...delivery, preferredDate: e.target.value })}
              />
            </div>

            <div className="checkout-form-group">
              <label className="checkout-label">Delivery Notes / Special Instructions</label>
              <textarea
                className="checkout-input"
                rows="4"
                value={delivery.notes}
                onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                placeholder="e.g. Gate code is 1234, deliver in the afternoon, etc."
              />
            </div>

            <div className="btn-container">
              <button type="button" onClick={handleBackStep2} className="checkout-btn checkout-btn-secondary">
                ⬅ Back
              </button>
              <button type="submit" className="checkout-btn checkout-btn-primary">
                Continue →
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div>
            <div className="step-header">
              <h3>Order Review</h3>
              <p>Please double check your order details and customer details before submitting.</p>
            </div>

            {/* Items review — clean card per item */}
            <div className="checkout-review">
              <div className="review-header">
                <span>Your Items</span>
                <span className="review-header-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
              </div>
              {cart.map((item, idx) => (
                <div key={item.key} className="review-item">
                  <div className="review-item-top">
                    <span className="review-item-num">{idx + 1}</span>
                    <h4 className="review-item-name">{item.name}</h4>
                    <span className="review-item-price">
                      MWK {((item.price || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                  <div className="review-item-bottom">
                    {item.selectedVariations && Object.keys(item.selectedVariations).length > 0 && (
                      <div className="review-chips">
                        {Object.entries(item.selectedVariations).map(([k, v]) => (
                          <span key={k} className="review-chip"><strong>{k}:</strong> {v}</span>
                        ))}
                      </div>
                    )}
                    <span className="review-qty">Qty: {item.quantity} &times; MWK {(item.price || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price details summary */}
            <div className="checkout-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>MWK {cartTotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery (Lilongwe Zone)</span>
                <span style={{ color: 'var(--whatsapp, #25D366)', fontWeight: 'bold' }}>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>MWK {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Customer info preview grid */}
            <div className="checkout-review-summary-details">
              <div className="review-section">
                <h5>Customer Information</h5>
                <p><strong>Name:</strong> {customer.name}</p>
                <p><strong>Phone:</strong> {customer.phone}</p>
                {customer.email && <p><strong>Email:</strong> {customer.email}</p>}
                <p><strong>Address:</strong> {customer.address}</p>
              </div>
              <div className="review-section">
                <h5>Delivery Details</h5>
                <p><strong>Location:</strong> {delivery.zone}</p>
                {delivery.preferredDate && (
                  <p><strong>Preferred Date:</strong> {new Date(delivery.preferredDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                )}
                {delivery.notes && <p><strong>Notes:</strong> {delivery.notes}</p>}
              </div>
            </div>

            {/* Confirmation checkbox */}
            <div className="checkout-confirm-box">
              <input
                type="checkbox"
                id="confirmCheck"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
              />
              <label htmlFor="confirmCheck">I confirm the order details are correct</label>
            </div>

            <div className="btn-container">
              <button type="button" onClick={handleBackStep3} className="checkout-btn checkout-btn-secondary" disabled={loading}>
                ⬅ Back
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="checkout-btn checkout-btn-primary"
                disabled={loading || !confirmed}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span> Placing Order...
                  </>
                ) : (
                  'Place Order via WhatsApp ➔'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="checkout-success-state">
            <div className="success-icon">🎉</div>
            <h3>Thank You for Your Order!</h3>
            <p className="order-number">Order ID: <strong>{orderId}</strong></p>
            <p className="redirect-message">
              We are now redirecting you to WhatsApp to finalize your delivery details and payment preferences with our team...
            </p>
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
            <p className="whatsapp-help">
              If the redirect did not work, please feel free to reach out to us directly referencing your Order ID.
            </p>
            <div className="success-actions">
              <Link href="/products" className="checkout-btn checkout-btn-primary" style={{ textDecoration: 'none' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        /* Steps wrapper */
        .checkout-steps-wrap {
          max-width: 420px;
          margin: 0 auto 48px auto;
        }

        /* Dots row */
        .checkout-step-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          padding: 0 4px;
        }
        .checkout-step-indicator::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 24px;
          right: 24px;
          height: 3px;
          background: var(--border, #E8DCC8);
          z-index: 1;
        }
        .step-dot {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--cream-light, #FAF7F2);
          border: 2px solid var(--border, #E8DCC8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          position: relative;
          z-index: 2;
          color: var(--text-muted, #8A7560);
          transition: all 0.3s ease;
          font-size: 0.95rem;
          flex-shrink: 0;
        }
        .step-dot.active {
          background: var(--brown, #6B4226);
          border-color: var(--brown, #6B4226);
          color: #fff;
          box-shadow: 0 0 0 5px rgba(107, 66, 38, 0.15);
        }
        .step-dot.completed {
          background: var(--amber, #D4A574);
          border-color: var(--amber, #D4A574);
          color: var(--brown-dark, #4A2C17);
        }

        /* Labels row — separate, no overflow */
        .checkout-step-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 0px;
        }
        .checkout-step-labels span {
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted, #8A7560);
          text-align: center;
          width: 40px;
          line-height: 1.2;
        }
        .checkout-step-labels .label-active {
          color: var(--brown, #6B4226);
          font-weight: 700;
        }
        .checkout-step-labels .label-done {
          color: var(--amber, #D4A574);
        }

        .checkout-step {
          background: #fff;
          border-radius: var(--radius-lg, 20px);
          padding: 40px;
          box-shadow: var(--shadow-lg, 0 10px 40px rgba(107, 66, 38, 0.15));
          max-width: 800px;
          margin: 0 auto 60px auto;
          border: 1px solid rgba(107, 66, 38, 0.05);
        }
        .step-header {
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border, #E8DCC8);
          padding-bottom: 20px;
        }
        .step-header h3 {
          font-family: var(--font-heading, serif);
          font-size: 1.8rem;
          color: var(--text-dark, #2C1810);
          margin-bottom: 8px;
        }
        .step-header p {
          color: var(--text-muted, #8A7560);
          font-size: 1rem;
        }

        .checkout-form-group {
          margin-bottom: 24px;
        }
        .checkout-label {
          display: block;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-dark, #2C1810);
          margin-bottom: 8px;
        }
        .checkout-input {
          width: 100%;
          padding: 14px 18px;
          border: 2px solid var(--border, #E8DCC8);
          border-radius: var(--radius, 12px);
          font-family: var(--font-body), sans-serif;
          font-size: 1rem;
          color: var(--text-dark, #2C1810);
          background: var(--warm-white, #FDFBF7);
          transition: all 0.3s ease;
        }
        .checkout-input:focus {
          outline: none;
          border-color: var(--brown-light, #8B5A2B);
          box-shadow: 0 0 0 4px rgba(107, 66, 38, 0.1);
        }
        textarea.checkout-input {
          resize: vertical;
          min-height: 100px;
        }
        select.checkout-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236B4226' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 18px center;
          background-size: 20px;
          padding-right: 48px;
          cursor: pointer;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .checkout-review {
          border: 2px solid var(--border, #E8DCC8);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .review-header {
          background: var(--cream-light, #FAF7F2);
          padding: 14px 20px;
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-dark, #2C1810);
          border-bottom: 2px solid var(--border, #E8DCC8);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .review-header-count {
          font-size: 0.85rem;
          background: var(--brown, #6B4226);
          color: #FAF7F2;
          padding: 2px 10px;
          border-radius: 20px;
          font-weight: 600;
        }
        .review-item {
          padding: 14px 20px;
          border-bottom: 1px solid var(--border, #E8DCC8);
          background: #fff;
        }
        .review-item:last-child {
          border-bottom: none;
        }
        .review-item-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .review-item-num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--amber, #D4A574);
          color: var(--brown-dark, #4A2C17);
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .review-item-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-dark, #2C1810);
          flex: 1;
          margin: 0;
          line-height: 1.3;
        }
        .review-item-price {
          font-family: var(--font-heading, serif);
          font-weight: 800;
          font-size: 1rem;
          color: var(--brown, #6B4226);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .review-item-bottom {
          padding-left: 34px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .review-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .review-chip {
          background: var(--cream-light, #FAF7F2);
          border: 1px solid var(--border, #E8DCC8);
          border-radius: 20px;
          padding: 2px 10px;
          font-size: 0.8rem;
          color: var(--text-body, #5A3E2B);
        }
        .review-qty {
          font-size: 0.82rem;
          color: var(--text-muted, #8A7560);
        }

        .checkout-summary {
          background: var(--cream-light, #FAF7F2);
          border-radius: var(--radius, 12px);
          padding: 24px;
          margin-bottom: 30px;
          border: 1px solid var(--border, #E8DCC8);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 1rem;
          color: var(--text-body, #5A3E2B);
        }
        .summary-row:last-child {
          margin-bottom: 0;
        }
        .summary-row.total {
          font-family: var(--font-heading, serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-dark, #2C1810);
          border-top: 2px dashed var(--border, #E8DCC8);
          padding-top: 16px;
          margin-top: 16px;
        }

        .checkout-review-summary-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          background: var(--cream-light, #FAF7F2);
          border-radius: var(--radius, 12px);
          padding: 24px;
          margin-bottom: 30px;
          border: 1px solid var(--border, #E8DCC8);
        }
        .review-section h5 {
          font-family: var(--font-heading, serif);
          font-size: 1.15rem;
          color: var(--brown, #6B4226);
          margin-bottom: 12px;
          border-bottom: 1px solid var(--border, #E8DCC8);
          padding-bottom: 8px;
        }
        .review-section p {
          font-size: 0.95rem;
          margin-bottom: 8px;
          color: var(--text-body, #5A3E2B);
          line-height: 1.5;
        }
        .review-section p strong {
          color: var(--text-dark, #2C1810);
        }

        .checkout-confirm-box {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--warm-white, #FDFBF7);
          border: 1px solid var(--border, #E8DCC8);
          border-radius: var(--radius, 12px);
          padding: 16px 20px;
          margin-bottom: 30px;
          transition: border-color 0.3s ease;
        }
        .checkout-confirm-box:hover {
          border-color: var(--brown-light, #8B5A2B);
        }
        .checkout-confirm-box input {
          margin-top: 4px;
          width: 18px;
          height: 18px;
          accent-color: var(--brown, #6B4226);
          cursor: pointer;
        }
        .checkout-confirm-box label {
          font-size: 0.95rem;
          color: var(--text-body, #5A3E2B);
          cursor: pointer;
          user-select: none;
          line-height: 1.4;
        }

        .checkout-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          padding: 18px 36px !important;
          font-family: var(--font-body), sans-serif !important;
          font-size: 1.05rem !important;
          font-weight: 700 !important;
          border: 2px solid transparent !important;
          border-radius: 50px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          text-align: center !important;
          text-decoration: none !important;
          line-height: 1.4 !important;
          appearance: none !important;
          -webkit-appearance: none !important;
        }
        .checkout-btn-primary {
          background: #6B4226 !important;
          background-color: #6B4226 !important;
          color: #FAF7F2 !important;
          border-color: #6B4226 !important;
          box-shadow: 0 6px 20px rgba(107, 66, 38, 0.35) !important;
          width: 100% !important;
        }
        .checkout-btn-primary:hover:not(:disabled) {
          background: #4A2C17 !important;
          background-color: #4A2C17 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(107, 66, 38, 0.45) !important;
        }
        .checkout-btn-primary:disabled {
          opacity: 0.55 !important;
          cursor: not-allowed !important;
          transform: none !important;
        }
        .checkout-btn-secondary {
          background: transparent !important;
          background-color: transparent !important;
          color: #6B4226 !important;
          border: 2px solid #6B4226 !important;
          padding: 16px 28px !important;
        }
        .checkout-btn-secondary:hover:not(:disabled) {
          background: #6B4226 !important;
          background-color: #6B4226 !important;
          color: #FAF7F2 !important;
        }

        .btn-container {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
          margin-top: 32px !important;
        }

        .checkout-error-banner {
          background: #fdf2f2;
          border: 1px solid #f8b4b4;
          color: #9b1c1c;
          padding: 14px 20px;
          border-radius: var(--radius, 12px);
          margin-bottom: 24px;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .checkout-success-state {
          text-align: center;
          padding: 40px 10px;
        }
        .success-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          animation: scaleUp 0.5s ease-out;
        }
        @keyframes scaleUp {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .checkout-success-state h3 {
          font-family: var(--font-heading, serif);
          font-size: 2rem;
          color: var(--text-dark, #2C1810);
          margin-bottom: 8px;
        }
        .order-number {
          font-size: 1.15rem;
          color: var(--brown, #6B4226);
          background: var(--cream-light, #FAF7F2);
          display: inline-block;
          padding: 8px 20px;
          border-radius: 50px;
          border: 1px solid var(--border, #E8DCC8);
          margin-bottom: 24px;
        }
        .redirect-message {
          color: var(--text-body, #5A3E2B);
          font-size: 1.1rem;
          max-width: 580px;
          margin: 0 auto 20px auto;
          line-height: 1.6;
        }
        .loading-dots {
          font-size: 2.5rem;
          color: var(--brown, #6B4226);
          height: 40px;
          line-height: 20px;
          margin-bottom: 24px;
        }
        .loading-dots span {
          animation: blink 1.4s infinite both;
        }
        .loading-dots span:nth-child(2) { animation-delay: .2s; }
        .loading-dots span:nth-child(3) { animation-delay: .4s; }
        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
        .whatsapp-help {
          color: var(--text-muted, #8A7560);
          font-size: 0.9rem;
          max-width: 480px;
          margin: 0 auto 30px auto;
        }
        .success-actions {
          margin-top: 20px;
        }

        .spinner-small {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        .text-danger {
          color: #dc3545;
        }

        @media (max-width: 600px) {
          .checkout-step {
            padding: 20px 14px;
          }
          .info-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .checkout-steps-wrap {
            margin-bottom: 36px;
          }
          .checkout-step-labels span {
            font-size: 0.65rem;
          }
          .review-item-bottom {
            padding-left: 0;
          }
          .checkout-review-summary-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

        <style jsx="true">{`
          .zone-quick-picks {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-top: 12px;
          }
          .zone-quick-label {
            font-size: 0.85rem;
            color: var(--text-muted, #8A7560);
            margin-right: 4px;
          }
          .zone-chip {
            display: inline-flex;
            align-items: center;
            padding: 6px 14px;
            border-radius: 20px;
            border: 1.5px solid var(--border, #E8DCC8);
            background: transparent;
            color: var(--text-dark, #2C1810);
            font-size: 0.85rem;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .zone-chip:hover {
            border-color: var(--brown, #6B4226);
            background: rgba(107, 66, 38, 0.05);
          }
          .zone-chip-active {
            border-color: var(--brown, #6B4226);
            background: var(--brown, #6B4226);
            color: #fff;
          }
          .zone-chip-active:hover {
            background: var(--brown-dark, #5a3520);
            color: #fff;
          }
          @media (max-width: 480px) {
            .zone-quick-picks {
              gap: 6px;
            }
            .zone-chip {
              padding: 5px 10px;
              font-size: 0.8rem;
            }
          }
        `}</style>
    </div>
  );
}
