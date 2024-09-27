import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DesignacaoList.css';

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
    <div className="designacao-list">
      <h1>Lista de Designações</h1>
      <table className="designacao-table">
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
            <React.Fragment key={designacao.id}>
              <tr onClick={() => toggleExpand(designacao.id)}>
                <td>
                  <button className="expand-button">
                    {expandedId === designacao.id ? '-' : '+'}
                  </button> {designacao.id}
                </td>
                <td>{designacao.designacao}</td>
                <td>{designacao.nomeCidade}</td>
                <td className={designacao.status === 'Ativo' ? 'status-active' : 'status-inactive'}>
                  {designacao.status}
                </td>
              </tr>
              {expandedId === designacao.id && (
                <tr className="expanded-row">
                  <td colSpan="4">
                    <div className="details">
                      <div className="column">
                      <p><strong>DESIGNACAO:</strong> {designacao.designacao}</p>
                      <p><strong>CIDADE:</strong> {designacao.nomeCidade}</p>
                        <p><strong>IP WAN:</strong> {designacao.ipWan}</p>
                        <p><strong>IP:</strong> {designacao.circuitIp}</p>
                        
                      </div>
                      <div className="column">
                      
                        <p><strong>CVLAN:</strong> {designacao.cvlan}</p>
                        <p><strong>SVLAN:</strong> {designacao.svlan}</p>
                      </div>
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