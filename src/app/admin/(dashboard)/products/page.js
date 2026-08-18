import ManageProductsForm from '@/components/ManageProductsForm';
import { getProducts } from '@/lib/data';

export const metadata = { title: 'Manage Products — Admin' };

export default function AdminProductsPage() {
  const products = getProducts();
  return (
    <div>
      <h1>Manage Products</h1>
      <p className="subtitle">Add, edit, or remove products. Changes are committed to GitHub and go live on the next deploy.</p>
      <ManageProductsForm initialProducts={products} />
    </div>
  );
}
