let db;

// Abre o banco na VERSÃO 3 (igual ao admin.js)
const request = indexedDB.open('PresenteDB', 3);

request.onsuccess = (e) => {
  db = e.target.result;
  console.log("App conectado ao banco (v3)");

  // Força o fechamento da conexão antiga se a versão mudar
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
  iniciarContador(); // Tenta iniciar o contador mesmo se o banco falhar
};

// (O restante do app.js permanece igual: carregarGaleria, carregarMusicas, iniciarContador)
