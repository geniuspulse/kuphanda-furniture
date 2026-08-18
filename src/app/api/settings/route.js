import { NextResponse } from 'next/server';
import { updateSettings } from '@/lib/github';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import { getSettings } from '@/lib/settings';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { settings } = await req.json();
    await updateSettings(settings);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
