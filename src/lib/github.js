// GitHub API integration for content management (headless CMS approach)
// Uses GitHub as the database — commits to the repo trigger Vercel rebuilds

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
export const GITHUB_OWNER = process.env.GITHUB_OWNER || 'geniuspulse';
export const GITHUB_REPO = process.env.GITHUB_REPO || 'kuphanda-furniture';
export const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';

const API_BASE = 'https://api.github.com';

export async function githubFetch(endpoint, options = {}) {
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

// ===== Blog Posts =====
export async function createPost(slug, frontmatter, content) {
  const filePath = `content/blog/${slug}.md`;
  const fileContent = `---\n${serializeFrontmatter(frontmatter)}---\n${content}`;
  
  return await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Create blog post: ${frontmatter.title}`,
      content: Buffer.from(fileContent).toString('base64'),
      branch: GITHUB_BRANCH,
    }),
  });
}

export async function updatePost(slug, frontmatter, content, oldSlug) {
  const filePath = `content/blog/${slug}.md`;
  const fileContent = `---\n${serializeFrontmatter(frontmatter)}---\n${content}`;
  
  // Get current file SHA
  let sha = null;
  try {
    const existing = await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`);
    sha = existing.sha;
  } catch {
    // File doesn't exist yet
  }
  
  // If slug changed, delete old file
  if (oldSlug && oldSlug !== slug) {
    const oldPath = `content/blog/${oldSlug}.md`;
    try {
      const oldFile = await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${oldPath}?ref=${GITHUB_BRANCH}`);
      await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${oldPath}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Delete old blog post: ${oldSlug}`,
          sha: oldFile.sha,
          branch: GITHUB_BRANCH,
        }),
      });
    } catch {}
  }
  
  return await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Update blog post: ${frontmatter.title}`,
      content: Buffer.from(fileContent).toString('base64'),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
}

export async function deletePost(slug) {
  const filePath = `content/blog/${slug}.md`;
  const existing = await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`);
  
  return await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Delete blog post: ${slug}`,
      sha: existing.sha,
      branch: GITHUB_BRANCH,
    }),
  });
}

// ===== Products =====
export async function updateProducts(products) {
  const filePath = 'data/products.json';
  const content = JSON.stringify(products, null, 2);
  
  let sha = null;
  try {
    const existing = await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`);
    sha = existing.sha;
  } catch {}
  
  return await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Update products catalog',
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
}

function serializeFrontmatter(fm) {
  let result = '';
  for (const [key, value] of Object.entries(fm)) {
    if (value !== null && value !== undefined) {
      result += `${key}: ${value}\n`;
    }
  }
  return result;
}

// ===== Settings =====
export async function updateSettings(settings) {
  const filePath = 'data/settings.json';
  const content = JSON.stringify(settings, null, 2);
  
  let sha = null;
  try {
    const existing = await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`);
    sha = existing.sha;
  } catch {}
  
  return await githubFetch(`/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Update site settings',
      content: Buffer.from(content).toString('base64'),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
}
