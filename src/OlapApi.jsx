import React, { useState } from 'react';

function OlapApi() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleQuery = async () => {
    try {
      const response = await fetch(`/api/tabular/query?daxQuery=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Failed to execute query');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Consulta DAX</h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe tu consulta DAX aquí"
      />
      <button onClick={handleQuery}>Ejecutar consulta</button>
      <div>
        <h2>Resultados:</h2>
        <pre>{JSON.stringify(results, null, 2)}</pre>
      </div>
    </div>
  );
}

export default OlapApi;
