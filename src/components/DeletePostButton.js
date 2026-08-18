'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeletePostButton({ slug, title }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the blog post "${title}"? This cannot be undone.`)) {
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: 'delete' }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete post.');
      }
    } catch (err) {
      alert('An error occurred while deleting the post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading} 
      className="btn btn-sm btn-danger"
      style={{ minWidth: '80px' }}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
