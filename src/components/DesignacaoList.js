import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Collapse, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text } = Typography;

const DesignacaoList = () => {
  const [designacoes, setDesignacoes] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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

  const handleExpand = (expanded, record) => {
    setExpandedRowKeys(expanded ? [record.id] : []);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Designação',
      dataIndex: 'designacao',
      key: 'designacao',
    },
    {
      title: 'Cidade',
      dataIndex: 'nomeCidade',
      key: 'cidade',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Text type={status === 'Ativo' ? 'success' : 'danger'}>
          {status}
        </Text>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={designacoes}
      rowKey="id"
      expandable={{
        expandedRowRender: (record) => (
          <Collapse>
            <Panel header="Dados Cadastrais" key="1">
              <p><strong>Cidade:</strong> {record.nomeCidade}</p>
              {/* Adicione mais campos conforme necessário */}
            </Panel>
            <Panel header="Dados Técnicos" key="2">
              <p><strong>IP WAN:</strong> {record.ipWan}</p>
              <p><strong>IP:</strong> {record.circuitIp}</p>
              {/* Adicione mais campos conforme necessário */}
            </Panel>
          </Collapse>
        ),
        onExpand: handleExpand,
        expandedRowKeys,
        expandIcon: ({ expanded, onExpand, record }) =>
          <Button
            icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
            shape="circle"
            onClick={(e) => onExpand(record, e)}
          />
      }}
    />
  );
};

export default DesignacaoList;