import { getProductById, getRelatedProducts, getSettings, getProducts } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ProductDetailClient from '@/components/ProductDetailClient';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const products = getProducts();
  return products.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.name} | Kuphanda Furniture`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Kuphanda Furniture`,
      description: product.description,
      images: [product.image || (product.images && product.images[0])],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);
  const settings = getSettings();

  const effectivePrice = (product.salePrice && product.salePrice < product.price) ? product.salePrice : product.price;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akonzi-sofa-furniture.vercel.app';
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    image: product.image || (product.images && product.images[0]) ? [`${baseUrl}${product.image || product.images[0]}`] : [],
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Kuphanda Furniture' },
    category: product.category || 'Furniture',
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.id}`,
      priceCurrency: 'MWK',
      price: effectivePrice || 0,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Kuphanda Furniture' },
    },
  };

  return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <Navbar settings={settings} />

      <main style={{ paddingTop: '140px', paddingBottom: '60px' }}>
        <div className="container">
          {/* Breadcrumb */}
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
            <span>/</span>
            <Link href="/products" style={{ color: 'var(--text-muted)' }}>Collection</Link>
            <span>/</span>
            <span style={{ color: 'var(--brown)', fontWeight: 500 }}>{product.name}</span>
          </div>

          <ProductDetailClient product={product} relatedProducts={related} settings={settings} />
        </div>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} businessName={settings.name} />
    </>

  );
}
