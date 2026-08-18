import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/data';
import EditPostForm from '@/components/EditPostForm';

export default function EditPostPage({ params }) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <EditPostForm post={post} />;
}
