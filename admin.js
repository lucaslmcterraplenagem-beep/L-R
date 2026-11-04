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
