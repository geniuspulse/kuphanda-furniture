// Order management via GitHub API (same pattern as products)
// Orders are stored in data/orders.json

import fs from 'fs';
import path from 'path';
import { getSettings } from './settings';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'geniuspulse';
const GITHUB_REPO = process.env.GITHUB_REPO || 'kuphanda-furniture';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const API_BASE = 'https://api.github.com';

const ordersPath = path.join(process.cwd(), 'data', 'orders.json');

// Read orders from local file (for display in admin / fallback)
export function getOrdersLocal() {
  try {
    if (fs.existsSync(ordersPath)) {
      const raw = fs.readFileSync(ordersPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

// Fetch orders from GitHub API (authoritative source on serverless)
async function getOrdersFromGitHub() {
  if (!GITHUB_TOKEN) return null;
  try {
    const res = await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/orders.json?ref=${GITHUB_BRANCH}`);
    const content = Buffer.from(res.content, 'base64').toString('utf-8');
    return { orders: JSON.parse(content), sha: res.sha };
  } catch (err) {
    // File may not exist yet
    return { orders: [], sha: null };
  }
}

// Get orders — tries GitHub first, falls back to local
export async function getOrders() {
  if (GITHUB_TOKEN) {
    const result = await getOrdersFromGitHub();
    if (result) return result.orders;
  }
  return getOrdersLocal();
}

// Generate order ID
export function generateOrderId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `ORD-${year}${month}${day}-${random}`;
}

async function githubFetch(endpoint, options = {}) {
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${error}`);
  }
  return res.json();
}

export async function createOrder(orderData) {
  const orderId = generateOrderId();
  const order = {
    id: orderId,
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (GITHUB_TOKEN) {
    // CRITICAL: Fetch current orders from GitHub (not local file) to avoid overwriting
    const { orders: currentOrders, sha } = await getOrdersFromGitHub();
    const updatedOrders = [...(currentOrders || []), order];
    const content = JSON.stringify(updatedOrders, null, 2);

    await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/orders.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `New order: ${orderId}`,
        content: Buffer.from(content).toString('base64'),
        branch: GITHUB_BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
  } else {
    // Fallback: write to local file (dev only)
    const currentOrders = getOrdersLocal();
    const updatedOrders = [...currentOrders, order];
    fs.writeFileSync(ordersPath, JSON.stringify(updatedOrders, null, 2));
  }

  return order;
}

export async function updateOrderStatus(orderId, status) {
  if (GITHUB_TOKEN) {
    // Fetch from GitHub to get the latest orders (not stale local copy)
    const { orders: currentOrders, sha } = await getOrdersFromGitHub();
    const updatedOrders = (currentOrders || []).map(o =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    const content = JSON.stringify(updatedOrders, null, 2);

    await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/data/orders.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Update order ${orderId} status: ${status}`,
        content: Buffer.from(content).toString('base64'),
        branch: GITHUB_BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });
  } else {
    const currentOrders = getOrdersLocal();
    const updatedOrders = currentOrders.map(o =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );
    fs.writeFileSync(ordersPath, JSON.stringify(updatedOrders, null, 2));
  }
}

// Build WhatsApp order message — rich cart summary with clickable product links
export function buildWhatsAppOrderMessage(order) {
  const settings = getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kuphanda-furniture.vercel.app';

  let msg = `*NEW ORDER - ${order.id}*\n`;
  msg += `----------------------------------\n\n`;

  msg += `*ORDER SUMMARY*\n`;
  (order.items || []).forEach((item, i) => {
    const unitPrice = item.price ? `MWK ${Number(item.price).toLocaleString()}` : 'Price on request';
    const lineTotal = item.price ? `MWK ${(item.price * (item.quantity || 1)).toLocaleString()}` : 'TBD';
    msg += `\n${i + 1}. *${item.name || 'Unknown product'}*\n`;
    if (item.selectedVariations && Object.keys(item.selectedVariations).length > 0) {
      Object.entries(item.selectedVariations).forEach(([k, v]) => {
        msg += `   - ${k}: ${v}\n`;
      });
    }
    msg += `   Qty: ${item.quantity} x ${unitPrice} = ${lineTotal}\n`;
    if (item.id) {
      msg += `   Link: ${siteUrl}/products/${item.id}\n`;
    }
  });

  msg += `\n----------------------------------\n`;
  if (order.total > 0) {
    msg += `*TOTAL: MWK ${Number(order.total).toLocaleString()}*\n`;
    msg += `Delivery: FREE (Lilongwe)\n`;
  } else {
    msg += `*TOTAL: Price on request*\n`;
  }
  msg += `----------------------------------\n\n`;

  msg += `*CUSTOMER*\n`;
  msg += `Name: ${order.customer?.name || 'Not provided'}\n`;
  msg += `Phone: ${order.customer?.phone || 'Not provided'}\n`;
  if (order.customer?.email) msg += `Email: ${order.customer.email}\n`;
  if (order.customer?.address) msg += `Address: ${order.customer.address}\n`;

  msg += `\n*DELIVERY*\n`;
  msg += `Zone: ${order.delivery?.zone || 'Lilongwe'}\n`;
  if (order.delivery.preferredDate) {
    const d = new Date(order.delivery.preferredDate);
    msg += `Date: ${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n`;
  }
  if (order.delivery.notes) msg += `Notes: ${order.delivery.notes}\n`;

  msg += `\n----------------------------------\n`;
  msg += `Please confirm this order and arrange delivery. Thank you!`;

  return msg;
}
