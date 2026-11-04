// admin.js (versão corrigida)
let db;

// Abre ou cria o banco de dados na VERSÃO 2
const request = indexedDB.open('PresenteDB', 2); 

request.onupgradeneeded = (e) => {
  db = e.target.result;
  
  // Cria a tabela 'midias' se ela não existir
  if (!db.objectStoreNames.contains('midias')) {
    db.createObjectStore('midias', { keyPath: 'id', autoIncrement: true });
  }
  
  // Cria a tabela 'config' se ela não existir
  if (!db.objectStoreNames.contains('config')) {
    db.createObjectStore('config', { keyPath: 'chave' });
  }
};

request.onsuccess = (e) => {
  db = e.target.result;
  console.log('Banco de dados pronto (v2)');
};

// Função para salvar um arquivo (foto ou vídeo)
function salvarMidia(arquivo, tipo, legenda) {
  if (!db) {
    alert("Banco de dados ainda não carregou. Tente novamente.");
    return;
  }
  const transaction = db.transaction(['midias'], 'readwrite');
  const store = transaction.objectStore('midias');
  const midia = {
    arquivo: arquivo,
    tipo: tipo,
    legenda: legenda,
    data: new Date().toISOString()
  };
  store.add(midia);
  transaction.oncomplete = () => {
    alert('Mídia salva com sucesso!');
    // Se estiver na página admin, recarrega a lista (opcional)
    if (typeof carregarGaleria === 'function') carregarGaleria();
  };
  transaction.onerror = (e) => {
    console.error("Erro ao salvar:", e.target.error);
    alert("Erro ao salvar a mídia.");
  };
}
