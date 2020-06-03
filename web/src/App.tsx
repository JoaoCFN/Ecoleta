import React from 'react';
import './App.css';

import Home from './pages/Home';

function App() {
  // Estado: são infomações mantidas pelo próprio componente
  // Imutabilidade: significa que eu nunca vou conseguir alterar um estado diretamente. Sempre precisaremos de um intermediário.
  return (
    <div>
      <Home />
    </div>
  );
}

export default App;
