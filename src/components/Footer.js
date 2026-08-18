import { siteConfig } from '@/lib/config';
import Link from 'next/link';
import Image from 'next/image';


export default function Footer({ settings: propSettings }) {
  const settings = { ...siteConfig, ...propSettings };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/">
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--warm-white)', textDecoration: 'none' }}>
                Kuphanda Furniture
              </span>
            </Link>
            <p className="footer-tagline">{settings.tagline}</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '8px' }}>{settings.location || 'Likuni, Lilongwe, Malawi'}</p>
          </div>

          {/* Explore */}
          <div className="footer-links">
            <h4>Explore</h4>
            <Link href="/about">About Us</Link>
            <Link href="/products">Catalogue</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </div>

          {/* Products */}
          <div className="footer-links">
            <h4>Products</h4>
            <Link href="/products?category=Office Furniture">Office Furniture</Link>
            <Link href="/products?category=Doors">Hardwood Doors</Link>
            <Link href="/products?category=Bedroom">Beds & Wardrobes</Link>
            <Link href="/products?category=School & Church">School & Church</Link>
          </div>

          {/* Connect */}
          <div className="footer-links">
            <h4>Connect</h4>
            <a href={settings.facebook} target="_blank" rel="noopener">Facebook</a>
            <a href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("Hello! I'd like to enquire about your furniture.")}`} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            <a href={`tel:${settings.phone}`}>Call: {settings.phone}</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <p>Website by <a href="https://brandfletch.com" target="_blank" rel="noopener" className="footer-credit">Brandfletch Media</a></p>
        </div>
      </div>
    </footer>
  );
}
