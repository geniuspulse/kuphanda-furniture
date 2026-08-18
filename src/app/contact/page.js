// Server component — reads settings on the server and passes to client
import { getSettings } from '@/lib/settings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ContactClient from '@/components/ContactClient';

export const metadata = {
  title: 'Contact | Kuphanda Furniture',
  description: 'Get in touch with Kuphanda Furniture. Order via WhatsApp or call us at our Likuni showroom.',
};

export default function ContactPage() {
  const settings = getSettings();
  return (
      <>
        <Navbar />
      <ContactClient settings={settings} />
      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} businessName={settings.name} />
    </>

  );
}
