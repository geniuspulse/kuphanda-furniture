import './globals.css';
import { siteConfig } from '@/lib/data';
import { CartProvider } from '@/components/CartProvider';

export const metadata = {
  metadataBase: new URL('https://kuphanda-furniture.vercel.app'),
  title: 'Kuphanda Furniture | Custom-Made Office & Home Furniture in Lilongwe, Malawi',
  description: 'Kuphanda Furniture — We custom-make high quality office furniture, boardroom tables, office cabinets, hardwood doors, beds, wardrobes, school desks & more. Made in Malawi. Visit our showroom in Likuni, Lilongwe.',
  keywords: 'office furniture, Lilongwe, Malawi, boardroom table, office desk, hardwood doors, bed frame, wardrobe, school desk, church bench, Kuphanda, custom furniture, made in Malawi',
  openGraph: {
    title: 'Kuphanda Furniture | Custom-Made Furniture in Lilongwe, Malawi',
    description: 'We custom-make high quality office and home furniture. Made in Malawi. Visit our showroom in Likuni, Lilongwe.',
    images: ['/images/executive-desk.png'],
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%235C3D2A'/><text y='.9em' x='50%' text-anchor='middle' font-size='65' fill='%23C89060' font-family='serif' font-weight='bold'>K</text></svg>" />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
