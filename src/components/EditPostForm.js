'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditPostForm({ post }) {
  const [title, setTitle] = useState(post.title || '');
  const [slug, setSlug] = useState(post.slug || '');
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [content, setContent] = useState(post.content || '');
  const [author, setAuthor] = useState(post.author || 'Kuphanda Team');
  const [date, setDate] = useState(post.date || '');

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
          action: 'update',
          title,
          slug,
          excerpt,
          content,
          author,
          date,
          oldSlug: post.slug,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        setError(data.error || 'Failed to update blog post. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the post.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the blog post "${post.title}"? This cannot be undone.`)) {
      return;
    }
    setDeleting(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          slug: post.slug,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete post.');
      }
    } catch (err) {
      alert('An error occurred while deleting the post.');
    } finally {
      setDeleting(false);
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
        <h1>Edit Blog Post</h1>
        <p className="subtitle" style={{ margin: 0 }}>Edit the details and content of "{post.title}".</p>
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
            required
            rows={12}
            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical', lineHeight: '1.6' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <button type="button" onClick={handleDelete} disabled={deleting} className="btn btn-danger" style={{ minWidth: '120px' }}>
            {deleting ? 'Deleting...' : 'Delete Post'}
          </button>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/admin/posts" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center' }}>
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '150px' }}>
              {loading ? 'Saving changes...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
