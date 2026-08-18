import Link from 'next/link';
import { getFeaturedProducts, getSaleProducts, getCategories, getProducts, siteConfig, whatsappLink, formatPrice, getEffectivePrice } from '@/lib/data';
import { getSettings } from '@/lib/settings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const settings = getSettings();
  const featuredProducts = getFeaturedProducts();
  const saleProducts = getSaleProducts();
  const categories = getCategories();
  const allProducts = getProducts();

  const categoryCounts = {};
  allProducts.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const categoryImages = {};
  categories.forEach(cat => {
    const product = allProducts.find(p => p.category === cat);
    if (product) categoryImages[cat] = product.image || (product.images && product.images[0]);
  });

  const heroWhatsappMessage = "Hello Kuphanda Furniture, I would like to make an inquiry or order some furniture.";
  const heroWhatsappUrl = whatsappLink(heroWhatsappMessage, settings.whatsapp);

  return (
      <>
        <Navbar settings={settings} />
      
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-eyebrow">Custom-Made in Lilongwe</span>
          <h1 className="hero-title">{settings.name}</h1>
          <p className="hero-tagline">{settings.tagline}</p>
          <div className="hero-cta">
            <Link href="/products" className="btn btn-primary btn-large">
              Browse Catalogue
            </Link>
            <a href={heroWhatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-large">
              Enquire via WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Feature Bar */}
      <section className="feature-bar">
        <div className="feature-bar-inner">
          <div className="feature-bar-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Quality Craftsmanship</span>
          </div>
          <div className="feature-bar-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>Custom-Made to Order</span>
          </div>
          <div className="feature-bar-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span>Built to Last</span>
          </div>
          <div className="feature-bar-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <span>Made in Malawi</span>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section section-cream" style={{ paddingTop: '100px' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Shop by Category</span>
            <h2 className="section-title">Explore Our Range</h2>
            <p className="section-subtitle">
              From office furniture to hardwood doors and bedroom sets — custom-made for your home and business.
            </p>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <Link href={`/products?category=${encodeURIComponent(cat)}`} key={cat} className="category-card">
                <div className="category-card-image">
                  <img src={categoryImages[cat]} alt={cat} />
                </div>
                <div className="category-card-info">
                  <h3>{cat}</h3>
                  <span className="category-count">{categoryCounts[cat]} {categoryCounts[cat] === 1 ? 'product' : 'products'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* On Sale Section */}
      {saleProducts.length > 0 && (
        <section className="section section-warm" style={{ background: 'linear-gradient(135deg, #fef3e2 0%, #faf7f2 100%)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow" style={{ color: '#dc2626' }}>Limited Time Offers</span>
              <h2 className="section-title">On Sale Now</h2>
              <p className="section-subtitle">
                Save on selected furniture. Limited stock available!
              </p>
            </div>
            <div className="products-grid">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Preview */}
      <section className="section section-cream">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img src="/images/boardroom-table.png" alt="Kuphanda Furniture Workshop" />
              <div className="about-image-badge">
                <span className="badge-number">Made in</span>
                <span className="badge-text">Malawi</span>
              </div>
            </div>
            <div>
              <span className="section-eyebrow">Our Story</span>
              <h2 className="section-title">Custom Furniture for Your Home & Office</h2>
              <p className="about-lead">
                At Kuphanda Furniture, we custom-make high quality office and home furniture using premium Malawian hardwood.
              </p>
              <p className="about-body">
                Located in Likuni, Lilongwe, we specialize in crafting bespoke office furniture for a modern, productive working environment.
                From executive desks and boardroom tables to office cabinets and ergonomic chairs, every piece is made to order to your exact specifications.
                We also craft hardwood doors, beds, wardrobes, school desks, and church benches — all built to last.
              </p>
              <div className="about-stats" style={{ marginBottom: '32px' }}>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Malawian Made</span>
                </div>
                <div className="stat">
                  <span className="stat-number">Custom</span>
                  <span className="stat-label">Made to Order</span>
                </div>
                <div className="stat">
                  <span className="stat-number">2</span>
                  <span className="stat-label">Showroom Shops</span>
                </div>
              </div>
              <Link href="/about" className="btn btn-outline">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-warm">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Our Collection</span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Take a look at some of our best-selling custom-made furniture pieces, crafted to perfection.
            </p>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/products" className="btn btn-primary btn-large">
              View Full Catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section section-cream-bg">
        <div className="container">
          <div className="process-section">
            <h2 className="process-title">How It Works</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <h4>Browse Catalogue</h4>
                <p>Explore our range of custom-made furniture online.</p>
              </div>
              <span className="process-arrow" style={{ display: 'none' }} aria-hidden="true">&rarr;</span>
              <div className="process-step">
                <div className="step-number">2</div>
                <h4>Customize Your Order</h4>
                <p>Choose your size, finish, and fabric preferences. We make it to order.</p>
              </div>
              <span className="process-arrow" style={{ display: 'none' }} aria-hidden="true">&rarr;</span>
              <div className="process-step">
                <div className="step-number">3</div>
                <h4>Enquire via WhatsApp</h4>
                <p>Send us your order details on WhatsApp or call us directly.</p>
              </div>
              <span className="process-arrow" style={{ display: 'none' }} aria-hidden="true">&rarr;</span>
              <div className="process-step">
                <div className="step-number">4</div>
                <h4>We Build & Deliver</h4>
                <p>We craft your furniture and arrange delivery to your location.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="section section-warm" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span className="section-eyebrow">Get in Touch</span>
          <h2 className="section-title">Ready to Order Custom Furniture?</h2>
          <p className="section-subtitle" style={{ marginBottom: '32px' }}>
            Call or WhatsApp us at {settings.phone} / {settings.phone2}. Visit our showroom at {settings.address}.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={heroWhatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-large">
              Enquire on WhatsApp
            </a>
            <Link href="/products" className="btn btn-primary btn-large">
              Browse Catalogue
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} businessName={settings.name} />
    </>
  );
}
