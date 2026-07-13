async function renderPosts() {
  const container = document.getElementById('entries');

  let posts = [];
  try {
    const res = await fetch('posts.json', { cache: 'no-store' });
    const data = await res.json();
    posts = data.posts || [];
  } catch (err) {
    container.innerHTML = '<p class="empty-state">Couldn\'t load posts.</p>';
    return;
  }

  if (posts.length === 0) {
    container.innerHTML = '<p class="empty-state">No entries yet.</p>';
    return;
  }

  container.innerHTML = posts.map(post => `
    <article class="entry">
      <span class="entry-stamp">${escapeHTML(post.date)}</span>
      <h2 class="entry-title">${escapeHTML(post.title)}</h2>
      <div class="entry-body">
        ${post.body.split(/\n\s*\n/).map(paragraph => `<p>${escapeHTML(paragraph.trim())}</p>`).join('')}
      </div>
    </article>
  `).join('');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

renderPosts();
