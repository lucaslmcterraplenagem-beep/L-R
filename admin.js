// admin.js (trecho principal)
let db;

// Abre ou cria o banco de dados
const request = indexedDB.open('PresenteDB', 1);

request.onupgradeneeded = (e) => {
  db = e.target.result;
  // Armazena as fotos e vídeos
  if (!db.objectStoreNames.contains('midias')) {
    db.createObjectStore('midias', { keyPath: 'id', autoIncrement: true });
  }
  // Armazena os metadados (links do YouTube, datas do calendário)
  if (!db.objectStoreNames.contains('config')) {
    db.createObjectStore('config', { keyPath: 'chave' });
  }
};

request.onsuccess = (e) => {
  db = e.target.result;
  console.log('Banco de dados pronto');
};

// Função para salvar um arquivo (foto ou vídeo)
function salvarMidia(arquivo, tipo, legenda) {
  const transaction = db.transaction(['midias'], 'readwrite');
  const store = transaction.objectStore('midias');
  const midia = {
    arquivo: arquivo, // O objeto File/Blob
    tipo: tipo,       // 'foto' ou 'video'
    legenda: legenda,
    data: new Date().toISOString()
  };
  store.add(midia);
  transaction.oncomplete = () => {
    alert('Mídia salva com sucesso!');
    carregarGaleria(); // Atualiza a lista na tela
  };
}
// Exemplo de link: https://www.youtube.com/watch?v=ID_DO_VIDEO
function extrairIdYoutube(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function carregarMusicas() {
  const links = JSON.parse(localStorage.getItem('musicasYoutube') || '[]');
  const container = document.getElementById('musicas');
  container.innerHTML = '';

  links.forEach((link) => {
    const id = extrairIdYoutube(link);
    if (!id) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'youtube-wrapper'; // CSS com aspect-ratio 16/9
    wrapper.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${id}"
              title="Música do casal"
              frameborder="0"
              allowfullscreen>
      </iframe>
    `;
    container.appendChild(wrapper);
  });
}
.youtube-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 */
  margin-bottom: 16px;
  border-radius: 20px;
  overflow: hidden;
}
.youtube-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
