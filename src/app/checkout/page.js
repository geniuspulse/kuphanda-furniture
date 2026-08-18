import { getSettings } from '@/lib/settings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CheckoutForm from '@/components/CheckoutForm';

export default async function CheckoutPage() {
  const settings = getSettings();

  return (
      <>
        <Navbar settings={settings} />
      
      <main className="checkout-page" style={{ paddingTop: '140px', minHeight: '80vh', paddingBottom: '80px' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <span className="section-eyebrow">Secure Order</span>
            <h1 className="section-title">Checkout</h1>
            <p className="section-subtitle">Complete your order</p>
          </div>
          
          <CheckoutForm settings={settings} />
        </div>
      </main>

      <Footer settings={settings} />
      <WhatsAppFloat whatsapp={settings.whatsapp} businessName={settings.name} />
    </>

  );
}
