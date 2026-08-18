'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/manage');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else {
        setError('Failed to fetch orders.');
      }
    } catch (err) {
      setError('An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/orders/manage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o)
        );
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update order status.');
      }
    } catch (err) {
      alert('An error occurred while updating order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const revenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'order-status-pending';
      case 'confirmed': return 'order-status-confirmed';
      case 'processing': return 'order-status-processing';
      case 'delivered': return 'order-status-delivered';
      case 'cancelled': return 'order-status-cancelled';
      default: return '';
    }
  };

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-content .page-sidebar {
          display: none !important;
        }
      `}} />
      <div className="page-sidebar">
        <AdminSidebar active="/admin/orders" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Order Management</h1>
          <p className="subtitle" style={{ margin: 0 }}>View, track, and update customer furniture orders.</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fdf2f2', border: '1px solid #f5c2c2', color: '#9b1c1c', padding: '16px', borderRadius: 'var(--radius)', marginBottom: '24px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Total Orders</span>
          <span className="admin-stat-value">{totalOrders}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Pending</span>
          <span className="admin-stat-value" style={{ color: '#b45309' }}>{pendingOrders}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Confirmed</span>
          <span className="admin-stat-value" style={{ color: '#1d4ed8' }}>{confirmedOrders}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Delivered</span>
          <span className="admin-stat-value" style={{ color: '#047857' }}>{deliveredOrders}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Revenue</span>
          <span className="admin-stat-value" style={{ color: 'var(--brown)' }}>MWK {revenue.toLocaleString()}</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ border: '4px solid rgba(0,0,0,0.1)', width: '36px', height: '36px', borderRadius: '50%', borderLeftColor: 'var(--amber)', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p>Loading orders catalog...</p>
          <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--cream-light)' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>📋</span>
          <h3>No Orders Found</h3>
          <p className="subtitle" style={{ maxWidth: '400px', margin: '8px auto 0' }}>When customers place orders, they will appear here for you to manage.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '14px 16px' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '14px 16px' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '14px 16px' }}>Items Count</th>
                <th style={{ textAlign: 'left', padding: '14px 16px' }}>Total (MWK)</th>
                <th style={{ textAlign: 'left', padding: '14px 16px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '14px 16px' }}>Date</th>
                <th style={{ textAlign: 'right', padding: '14px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.95rem' }}>{order.id}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{order.customer?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.customer?.phone || ''}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</td>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>
                      MWK {(order.total || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`order-status-badge ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="order-status-select"
                        style={{
                          padding: '6px 12px',
                          borderRadius: '50px',
                          border: '1px solid var(--border)',
                          background: '#fff',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
