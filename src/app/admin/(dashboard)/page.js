import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { getProducts, getOrders, getProductStats, getOrderStats } from '@/lib/data';

export const metadata = { title: 'Admin Overview — Kuphanda' };

export default function AdminDashboardPage() {
  const products = getProducts() || [];
  const allOrders = getOrders() || [];
  const productStats = getProductStats() || { total: 0, inStock: 0, onSale: 0, featured: 0 };
  const orderStats = getOrderStats() || { total: 0, pending: 0, revenue: 0 };

  // Show recent orders (first 5 from getOrders(), sorted by date descending)
  const recentOrders = [...allOrders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Show low stock alert (products with stockCount <= 2)
  const lowStockProducts = products.filter(p => p.stockCount !== undefined && p.stockCount <= 2);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#b45309';
      case 'confirmed': return '#1d4ed8';
      case 'processing': return '#4f46e5';
      case 'delivered': return '#047857';
      case 'cancelled': return '#b91c1c';
      default: return 'var(--text-dark)';
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
        <AdminSidebar active="/admin" />
      </div>

      <h1>Admin Dashboard</h1>
      <p className="subtitle">Welcome back, Administrator! Here is the overview of your furniture storefront.</p>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="low-stock-alert" style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#92400e', fontSize: '0.9rem' }}>
            ⚠️ <strong>Low Stock Warning:</strong> The following products are critically low on stock (2 or fewer remaining):{' '}
            {lowStockProducts.map((p, idx) => (
              <span key={p.id}>
                {idx > 0 && ', '}
                <strong style={{ textDecoration: 'underline' }}>{p.name}</strong> ({p.stockCount} left)
              </span>
            ))}
          </span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Total Products</span>
          <span className="admin-stat-value">{productStats.total}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">In Stock</span>
          <span className="admin-stat-value" style={{ color: '#047857' }}>{productStats.inStock}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">On Sale</span>
          <span className="admin-stat-value" style={{ color: '#b45309' }}>{productStats.onSale}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Featured</span>
          <span className="admin-stat-value" style={{ color: 'var(--brown)' }}>{productStats.featured}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Total Orders</span>
          <span className="admin-stat-value">{orderStats.total}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Pending Orders</span>
          <span className="admin-stat-value" style={{ color: '#b45309' }}>{orderStats.pending}</span>
        </div>
        <div className="admin-card admin-stat">
          <span className="admin-stat-label">Revenue</span>
          <span className="admin-stat-value" style={{ color: '#047857' }}>MWK {orderStats.revenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Content Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div className="admin-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>Recent Orders</h3>
            <Link href="/admin/orders" className="hover-underline" style={{ fontSize: '0.85rem', color: 'var(--brown)', fontWeight: '600' }}>
              View All Orders →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>No orders placed yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentOrders.map(order => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(0,0,0,0.03)', fontSize: '0.9rem' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <strong style={{ fontFamily: 'monospace', color: 'var(--text-dark)' }}>{order.id}</strong>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--cream)', color: 'var(--brown-dark)', fontWeight: '600', textTransform: 'uppercase' }}>
                        {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      By {order.customer?.name || 'Guest'} • {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>MWK {(order.total || 0).toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: getStatusColor(order.status), textTransform: 'uppercase', marginTop: '4px' }}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="admin-card">
            <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/admin/products" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>
                🛋 Manage Products Catalog
              </Link>
              <Link href="/admin/orders" className="btn btn-outline" style={{ display: 'block', textAlign: 'center' }}>
                📋 View Customer Orders
              </Link>
              <Link href="/admin/posts/new" className="btn btn-whatsapp" style={{ display: 'block', textAlign: 'center' }}>
                ✍ Write New Blog Post
              </Link>
            </div>
          </div>

          <div className="admin-card" style={{ background: 'var(--cream-light)' }}>
            <h3 style={{ marginBottom: '12px' }}>Catalog Alert</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
              We highly recommend keeping your furniture stock counts updated so that online shoppers get accurate availability. When items fall below 3 in stock, warnings will display on this dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
