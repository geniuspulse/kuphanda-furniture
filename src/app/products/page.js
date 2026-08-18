import {
  getSettings,
  getProducts,
  getCategories,
  searchProducts,
  formatPrice,
  getSaleProducts,
} from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default async function ProductsPage({ searchParams }) {
  const settings = getSettings();
  const resolvedParams = (await searchParams) || {};
  const currentCategory = resolvedParams.category || '';
  const currentSearch = resolvedParams.search || '';
  const currentSort = resolvedParams.sort || 'featured';

  // Get data using the specified filter function
  const filteredProducts = searchProducts(currentSearch, currentCategory, currentSort);
  const categories = getCategories();
  const saleProducts = getSaleProducts();
  const saleCount = saleProducts.length;

  // Helper to build URL query strings safely
  const getFilterUrl = (cat, search, sort) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    return qs ? `/products?${qs}` : '/products';
  };

  return (
      <>
        <Navbar settings={settings} />

      {/* Page Header */}
      <section className="section section-cream" style={{ paddingTop: '120px', paddingBottom: '40px' }}>
        <div className="container">
          {/* Sale ticker — full-width row ABOVE heading */}
          {saleCount > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--amber)',
                  color: 'var(--brown-dark)',
                  padding: '8px 20px',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  boxShadow: 'var(--shadow)',
                }}
              >
                🔥 {saleCount} Special Offers Active!
              </span>
            </div>
          )}
          <div className="section-header" style={{ marginBottom: '20px' }}>
            <span className="section-eyebrow">Our Collection</span>
            <h1 className="section-title">Handcrafted Furniture Range</h1>
            <p className="section-subtitle">
              Browse our premium, durable and affordable products. Each piece can be customized to match your space, style, and fabric preference.
            </p>
          </div>

          {/* Search and Sort Form */}
          <form
            method="GET"
            action="/products"
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '32px',
              maxWidth: '800px',
              margin: '30px auto',
            }}
          >
            {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
            
            <div style={{ flex: '1', minWidth: '260px', position: 'relative' }}>
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                defaultValue={currentSearch}
                style={{
                  padding: '14px 24px',
                  borderRadius: '50px',
                  border: '2px solid var(--border)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  width: '100%',
                  outline: 'none',
                  backgroundColor: 'var(--warm-white)',
                  color: 'var(--text-dark)',
                }}
              />
            </div>

            <select
              name="sort"
              defaultValue={currentSort}
              style={{
                padding: '14px 24px',
                borderRadius: '50px',
                border: '2px solid var(--border)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                backgroundColor: 'var(--warm-white)',
                color: 'var(--text-body)',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '180px',
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price Low-High</option>
              <option value="price-high">Price High-Low</option>
              <option value="name">Name A-Z</option>
              <option value="newest">Newest</option>
            </select>

            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ padding: '14px 32px', fontSize: '0.95rem' }}
            >
              Apply
            </button>
          </form>

          {/* Category Filters */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              margin: '20px auto 10px',
              maxWidth: '900px',
            }}
          >
            <Link
              href={getFilterUrl('', currentSearch, currentSort)}
              className={`btn btn-sm ${!currentCategory ? 'btn-primary' : 'btn-outline'}`}
            >
              All Collection
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={getFilterUrl(cat, currentSearch, currentSort)}
                className={`btn btn-sm ${
                  currentCategory.toLowerCase() === cat.toLowerCase()
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
              >
                {cat === 'Tables'
                  ? 'Coffee Tables'
                  : cat === 'Bedroom'
                  ? 'Beds & Bedroom'
                  : cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="section section-warm" style={{ paddingTop: '50px', minHeight: '500px' }}>
        <div className="container">
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2rem',
                  color: 'var(--text-dark)',
                  marginBottom: '16px',
                }}
              >
                No Products Found
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>
                We couldn't find any products matching your search criteria.
              </p>
              <Link href="/products" className="btn btn-primary">
                View All Products
              </Link>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} businessName={settings.name} />
    </>

  );
}
