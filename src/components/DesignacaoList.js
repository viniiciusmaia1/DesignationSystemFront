import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DesignacaoList = () => {
  const [designacoes, setDesignacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesignacoes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/designacoes');
        setDesignacoes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro detalhado:', err);
        setError('Erro ao carregar designações: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchDesignacoes();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Lista de Designações</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Designação</th>
            <th>Cidade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {designacoes.map(designacao => (
            <tr key={designacao.id}>
              <td>{designacao.id}</td>
              <td>{designacao.designacao}</td>
              <td>{designacao.cidade?.nome || 'N/A'}</td>
              <td>{designacao.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignacaoList;