'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Kuphanda Team');
  const [date, setDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Helper to generate slug from title
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug) {
      setError('Title and Slug are required.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          title,
          slug,
          excerpt,
          content,
          author,
          date,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        setError(data.error || 'Failed to create blog post. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin/posts" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--brown)', fontWeight: '500', fontSize: '0.9rem', textDecoration: 'none', marginBottom: '12px' }}>
          <svg style={{ width: '16px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Posts List
        </Link>
        <h1>Write New Blog Post</h1>
        <p className="subtitle" style={{ margin: 0 }}>Create a new article for your website's blog.</p>
      </div>

      {error && (
        <div style={{ background: '#fdf2f2', border: '1px solid #f5c2c2', color: '#9b1c1c', padding: '16px', borderRadius: 'var(--radius)', marginBottom: '24px', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
              Post Title
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="e.g. 5 Tips on choosing the right Sofa color"
              required
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
              Slug (URL path)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="e.g. 5-tips-choosing-sofa-color"
              required
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'monospace' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Kuphanda Team"
              required
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
              Publish Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
            Excerpt (Short Summary)
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary shown in post lists to hook readers..."
            required
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem' }}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
            Content (Markdown supported)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content here..."
            required
            rows={12}
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical', lineHeight: '1.6' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <Link href="/admin/posts" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center' }}>
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '150px' }}>
            {loading ? 'Saving post...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
