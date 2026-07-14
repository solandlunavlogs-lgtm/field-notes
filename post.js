function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function init() {
  const container = document.getElementById('post-content');
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  let posts = [];
  try {
    const res = await fetch('posts.json', { cache: 'no-store' });
    const data = await res.json();
    posts = data.posts || [];
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Couldn\'t load this entry.</p>';
    return;
  }

  const post = posts.find(p => slugify(p.title) === slug);

  if (!post) {
    container.innerHTML = '<p class="empty-state">Entry not found. <a href="index.html">Go back</a>.</p>';
    return;
  }

  document.title = post.title + ' — Field Notes';

  const imageHTML = post.image
    ? `<img class="post-hero-image" src="${escapeHTML(post.image)}" alt="">`
    : '';

  const bodyHTML = window.marked ? marked.parse(post.body) : `<p>${escapeHTML(post.body)}</p>`;

  container.innerHTML = `
    <span class="entry-stamp">${escapeHTML(post.date)}</span>
    <h1 class="post-title">${escapeHTML(post.title)}</h1>
    ${imageHTML}
    <div class="post-body">${bodyHTML}</div>
  `;
}

init();
