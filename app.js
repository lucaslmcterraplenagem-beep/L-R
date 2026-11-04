let db;

const request = indexedDB.open('PresenteDB', 3);

request.onupgradeneeded = (e) => {
  db = e.target.result;
  if (!db.objectStoreNames.contains('midias')) {
    db.createObjectStore('midias', { keyPath: 'id', autoIncrement: true });
  }
  if (!db.objectStoreNames.contains('config')) {
    db.createObjectStore('config', { keyPath: 'chave' });
  }
};

request.onsuccess = (e) => {
  db = e.target.result;
  console.log("App conectado ao banco (v3)");
  
  if (db.objectStoreNames.contains('midias')) {
    carregarGaleria();
  } else {
    console.warn("Tabela 'midias' ainda não existe.");
  }
  
  carregarMusicas();
  iniciarContador();
};

request.onerror = (e) => {
  console.error("Erro ao abrir o banco:", e.target.error);
};

function carregarGaleria() {
  if (!db) return;
  
  const transaction = db.transaction(['midias'], 'readonly');
  const store = transaction.objectStore('midias');
  const req = store.getAll();

  req.onsuccess = (e) => {
    const midias = e.target.result;
    const galeriaDiv = document.getElementById('galeria');
    if (!galeriaDiv) return; // Proteção caso a div não exista

    galeriaDiv.innerHTML = '';

    midias.forEach((midia) => {
      const figure = document.createElement('figure');
      figure.className = 'card-midia';
      const url = URL.createObjectURL(midia.arquivo);

      if (midia.tipo === 'foto') {
        const img = document.createElement('img');
        img.src = url;
        figure.appendChild(img);
      } else {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        figure.appendChild(video);
      }

      const caption = document.createElement('p');
      caption.textContent = midia.legenda || 'Nossa memória 💕';
      figure.appendChild(caption);
      galeriaDiv.appendChild(figure);
    });
  };
}

function carregarMusicas() {
  const links = JSON.parse(localStorage.getItem('musicasYoutube') || '[]');
  const container = document.getElementById('musicas');
  if (!container) return;

  container.innerHTML = '';

  links.forEach((link) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
    const match = link.match(regex);
    if (!match) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'youtube-wrapper';
    wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${match[1]}" allowfullscreen></iframe>`;
    container.appendChild(wrapper);
  });
}

function iniciarContador() {
  const dataInicio = new Date('2024-09-04T00:00:00'); // Data de vocês
  
  function atualizar() {
    const hoje = new Date();
    const diffMs = hoje - dataInicio;
    const dias = Math.floor(diffMs / 86400000);
    const elDias = document.getElementById('dias');
    if (elDias) elDias.textContent = dias;
  }
  
  atualizar();
  setInterval(atualizar, 60000);
}
