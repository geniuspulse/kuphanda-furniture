// Site Settings — stored in data/settings.json
// Admin can update phone, email, WhatsApp via the admin panel
// All pages read from this file so one change updates the whole platform

import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

const defaultSettings = {
  // Contact
  whatsapp: '265985151742',
  phone: '+265 985 15 17 42',
  email: 'info@akonzifurniture.com',
  address: 'Lilongwe, Malawi',
  hours: 'Mon-Sat: 8:00 AM - 5:00 PM',
  // Social
  facebook: 'https://www.facebook.com/61588092507889/',
  instagram: 'https://www.instagram.com/akonzisofa/',
  // Business
  name: 'Kuphanda Furniture',
  tagline: 'Quality Starts Here!!!',
  description: 'We make and supply quality, affordable & durable furniture of your choice. Free delivery within Lilongwe.',
  location: 'Lilongwe, Malawi',
};

export function getSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      const raw = fs.readFileSync(settingsPath, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch {}
  return defaultSettings;
}

export function whatsappLink(message, whatsapp) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${whatsapp || defaultSettings.whatsapp}?text=${encoded}`;
}
