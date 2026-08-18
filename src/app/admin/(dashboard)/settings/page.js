import SettingsForm from '@/components/SettingsForm';

export const metadata = { title: 'Site Settings — Admin' };

export default function SettingsPage() {
  return (
    <div>
      <h1>Site Settings</h1>
      <p className="subtitle">
        Update contact info, social links, and business details here — changes go live across the whole website after the next deploy.
      </p>
      <SettingsForm />
    </div>
  );
}
