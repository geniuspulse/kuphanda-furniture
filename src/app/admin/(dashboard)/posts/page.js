import Link from 'next/link';
import { getAllPosts } from '@/lib/data';
import DeletePostButton from '@/components/DeletePostButton';

export default function AdminPostsPage() {
  const posts = getAllPosts() || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>Blog Posts</h1>
          <p className="subtitle" style={{ margin: 0 }}>Manage your website's blog posts and stories.</p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary">
          + Write New Post
        </Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {posts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No blog posts found. Click "+ Write New Post" to create your first article!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Title</th>
                  <th style={{ width: '20%' }}>Date</th>
                  <th style={{ width: '15%' }}>Author</th>
                  <th style={{ width: '20%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug}>
                    <td>
                      <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{post.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                        {post.excerpt || 'No excerpt provided.'}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                      {post.date ? new Date(post.date).toLocaleDateString('en-GB') : 'No date'}
                    </td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                      {post.author || 'Kuphanda Team'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Link href={`/admin/posts/${post.slug}`} className="btn btn-sm btn-outline">
                          Edit
                        </Link>
                        <DeletePostButton slug={post.slug} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
