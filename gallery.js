document.addEventListener('DOMContentLoaded', () => {
  // Determine page key from filename (e.g., real-estate)
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
  const galleryContainer = document.getElementById('gallery-' + page);
  if (!galleryContainer) return;

  fetch('/portfolio.json')
    .then(res => res.json())
    .then(data => {
      const photos = data[page] || [];
      renderGallery(photos, galleryContainer);
    })
    .catch(err => {
      galleryContainer.innerHTML = '<p>Unable to load gallery.</p>';
      console.error(err);
    });
});

function renderGallery(photos, container) {
  const count = photos.length;
  // No photos
  if (count === 0) {
    container.innerHTML = '<p>No images available.</p>';
    return;
  }

  // Feature layout for up to 4 photos
  if (count <= 4) {
    container.classList.add('feature-layout');
    photos.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.className = 'feature-img gold-glow';
      container.appendChild(img);
    });
    return;
  }

  // Grid layout for 5-15 photos
  if (count <= 15) {
    container.classList.add('masonry-grid');
    photos.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.className = 'grid-img';
      container.appendChild(img);
    });
    return;
  }

  // High-volume: lazy-load batches of 12
  let index = 0;
  const batchSize = 12;

  container.classList.add('masonry-grid');

  function loadBatch() {
    const slice = photos.slice(index, index + batchSize);
    slice.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.loading = 'lazy';
      img.className = 'grid-img';
      container.appendChild(img);
    });
    index += batchSize;
    // Add load more if more remain
    if (index < photos.length && !document.getElementById('load-more')) {
      const btn = document.createElement('button');
      btn.id = 'load-more';
      btn.textContent = 'Load More';
      btn.className = 'btn load-more-btn';
      btn.onclick = loadBatch;
      container.parentElement.appendChild(btn);
    }
  }

  loadBatch();
}
