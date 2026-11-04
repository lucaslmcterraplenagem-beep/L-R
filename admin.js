let db;

// Abre o banco na VERSÃO 3 (versão mais alta força o upgrade)
const request = indexedDB.open('PresenteDB', 3);

request.onupgradeneeded = (e) => {
  db = e.target.result;
  console.log('onupgradeneeded disparou! Criando tabelas...');

  // Cria a tabela 'midias' se não existir
  if (!db.objectStoreNames.contains('midias')) {
    db.createObjectStore('midias', { keyPath: 'id', autoIncrement: true });
    console.log('Tabela "midias" criada.');
  }

  // Cria a tabela 'config' se não existir
  if (!db.objectStoreNames.contains('config')) {
    db.createObjectStore('config', { keyPath: 'chave' });
    console.log('Tabela "config" criada.');
  }
};

request.onsuccess = (e) => {
  db = e.target.result;
  console.log('Banco de dados pronto (v3)');
};

request.onerror = (e) => {
  console.error('Erro ao abrir o banco:', e.target.error);
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
    if (typeof carregarGaleria === 'function') carregarGaleria();
  };
  transaction.onerror = (e) => {
    console.error("Erro ao salvar:", e.target.error);
    alert("Erro ao salvar a mídia.");
  };
}
