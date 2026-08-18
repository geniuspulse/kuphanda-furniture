import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { createPost, updatePost, deletePost } from '@/lib/github';

async function checkAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export async function POST(request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, title, excerpt, content, date, author, action, oldSlug } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    const frontmatter = {
      title,
      excerpt,
      date: date || new Date().toISOString().split('T')[0],
      author: author || 'Kuphanda Team',
    };

    if (action === 'create') {
      if (!slug || !title) {
        return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
      }
      await createPost(slug, frontmatter, content || '');
      return NextResponse.json({ success: true });
    }

    if (action === 'update') {
      if (!slug || !title) {
        return NextResponse.json({ error: 'Slug and title are required' }, { status: 400 });
      }
      await updatePost(slug, frontmatter, content || '', oldSlug);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
      }
      await deletePost(slug);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: `Invalid action: ${action}` }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
