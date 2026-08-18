// ===== Site Config (Client-Safe) =====
// Default values used as fallback. Actual values come from data/settings.json (server-side)
// This file has NO Node.js imports — it's safe to use in client components.

export const siteConfig = {
  name: 'Kuphanda Furniture',
  tagline: 'Your Imagination, Our Creativity',
  description: 'The home of best quality furniture pieces specializing in Office furniture, Mid-century furniture. Custom-made in Lilongwe, Malawi.',
  location: 'Likuni, Lilongwe, Malawi',
  whatsapp: '265885644306',
  phone: '+265 885 644 306',
  phone2: '+265 998 757 095',
  email: 'kuphandafurniture@gmail.com',
  address: 'Matope House Complex, Shops 3 & 4, Likuni, Lilongwe',
  hours: 'Mon-Sat: 7:30 AM - 5:30 PM',
  facebook: 'https://www.facebook.com/kuphandafurniture',
  instagram: '',
};

export function whatsappLink(message, whatsapp) {
  const num = whatsapp || siteConfig.whatsapp;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${num}?text=${encoded}`;
}
