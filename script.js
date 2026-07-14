function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function stripMarkdown(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')   // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links
    .replace(/[#*_`>]/g, '')                 // formatting chars
    .replace(/\s+/g, ' ')
    .trim();
}

function snippet(body, length = 140) {
  const firstParagraph = body.split(/\n\s*\n/)[0] || '';
  const clean = stripMarkdown(firstParagraph);
  return clean.length > length ? clean.slice(0, length).trim() + '…' : clean;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

let allPosts = [];

function renderList(posts) {
  const container = document.getElementById('entries');

  if (posts.length === 0) {
    container.innerHTML = '<p class="empty-state">No entries found.</p>';
    return;
  }

  container.innerHTML = posts.map(post => `
    <a class="entry-card" href="post.html?slug=${encodeURIComponent(slugify(post.title))}">
      <span class="entry-stamp">${escapeHTML(post.date)}</span>
      <h2 class="entry-title">${escapeHTML(post.title)}</h2>
      <p class="entry-snippet">${escapeHTML(snippet(post.body))}</p>
    </a>
  `).join('');
}

async function init() {
  const container = document.getElementById('entries');
  try {
    const res = await fetch('posts.json', { cache: 'no-store' });
    const data = await res.json();
    allPosts = data.posts || [];
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Couldn\'t load posts.</p>';
    return;
  }

  renderList(allPosts);

  const searchInput = document.getElementById('search');
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) {
      renderList(allPosts);
      return;
    }
    const filtered = allPosts.filter(post =>
      post.title.toLowerCase().includes(q) || post.body.toLowerCase().includes(q)
    );
    renderList(filtered);
  });
}

init();
