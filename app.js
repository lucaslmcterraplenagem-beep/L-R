let db;

// Conecta ao banco de dados (o mesmo que o admin.js criou)
const request = indexedDB.open('PresenteDB', 1);

request.onsuccess = (e) => {
  db = e.target.result;
  carregarGaleria();
  carregarMusicas();
  iniciarContador();
};

// Puxa as fotos e vídeos
function carregarGaleria() {
  const transaction = db.transaction(['midias'], 'readonly');
  const store = transaction.objectStore('midias');
  const req = store.getAll();

  req.onsuccess = (e) => {
    const midias = e.target.result;
    const galeriaDiv = document.getElementById('galeria');
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

// Puxa as músicas do YouTube
function carregarMusicas() {
  const links = JSON.parse(localStorage.getItem('musicasYoutube') || '[]');
  const container = document.getElementById('musicas');
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

// Contador de dias (04/09/2024)
function iniciarContador() {
  const dataInicio = new Date('2024-09-04T00:00:00'); // ALTERE AQUI SE PRECISAR
  
  function atualizar() {
    const hoje = new Date();
    const diffMs = hoje - dataInicio;
    const dias = Math.floor(diffMs / 86400000);
    document.getElementById('dias').textContent = dias;
  }
  
  atualizar();
  setInterval(atualizar, 60000); // Atualiza a cada minuto
}
