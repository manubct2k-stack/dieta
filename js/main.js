
/* ── CATEGORY FILTER ── */
const catBtns  = document.querySelectorAll('.cat-btn');
const storeCards = document.querySelectorAll('.store-card');
const noStores = document.getElementById('noStores');

catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.cat;
    let visibleCount = 0;

    storeCards.forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      card.classList.toggle('hidden', !match);
      if (match) visibleCount++;
    });

    if (noStores) noStores.classList.toggle('visible', visibleCount === 0);
  });
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in-view'), i * 90);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── MAP DIRECTIONS ── */
function openDirections() {
  const address = document.getElementById('addressInput').value.trim();
  const dest = 'Centro+Comercial+Massaka,+Maputo,+Mozambique';
  const url = address
    ? `http://googleusercontent.com/maps.google.com/?saddr=${encodeURIComponent(address)}&daddr=${encodeURIComponent(dest)}`
    : `http://googleusercontent.com/maps.google.com/?daddr=${encodeURIComponent(dest)}`;
  window.open(url, '_blank');
}

const addressInput = document.getElementById('addressInput');
if (addressInput) {
  addressInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') openDirections();
  });
}

/* ── STORE STATUS (OPEN/CLOSED) VERIFICATION ── */
function updateStoreStatus() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;

  storeCards.forEach(card => {
    const openTime = card.dataset.open;
    const closeTime = card.dataset.close;
    const badge = card.querySelector('.status-indicator');

    if (openTime && closeTime && badge) {
      // Converte horários (ex: "09:00") para minutos totais para facilitar a comparação
      const [openH, openM] = openTime.split(':').map(Number);
      const [closeH, closeM] = closeTime.split(':').map(Number);
      
      const openTotalMinutes = openH * 60 + openM;
      let closeTotalMinutes = closeH * 60 + closeM;
      
      // Lida com lojas que fecham depois da meia-noite (ex: abre 20:00, fecha 02:00)
      if (closeTotalMinutes <= openTotalMinutes) {
        closeTotalMinutes += 24 * 60;
      }
      
      let adjustedCurrentMinutes = currentTotalMinutes;
      if (currentTotalMinutes < openTotalMinutes && closeTotalMinutes > 24 * 60) {
         adjustedCurrentMinutes += 24 * 60;
      }

      // Verifica se a hora atual está dentro do intervalo de funcionamento
      if (adjustedCurrentMinutes >= openTotalMinutes && adjustedCurrentMinutes < closeTotalMinutes) {
        badge.textContent = '● Aberto';
        badge.classList.remove('badge-closed');
        badge.classList.add('badge-open');
      } else {
        badge.textContent = '● Fechado';
        badge.classList.remove('badge-open');
        badge.classList.add('badge-closed');
      }
    }
  });
}

// Corre a verificação imediatamente ao carregar a página
updateStoreStatus();

// Atualiza o estado automaticamente a cada 1 minuto (60.000 milissegundos)
setInterval(updateStoreStatus, 60000);
