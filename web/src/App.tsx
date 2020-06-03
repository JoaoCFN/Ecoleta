import React from 'react';
import './App.css';

import Routes from "./routes";

function App() {
  // Estado: são infomações mantidas pelo próprio componente
  // Imutabilidade: significa que eu nunca vou conseguir alterar um estado diretamente. Sempre precisaremos de um intermediário.
  return (
    <div>
      <Routes />
    </div>
  );
}

export default App;
