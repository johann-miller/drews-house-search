const grid = document.getElementById('card-grid');

let houses = [];

function ratingClass(rating) {
  return rating === '+' ? 'r-pro' : 'r-con';
}


function scoreClass(score) {
  const n = parseFloat(score);
  if (isNaN(n)) return 's-unknown';
  if (n >= 8) return 's-high';
  if (n >= 6) return 's-mid';
  if (n >= 4) return 's-low';
  return 's-bad';
}

function buildCard(house) {
  const a = document.createElement('a');
  a.className = 'card';
  a.href = house.url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';

  const thumbHtml = house.thumbnail
    ? `<img src="${house.thumbnail}" alt="${house.address}">`
    : `<div class="no-image">No photo</div>`;

  const metricsHtml = [...house.metrics]
    .sort((a, b) => a.index - b.index)
    .map(m => `
      <div class="metric ${ratingClass(m.rating)}">
        <span class="metric-label">${m.label}</span>
        <span class="metric-value">${m.value}</span>
      </div>`)
    .join('');

  a.innerHTML = `
    <div class="card-thumbnail">
      ${thumbHtml}
      <span class="score-badge ${scoreClass(house.score)}">${house.score}/10</span>
      <span class="open-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </span>
    </div>
    <div class="card-body">
      <div class="card-address">${house.address}</div>
      <div class="card-price">$${house.price}k</div>
      <div class="card-description">${house.description}</div>
      <div class="card-metrics">${metricsHtml}</div>
    </div>`;

  return a;
}

fetch('houses.json')
  .then(r => r.json())
  .then(data => {
    houses = data.sort((a, b) => {
      const sa = parseFloat(a.score);
      const sb = parseFloat(b.score);
      const aValid = !isNaN(sa);
      const bValid = !isNaN(sb);
      if (aValid && bValid) return sb - sa;
      if (aValid) return -1;
      if (bValid) return 1;
      return 0;
    });
    houses.forEach(h => grid.appendChild(buildCard(h)));
  });
