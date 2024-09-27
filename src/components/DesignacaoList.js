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
        <Text type={status === 'INSTALADO' ? 'success' : 'danger'}>
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
              <p><strong>ID:</strong> {record.id}</p>
              <p><strong>Designação:</strong> {record.designacao}</p>
              <p><strong>Status:</strong> {record.status}</p>
              <p><strong>Cidade:</strong> {record.nomeCidade}</p>
            </Panel>
            <Panel header="Dados Técnicos" key="2">
              <p><strong>CVLAN:</strong> {record.cvlan}</p>
              <p><strong>SVLAN:</strong> {record.svlan}</p>
              <p><strong>IP WAN:</strong> {record.ipWan}</p>
            </Panel>
            <Panel header="Datas" key="3">
              <p><strong>Data de Criação:</strong> {record.dataCriacao}</p>
              <p><strong>Última Modificação:</strong> {record.dataUltimaModificacao}</p>
              <p><strong>Data de envio da RB:</strong> {record.dataEnvioRb}</p>
              <p><strong>Agendamento:</strong> {record.dataAgendamento}</p>
              <p><strong>Agendado:</strong> {record.dataAgendado}</p>
              <p><strong>Instalação:</strong> {record.dataInstalacao}</p>
              <p><strong>Homologação:</strong> {record.dataHomologacao}</p>
              <p><strong>Entrega Oi:</strong> {record.dataEntregaOi}</p>
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