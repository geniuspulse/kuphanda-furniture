import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { siteConfig, whatsappLink } from './config';
import { getSettings } from './settings';

export { siteConfig, whatsappLink, getSettings };

// ===== Products =====
const productsPath = path.join(process.cwd(), 'data', 'products.json');

export function getProducts() {
  try {
    const rawData = fs.readFileSync(productsPath, 'utf-8');
    const products = JSON.parse(rawData);
    // Ensure backward compat: if no images array, create from image field
    return products.map(p => ({
      ...p,
      images: p.images || (p.image ? [p.image] : []),
      variations: p.variations || [],
      specifications: p.specifications || {},
      category: p.category || 'Uncategorized',
      description: p.description || '',
      price: p.price || null,
      stockCount: p.stockCount !== undefined ? p.stockCount : (p.inStock ? 10 : 0),
    }));
  } catch (err) {
    console.error('Error reading products.json:', err);
    return [];
  }
}

export function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id);
}

export function getFeaturedProducts() {
  return getProducts().filter(p => p.featured);
}

export function getCategories() {
  const products = getProducts();
  return [...new Set(products.map(p => p.category))];
}

export function getSaleProducts() {
  return getProducts().filter(p => p.salePrice && p.salePrice < p.price);
}

export function getOnSaleCount() {
  return getSaleProducts().length;
}

export function searchProducts(query, category = '', sortBy = 'featured') {
  let products = getProducts();

  // Filter by category
  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by search query
  if (query) {
    const q = query.toLowerCase();
    products = products.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  }

  // Sort
  switch (sortBy) {
    case 'price-low':
      products.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
      break;
    case 'price-high':
      products.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
      break;
    case 'name':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'newest':
      // Keep existing order (new products added at end of JSON)
      break;
    case 'featured':
    default:
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return products;
}

export function getEffectivePrice(product) {
  if (product.salePrice && product.salePrice < product.price) {
    return product.salePrice;
  }
  return product.price || 0;
}

export function getRelatedProducts(product, limit = 4) {
  const allProducts = getProducts();
  // Same category first, then fill with other products
  const sameCategory = allProducts.filter(p => p.id !== product.id && p.category === product.category);
  const others = allProducts.filter(p => p.id !== product.id && p.category !== product.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function formatPrice(price) {
  if (price === null || price === undefined) return 'Price on request';
  return `MWK ${Number(price).toLocaleString('en-US')}`;
}

export function getProductStats() {
  const products = getProducts();
  return {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    onSale: products.filter(p => p.salePrice && p.salePrice < p.price).length,
    featured: products.filter(p => p.featured).length,
    categories: getCategories().length,
  };
}

// ===== Blog Posts =====
const postsDir = path.join(process.cwd(), 'content', 'blog');

export function getAllPosts() {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  const posts = files.map(filename => {
    const filePath = path.join(postsDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    const slug = filename.replace('.md', '');
    return {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || '',
      excerpt: frontmatter.excerpt || '',
      author: frontmatter.author || 'Kuphanda Team',
      content,
    };
  });
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

export function getPostBySlug(slug) {
  const posts = getAllPosts();
  const post = posts.find(p => p.slug === slug);
  if (!post) return null;
  return {
    ...post,
    htmlContent: marked.parse(post.content),
  };
}

// ===== Orders =====
const ordersPath = path.join(process.cwd(), 'data', 'orders.json');

export function getOrders() {
  try {
    if (fs.existsSync(ordersPath)) {
      const raw = fs.readFileSync(ordersPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export function getOrderById(id) {
  return getOrders().find(o => o.id === id);
}

export function getOrderStats() {
  const orders = getOrders();
  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0),
  };
}
