import { getProducts, getAllPosts } from '@/lib/data';
import { getSettings } from '@/lib/settings';

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akonzi-sofa-furniture.vercel.app';
  const settings = getSettings();
  const products = getProducts();
  const posts = getAllPosts();

  const staticPages = [
    { url: `${baseUrl}/`, priority: 1.0, changeFrequency: 'weekly' },
    { url: `${baseUrl}/products`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' },
    { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${baseUrl}/blog`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${baseUrl}/cart`, priority: 0.3, changeFrequency: 'weekly' },
    { url: `${baseUrl}/checkout`, priority: 0.3, changeFrequency: 'weekly' },
  ];

  const productPages = products.map(p => ({
    url: `${baseUrl}/products/${p.id}`,
    priority: 0.8,
    changeFrequency: 'weekly',
    lastModified: p.updatedAt || new Date().toISOString(),
  }));

  const blogPages = posts.map(p => ({
    url: `${baseUrl}/blog/${p.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
    lastModified: p.date,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
