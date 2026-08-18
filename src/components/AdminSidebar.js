import Link from 'next/link';
import Image from 'next/image';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/posts', label: 'Blog Posts', icon: '✍' },
  { href: '/admin/products', label: 'Products', icon: '🛋' },
  { href: '/admin/orders', label: 'Orders', icon: '📋' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙' },
  { href: '/admin/team', label: 'Team', icon: '👥' },
];

export default function AdminSidebar({ active }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo">
        <Image
          src="/images/akonzi-logo.png"
          alt="Kuphanda"
          width={100}
          height={44}
          style={{ objectFit: 'contain', height: '44px', width: 'auto', filter: 'brightness(0) invert(1)' }}
        />
      </div>
      <p style={{ padding: '0 24px 16px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber)', opacity: 0.7 }}>Admin Panel</p>
      <ul className="admin-nav">
        {navItems.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={active === item.href ? 'active' : ''}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
        <li style={{ marginTop: 'auto', borderTop: '1px solid rgba(212,165,116,0.15)', paddingTop: '16px', marginTop: '32px' }}>
          <Link href="/" target="_blank">
            <span style={{ fontSize: '1.1rem' }}>↗</span>
            View Site
          </Link>
        </li>
      </ul>
      <div style={{ padding: '24px' }}>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            style={{ background: 'rgba(212,165,116,0.1)', border: '1px solid rgba(212,165,116,0.2)', color: 'var(--amber)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontSize: '0.9rem', transition: 'all 0.2s' }}
          >
            🚪 Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
