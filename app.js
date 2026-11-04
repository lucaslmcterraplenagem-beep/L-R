// app.js (versão corrigida)
let db;

// Conecta ao banco na VERSÃO 2 (igual ao admin.js)
const request = indexedDB.open('PresenteDB', 2);

request.onsuccess = (e) => {
  db = e.target.result;
  console.log("App conectado ao banco (v2)");

  // Força o fechamento da conexão antiga se a versão do banco mudar
  db.onversionchange = () => {
    db.close();
    alert("O banco de dados foi atualizado. Por favor, recarregue a página.");
  };

  carregarGaleria();
  carregarMusicas();
  iniciarContador();
};

request.onerror = (e) => {
  console.error("Erro ao abrir o banco:", e.target.error);
  // Se der erro, ainda tenta iniciar o contador
  iniciarContador();
};

// Puxa as fotos e vídeos
function carregarGaleria() {
  if (!db) return; // Segurança extra
  
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
  // Se a data for 04/09/2024, os dias serão positivos. 
  // Se você quis dizer 04/09/2026, o valor será negativo até a data chegar.
  const dataInicio = new Date('2024-09-04T00:00:00'); 
  
  function atualizar() {
    const hoje = new Date();
    const diffMs = hoje - dataInicio;
    const dias = Math.floor(diffMs / 86400000);
    document.getElementById('dias').textContent = dias;
  }
  
  atualizar();
  setInterval(atualizar, 60000);
}
