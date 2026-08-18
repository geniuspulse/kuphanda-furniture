export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akonzi-sofa-furniture.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/cart', '/checkout', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
