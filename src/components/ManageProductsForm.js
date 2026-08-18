'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Helper to parse Specifications (Key: Value per line) into object
const parseSpecifications = (text) => {
  const obj = {};
  if (!text) return obj;
  const lines = text.split('\n');
  lines.forEach(line => {
    const idx = line.indexOf(':');
    if (idx !== -1) {
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key) {
        obj[key] = value;
      }
    }
  });
  return obj;
};

// Helper to format Specifications object back to text
const formatSpecifications = (obj) => {
  if (!obj || typeof obj !== 'object') return '';
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
};

// Helper to parse Variations (Name: Option1, Option2 per line) into array of {name, options}
const parseVariations = (text) => {
  const arr = [];
  if (!text) return arr;
  const lines = text.split('\n');
  lines.forEach(line => {
    const idx = line.indexOf(':');
    if (idx !== -1) {
      const name = line.slice(0, idx).trim();
      const optionsStr = line.slice(idx + 1).trim();
      if (name && optionsStr) {
        const options = optionsStr.split(',').map(opt => opt.trim()).filter(Boolean);
        arr.push({ name, options });
      }
    }
  });
  return arr;
};

// Helper to format Variations array back to text
const formatVariations = (arr) => {
  if (!arr || !Array.isArray(arr)) return '';
  return arr
    .map(item => {
      const optionsStr = Array.isArray(item.options) ? item.options.join(', ') : '';
      return `${item.name}: ${optionsStr}`;
    })
    .join('\n');
};

export default function ManageProductsForm({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [badge, setBadge] = useState('');
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);

  // New fields state variables
  const [salePrice, setSalePrice] = useState('');
  const [stockCount, setStockCount] = useState(10);
  const [imagesText, setImagesText] = useState('');
  const [specificationsText, setSpecificationsText] = useState('');
  const [variationsText, setVariationsText] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const existingCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setId(product.id || '');
    setName(product.name || '');
    setDescription(product.description || '');
    setPrice(product.price === null || product.price === undefined ? '' : product.price);
    setCategory(product.category || '');
    setImage(product.image || '/images/placeholder.png');
    setBadge(product.badge || '');
    setInStock(product.inStock !== false);
    setFeatured(!!product.featured);
    
    // Populate new fields
    setSalePrice(product.salePrice === null || product.salePrice === undefined ? '' : product.salePrice);
    setStockCount(product.stockCount === null || product.stockCount === undefined ? 10 : product.stockCount);
    setImagesText(Array.isArray(product.images) ? product.images.join(', ') : (product.image ? product.image : ''));
    setSpecificationsText(formatSpecifications(product.specifications));
    setVariationsText(formatVariations(product.variations));

    setError('');
    setSuccessMsg('');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewClick = () => {
    setEditingProduct('new');
    setId('');
    setName('');
    setDescription('');
    setPrice('');
    setCategory(existingCategories[0] || 'Sofas');
    setImage('/images/placeholder.png');
    setBadge('');
    setInStock(true);
    setFeatured(false);

    // Reset new fields
    setSalePrice('');
    setStockCount(10);
    setImagesText('');
    setSpecificationsText('');
    setVariationsText('');

    setError('');
    setSuccessMsg('');
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setError('');
    setSuccessMsg('');
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (editingProduct === 'new') {
      const generatedId = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setId(generatedId);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!id || !name) {
      setError('Product ID and Name are required.');
      return;
    }

    if (editingProduct === 'new' && products.some(p => p.id === id)) {
      setError(`A product with ID "${id}" already exists. Please choose a unique ID.`);
      return;
    }

    // Parse values
    const parsedImages = imagesText
      ? imagesText.split(/[,\n]/).map(img => img.trim()).filter(Boolean)
      : [];

    const updatedProduct = {
      id,
      name,
      description,
      price: price === '' ? null : Number(price),
      salePrice: salePrice === '' ? null : Number(salePrice),
      currency: 'MWK',
      image,
      images: parsedImages,
      category,
      badge: badge === '' ? null : badge,
      inStock,
      stockCount: stockCount === '' ? 10 : Number(stockCount),
      featured,
      specifications: parseSpecifications(specificationsText),
      variations: parseVariations(variationsText),
    };

    let newProductsList;
    if (editingProduct === 'new') {
      newProductsList = [...products, updatedProduct];
    } else {
      newProductsList = products.map(p => p.id === editingProduct.id ? updatedProduct : p);
    }

    await saveProducts(newProductsList);
  };

  const handleDeleteClick = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete the product "${productName}"?`)) {
      return;
    }
    setError('');
    setSuccessMsg('');

    const newProductsList = products.filter(p => p.id !== productId);
    await saveProducts(newProductsList);
  };

  const saveProducts = async (updatedProductsList) => {
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProductsList }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(updatedProductsList);
        setEditingProduct(null);
        setSuccessMsg('Product catalog updated and saved successfully!');
        router.refresh();
      } else {
        setError(data.error || 'Failed to save products. Please check your config.');
      }
    } catch (err) {
      setError('An error occurred while saving the products catalog.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Products Catalog</h1>
          <p className="subtitle" style={{ margin: 0 }}>Add, edit, or delete items in your furniture catalog.</p>
        </div>
        {!editingProduct && (
          <button onClick={handleAddNewClick} className="btn btn-primary">
            + Add New Product
          </button>
        )}
      </div>

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '16px', borderRadius: 'var(--radius)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '500' }}>
          {successMsg}
        </div>
      )}

      {error && (
        <div style={{ background: '#fdf2f2', border: '1px solid #f5c2c2', color: '#9b1c1c', padding: '16px', borderRadius: 'var(--radius)', marginBottom: '24px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {editingProduct && (
        <div className="admin-card" style={{ border: '2px solid var(--amber)', background: 'var(--cream-light)', padding: '24px', borderRadius: 'var(--radius)', marginBottom: '32px' }}>
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '20px' }}>
            {editingProduct === 'new' ? 'Add New Furniture Product' : `Edit Product: ${editingProduct.name}`}
          </h3>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Row 1: Name + ID */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Luxury L-Shaped Sectional Sofa"
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                  Unique ID (slug)
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. luxury-l-shaped-sofa"
                  disabled={editingProduct !== 'new'}
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'monospace', background: editingProduct !== 'new' ? '#f3f4f6' : '#fff' }}
                />
              </div>
            </div>

            {/* Row 2: Price + Sale Price + Stock Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                  Price (MWK) - leave empty for Contact Us
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 26000"
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                  Sale Price (MWK) - optional
                </label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="e.g. 22000"
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                  Stock Count
                </label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  placeholder="e.g. 10"
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>
            </div>

            {/* Row 3: Category + Badge + Image */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                  Category
                </label>
                <input
                  type="text"
                  list="categories-list"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Select or type new"
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
                <datalist id="categories-list">
                  {existingCategories.map(cat => <option key={cat} value={cat} />)}
                  <option value="Sofas" />
                  <option value="Sofa Sets" />
                  <option value="Dining" />
                  <option value="Tables" />
                  <option value="Bedroom" />
                </datalist>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                  Badge (Optional)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Popular, Best Value, New"
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                  Primary Image Path
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/hero-showroom.png"
                  required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
                />
              </div>
            </div>

            {/* Row 4: Multiple Images */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                Multiple Images (comma or newline separated paths)
              </label>
              <textarea
                value={imagesText}
                onChange={(e) => setImagesText(e.target.value)}
                placeholder="/images/sofa-angle1.png, /images/sofa-angle2.png"
                rows={2}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            {/* Row 5: Description */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product specifications, measurements, wood type, foam quality..."
                required
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
              />
            </div>

            {/* Row 6: Specifications */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                Specifications (Key: Value - one per line)
              </label>
              <textarea
                value={specificationsText}
                onChange={(e) => setSpecificationsText(e.target.value)}
                placeholder="Material: Premium Mahogany&#10;Warranty: 5 Years&#10;Seating Capacity: 3 Seater"
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.95rem', fontFamily: 'monospace', resize: 'vertical' }}
              />
            </div>

            {/* Row 7: Variations */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>
                Variations (VariationName: Option1, Option2, Option3 - one per line)
              </label>
              <textarea
                value={variationsText}
                onChange={(e) => setVariationsText(e.target.value)}
                placeholder="Color: Velvet Grey, Cream White, Ocean Blue&#10;Size: 3 Seater, 2 Seater, Sofa Set"
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.95rem', fontFamily: 'monospace', resize: 'vertical' }}
              />
            </div>

            {/* Row 8: Checkboxes */}
            <div style={{ display: 'flex', gap: '30px', alignItems: 'center', margin: '10px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                In Stock & Available
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '0.95rem' }}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                Featured (Display on homepage)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <button type="button" onClick={handleCancel} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '150px' }}>
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden', marginTop: '24px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Image</th>
              <th style={{ width: '30%' }}>Name & Description</th>
              <th style={{ width: '15%' }}>Category</th>
              <th style={{ width: '15%' }}>Price</th>
              <th style={{ width: '15%' }}>Status</th>
              <th style={{ width: '15%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div style={{ width: '54px', height: '54px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)', background: '#fff', position: 'relative' }}>
                    <img 
                      src={product.image || '/images/placeholder.png'} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12" fill="%239ca3af">No Image</text></svg>'; }}
                    />
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{product.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '300px' }}>
                    {product.description}
                  </div>
                  {product.badge && (
                    <span style={{ display: 'inline-block', fontSize: '0.7rem', fontWeight: '600', background: 'var(--amber)', color: 'var(--brown-dark)', padding: '2px 8px', borderRadius: '12px', marginTop: '4px' }}>
                      {product.badge}
                    </span>
                  )}
                </td>
                <td style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{product.category}</td>
                <td style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: '600' }}>
                  {product.price === null || product.price === undefined ? (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontWeight: 'normal' }}>Contact Us</span>
                  ) : product.salePrice && product.salePrice < product.price ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 'normal' }}>
                        MWK {product.price.toLocaleString()}
                      </span>
                      <span style={{ color: '#dc3545' }}>
                        MWK {product.salePrice.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    `MWK ${product.price.toLocaleString()}`
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '500', color: product.inStock ? '#047857' : '#9b1c1c' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.inStock ? '#10b981' : '#ef4444' }}></span>
                      {product.inStock ? `In Stock (${product.stockCount ?? 10})` : 'Out of Stock'}
                    </span>
                    {product.featured && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--brown)', fontWeight: '600' }}>★ Featured</span>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button onClick={() => handleEditClick(product)} className="btn btn-sm btn-outline">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteClick(product.id, product.name)} className="btn btn-sm btn-danger">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
