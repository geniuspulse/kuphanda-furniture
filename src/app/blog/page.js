import { getSettings } from '@/lib/settings';
import Link from 'next/link';
import { getAllPosts } from '@/lib/data';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata = {
  title: 'Blog | Kuphanda Furniture',
  description: 'Tips, guides, and inspiration for choosing quality furniture in Lilongwe, Malawi. Learn about sofa sets, dining sets, beds, and more from Kuphanda.',
  openGraph: {
    title: 'Blog | Kuphanda Furniture',
    description: 'Tips, guides, and inspiration for choosing quality furniture in Lilongwe, Malawi.',
  },
};

export default function BlogListingPage() {
  const settings = getSettings();
  const posts = getAllPosts();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
      <>
        <Navbar />
      
      <main style={{ minHeight: '80vh' }}>
        {/* Header Section */}
        <header style={{ padding: '140px 0 60px', background: 'var(--cream-light)', textAlign: 'center' }}>
          <div className="container">
            <h1 className="section-title">Our Blog</h1>
            <p className="section-subtitle">Furniture Tips & Stories from the Kuphanda Team</p>
          </div>
        </header>

        {/* Blog Grid Section */}
        <section style={{ padding: '60px 0 120px' }}>
          <div className="container">
            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p className="section-subtitle">No articles found. Check back soon!</p>
              </div>
            ) : (
              <div className="blog-grid">
                {posts.map((post) => (
                  <article key={post.slug} className="blog-card">
                    {/* Visual Placeholder for Blog Post */}
                    <Link href={`/blog/${post.slug}`} className="blog-card-image" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                      <span style={{ fontSize: '3.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
                        {post.title.charAt(0)}
                      </span>
                    </Link>
                    
                    {/* Card Content */}
                    <div className="blog-card-content">
                      <h2 className="blog-card-title">
                        <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {post.title}
                        </Link>
                      </h2>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                      <div className="blog-card-meta">
                        <span>By {post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} businessName={settings.name} />
    </>

  );
}
