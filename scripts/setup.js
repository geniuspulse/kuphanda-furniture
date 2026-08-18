#!/usr/bin/env node

/**
 * Furniture Store Template Setup Script
 * 
 * Run this after cloning the template to configure it for a new furniture store.
 * Usage: node scripts/setup.js
 * 
 * It will ask for business details, theme colors, and admin settings,
 * then update all config files automatically.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const projectRoot = path.resolve(__dirname, '..');

function ask(question, defaultValue) {
  return new Promise(resolve => {
    const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(prompt, answer => {
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [find, replace] of Object.entries(replacements)) {
    content = content.split(find).join(replace);
  }
  fs.writeFileSync(filePath, content);
}

async function main() {
  console.log('\n🪑  Furniture Store Template Setup');
  console.log('===================================\n');

  // Business Info
  console.log('📋 Business Information\n');
  const businessName = await ask('Business name', 'My Furniture Store');
  const tagline = await ask('Tagline', 'Quality Furniture, Affordable Prices');
  const description = await ask('Description', 'We make and supply quality, affordable & durable furniture.');
  const location = await ask('Location (city, country)', 'Lilongwe, Malawi');
  const whatsapp = await ask('WhatsApp number (country code + number, no +)', '265000000000');
  const phone = await ask('Phone number', '+265 000 000 000');
  const email = await ask('Email', 'info@example.com');
  const address = await ask('Address', location);
  const hours = await ask('Business hours', 'Mon-Sat: 8:00 AM - 5:00 PM');
  const facebook = await ask('Facebook URL', 'https://www.facebook.com/');
  const instagram = await ask('Instagram URL', 'https://www.instagram.com/');

  // Theme
  console.log('\n🎨 Theme Colors\n');
  const primaryColor = await ask('Primary color (hex)', '#6B4226');
  const primaryDark = await ask('Primary dark color (hex)', '#4A2C17');
  const accentColor = await ask('Accent color (hex)', '#D4A574');

  // Admin
  console.log('\n🔐 Admin Settings\n');
  const adminPassword = await ask('Admin password (press Enter for random)', '');
  const finalAdminPassword = adminPassword || crypto.randomBytes(12).toString('hex');

  // GitHub
  console.log('\n📦 GitHub Repository\n');
  const githubOwner = await ask('GitHub owner/username', 'myusername');
  const githubRepo = await ask('GitHub repo name', `${businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);

  // Agency
  console.log('\n🏢 Agency Credits\n');
  const agencyName = await ask('Agency name', 'My Agency');
  const agencyWebsite = await ask('Agency website', 'https://myagency.com');

  console.log('\n⚙️  Configuring...\n');

  // 1. Update template.config.json
  const configPath = path.join(projectRoot, 'template.config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  config.business = { name: businessName, tagline, description, location, whatsapp, phone, email, address, hours, facebook, instagram };
  config.theme.brown = primaryColor;
  config.theme.brownDark = primaryDark;
  config.theme.amber = accentColor;
  config.agency = { name: agencyName, website: agencyWebsite };
  config.github = { owner: githubOwner, repo: githubRepo, branch: 'main' };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  // 2. Update settings.json
  const settingsPath = path.join(projectRoot, 'data', 'settings.json');
  const settings = {
    whatsapp, phone, email, address, hours,
    facebook, instagram,
    name: businessName, tagline, description, location,
  };
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

  // 3. Update config.js (client-safe defaults)
  const configJsPath = path.join(projectRoot, 'src', 'lib', 'config.js');
  let configJs = fs.readFileSync(configJsPath, 'utf-8');
  configJs = configJs
    .replace(/name: '[^']*'/, `name: '${businessName}'`)
    .replace(/tagline: '[^']*'/, `tagline: '${tagline}'`)
    .replace(/description: '[^']*'/, `description: '${description}'`)
    .replace(/location: '[^']*'/, `location: '${location}'`)
    .replace(/whatsapp: '[0-9]+'/, `whatsapp: '${whatsapp}'`)
    .replace(/phone: '[^']*'/, `phone: '${phone}'`)
    .replace(/email: '[^']*'/, `email: '${email}'`)
    .replace(/address: '[^']*'/, `address: '${address}'`)
    .replace(/facebook: '[^']*'/, `facebook: '${facebook}'`)
    .replace(/instagram: '[^']*'/, `instagram: '${instagram}'`);
  fs.writeFileSync(configJsPath, configJs);

  // 4. Update CSS variables
  const cssPath = path.join(projectRoot, 'src', 'app', 'globals.css');
  updateFile(cssPath, {
    '--brown-dark: #4A2C17;': `--brown-dark: ${primaryDark};`,
    '--brown: #6B4226;': `--brown: ${primaryColor};`,
    '--amber: #D4A574;': `--amber: ${accentColor};`,
  });

  // 5. Update layout.js metadata
  const layoutPath = path.join(projectRoot, 'src', 'app', 'layout.js');
  updateFile(layoutPath, {
    'Akonzi Sofa Furniture': businessName,
  });

  // 6. Update Footer agency credit
  const footerPath = path.join(projectRoot, 'src', 'components', 'Footer.js');
  updateFile(footerPath, {
    'https://brandfletch.com': agencyWebsite,
    'Brandfletch Media': agencyName,
  });

  // 7. Update settings.js defaults
  const settingsJsPath = path.join(projectRoot, 'src', 'lib', 'settings.js');
  let settingsJs = fs.readFileSync(settingsJsPath, 'utf-8');
  settingsJs = settingsJs
    .replace(/whatsapp: '[0-9]+'/, `whatsapp: '${whatsapp}'`)
    .replace(/phone: '[^']*'/, `phone: '${phone}'`)
    .replace(/email: '[^']*'/, `email: '${email}'`)
    .replace(/address: '[^']*'/, `address: '${address}'`)
    .replace(/facebook: '[^']*'/, `facebook: '${facebook}'`)
    .replace(/instagram: '[^']*'/, `instagram: '${instagram}'`)
    .replace(/name: '[^']*'/, `name: '${businessName}'`)
    .replace(/tagline: '[^']*'/, `tagline: '${tagline}'`)
    .replace(/description: '[^']*'/, `description: '${description}'`)
    .replace(/location: '[^']*'/, `location: '${location}'`);
  fs.writeFileSync(settingsJsPath, settingsJs);

  // 8. Update github.js defaults
  const githubJsPath = path.join(projectRoot, 'src', 'lib', 'github.js');
  updateFile(githubJsPath, {
    "GITHUB_OWNER || 'geniuspulse'": `GITHUB_OWNER || '${githubOwner}'`,
    "GITHUB_REPO || 'akonzi-sofa-furniture'": `GITHUB_REPO || '${githubRepo}'`,
  });

  // 9. Update orders.js defaults
  const ordersJsPath = path.join(projectRoot, 'src', 'lib', 'orders.js');
  updateFile(ordersJsPath, {
    "GITHUB_OWNER || 'geniuspulse'": `GITHUB_OWNER || '${githubOwner}'`,
    "GITHUB_REPO || 'akonzi-sofa-furniture'": `GITHUB_REPO || '${githubRepo}'`,
  });

  // 10. Create .env.local with admin password
  const envPath = path.join(projectRoot, '.env.local');
  fs.writeFileSync(envPath, `ADMIN_PASSWORD=${finalAdminPassword}\nGITHUB_TOKEN=your_github_token_here\n`);

  // 11. Create .env.example
  const envExamplePath = path.join(projectRoot, '.env.example');
  fs.writeFileSync(envExamplePath,
    `# Admin panel password (JWT signing secret)\nADMIN_PASSWORD=change-this-to-a-secure-password\n\n# GitHub token for content/order management (needs repo scope)\nGITHUB_TOKEN=your_github_personal_access_token\n\n# GitHub repo config (optional — has defaults)\nGITHUB_OWNER=${githubOwner}\nGITHUB_REPO=${githubRepo}\nGITHUB_BRANCH=main\n`);

  console.log('\n✅ Setup complete!\n');
  console.log('📋 Summary:');
  console.log(`   Business: ${businessName}`);
  console.log(`   WhatsApp: ${whatsapp}`);
  console.log(`   Theme: ${primaryColor} / ${accentColor}`);
  console.log(`   GitHub: ${githubOwner}/${githubRepo}`);
  console.log(`   Admin password: ${finalAdminPassword}`);
  console.log('\n📝 Next steps:');
  console.log('   1. Replace the logo at public/images/akonzi-logo.png');
  console.log('   2. Add product images to public/images/');
  console.log('   3. Update data/products.json with your products');
  console.log('   4. Set GITHUB_TOKEN in .env.local or Vercel env vars');
  console.log('   5. npm install && npm run dev');
  console.log('   6. Deploy to Vercel — connect the GitHub repo for auto-deploys');
  console.log('');

  rl.close();
}

main().catch(err => {
  console.error('Setup failed:', err);
  rl.close();
  process.exit(1);
});
