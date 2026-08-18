import { getSettings } from '@/lib/settings';
import Link from 'next/link';
import { siteConfig, whatsappLink } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function AboutPage() {
  const settings = getSettings();
  const aboutWhatsappMessage = "Hello Kuphanda Furniture, I would like to discuss a custom furniture order.";
  const aboutWhatsappUrl = whatsappLink(aboutWhatsappMessage, settings.whatsapp);

  return (
      <>
        <Navbar />
      
      {/* Page Header */}
      <section className="section section-cream" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '0' }}>
            <span className="section-eyebrow">About Us</span>
            <h1 className="section-title">The Kuphanda Story</h1>
            <p className="section-subtitle">
              We custom-make high quality office and home furniture using premium Malawian hardwood. Visit our showroom in Likuni, Lilongwe.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section section-warm">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src="/images/executive-desk.png" alt="Kuphanda Furniture Workshop" />
              <div className="about-image-badge">
                <span className="badge-number">Made in</span>
                <span className="badge-text">Malawi</span>
              </div>
            </div>
            <div>
              <span className="section-eyebrow">Our Journey</span>
              <h2 className="section-title">Crafting Bespoke Furniture for a Productive Workspace</h2>
              <p className="about-lead">
                Kuphanda Furniture started with a simple mission: to create bespoke and modern office furniture for a productive working environment, right here in Lilongwe.
              </p>
              <div className="about-body">
                <p style={{ marginBottom: '16px' }}>
                  From our workshop and showroom at Matope House Complex in Likuni, we custom-make office furniture that meets the unique needs of Malawian businesses and homes. Whether it's an executive desk, a boardroom table for 12, or a complete office fit-out, we build it to your exact specifications.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  Using locally sourced hardwood — primarily Mlombwa — we craft furniture that combines durability with timeless design. Our range extends beyond office furniture to include hardwood doors, beds, wardrobes, school desks, and church benches.
                </p>
                <p>
                  Every piece that leaves our workshop is custom-made to order, ensuring that our customers get exactly what they need — the right dimensions, the right finish, and the right style for their space.
                </p>
              </div>
              <div className="about-stats" style={{ marginTop: '24px' }}>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Malawian Made</span>
                </div>
                <div className="stat">
                  <span className="stat-number">Custom</span>
                  <span className="stat-label">Made to Order</span>
                </div>
                <div className="stat">
                  <span className="stat-number">All</span>
                  <span className="stat-label">Sizes Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Features Section */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Why Kuphanda</span>
            <h2 className="section-title">Our Core Principles</h2>
            <p className="section-subtitle">
              We hold ourselves to the highest standard of carpentry and customer service. Here is what we promise with every order.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="feature-title">Quality Craftsmanship</h3>
              <p className="feature-desc">
                Every piece is built using treated local hardwood, joined with precision, and finished to your specifications.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <h3 className="feature-title">Custom-Made to Order</h3>
              <p className="feature-desc">
                We customize dimensions, finishes, and materials to match your space and style perfectly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Built to Last</h3>
              <p className="feature-desc">
                We design and build furniture to withstand heavy daily use. No creaks, no sagging, no compromises.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <h3 className="feature-title">Made in Malawi</h3>
              <p className="feature-desc">
                Locally sourced hardwood, local craftsmanship, and local pride in every piece we build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-warm" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="section-eyebrow">Get Started</span>
          <h2 className="section-title">Ready to Order Custom Furniture?</h2>
          <p className="section-subtitle" style={{ marginBottom: '32px' }}>
            We customize dimensions, colors, and materials. Call or WhatsApp us and get a free quote today.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={aboutWhatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-large">
              Consult on WhatsApp
            </a>
            <Link href="/products" className="btn btn-primary btn-large">
              Browse Our Catalogue
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} businessName={settings.name} />
    </>
  );
}
