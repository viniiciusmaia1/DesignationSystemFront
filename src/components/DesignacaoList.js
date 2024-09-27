import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DesignacaoList = () => {
  const [designacoes, setDesignacoes] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchDesignacoes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/designacoes');
        setDesignacoes(response.data);
      } catch (err) {
        console.error('Erro ao carregar designações:', err);
      }
    };

    fetchDesignacoes();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      <h1>Lista de Designações</h1>
      <table className="designacao-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Designação</th>
            <th>Cidade</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {designacoes.map(designacao => (
            <React.Fragment key={designacao.id}>
              <tr>
                <td>{designacao.id}</td>
                <td>{designacao.designacao}</td>
                <td>{designacao.nomeCidade}</td>
                <td>{designacao.status}</td>
                <td>
                  <button onClick={() => toggleExpand(designacao.id)}>
                    {expandedId === designacao.id ? '-' : '+'}
                  </button>
                </td>
              </tr>
              {expandedId === designacao.id && (
                <tr className="expanded-row">
                  <td colSpan="5">
                    <div className="details">
                      <p><strong>IP WAN:</strong> {designacao.ipWan || 'N/A'}</p>
                      <p><strong>IP:</strong> {designacao.circuitIp || 'N/A'}</p>
                  
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignacaoList;