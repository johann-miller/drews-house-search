const grid = document.getElementById('card-grid');

let houses = [];

function ratingClass(rating) {
  return rating === '+' ? 'r-pro' : 'r-con';
}


function scoreClass(score) {
  if (score >= 8) return 's-high';
  if (score >= 6) return 's-mid';
  if (score >= 4) return 's-low';
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
    houses = data;
    houses.forEach(h => grid.appendChild(buildCard(h)));
  });
