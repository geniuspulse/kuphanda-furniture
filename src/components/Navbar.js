'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

export default function Navbar({ settings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="navbar navbar-solid">
      <div className="nav-container">
        {/* Logo */}
        <Link href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: 'var(--brown-dark)',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
          }}>
            Kuphanda
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className={`nav-menu${menuOpen ? ' active' : ''}`} id="navMenu">
          {[
            { href: '/', label: 'Home' },
            { href: '/about', label: 'About' },
            { href: '/products', label: 'Catalogue' },
            { href: '/blog', label: 'Blog' },
            { href: '/contact', label: 'Contact' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="nav-link" onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            </li>
          ))}

          {/* Cart icon + label */}
          <li>
            <Link href="/cart" className="nav-link cart-badge" onClick={() => setMenuOpen(false)} aria-label="Cart">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}>
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span style={{ fontWeight: 600 }}>Cart</span>
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </span>
            </Link>
          </li>

          {/* Order Now CTA */}
          <li>
            <Link href="/checkout" className="nav-link nav-cta" onClick={() => setMenuOpen(false)}>
              Order Now
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  );
}
