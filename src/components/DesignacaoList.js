import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Collapse, Typography, Select, message, Modal, Input } from 'antd';
import { PlusOutlined, MinusOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Text } = Typography;
const { Option } = Select;

const DesignacaoList = () => {
  const [designacoes, setDesignacoes] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [editModeCadastrais, setEditModeCadastrais] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    setEditableData(record);
    setEditModeCadastrais(false);
  };

  const handleStatusChange = (value) => {
    setEditableData({ ...editableData, status: value });
  };

  const handleEditTecnicos = () => {
    setIsModalVisible(true);
  };

  const handleSaveTecnicos = async () => {
    try {
      await axios.put(`http://localhost:8080/api/designacoes/${editableData.id}/dados-tecnicos`, editableData);
      const updatedDesignacoes = designacoes.map((d) =>
        d.id === editableData.id ? { ...d, ...editableData } : d
      );
      setDesignacoes(updatedDesignacoes);
      setIsModalVisible(false);
    } catch (err) {
      console.error('Erro ao atualizar dados técnicos:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableData({ ...editableData, [field]: value });
  };

  const handleSaveCadastrais = async () => {
    try {
      await axios.put(`http://localhost:8080/api/designacoes/${editableData.id}/status`, {
        status: editableData.status,
      });
      message.success('Status atualizado com sucesso');
      const updatedDesignacoes = designacoes.map((d) =>
        d.id === editableData.id ? { ...d, status: editableData.status } : d
      );
      setDesignacoes(updatedDesignacoes);
      setEditModeCadastrais(false);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      message.error('Erro ao atualizar status');
    }
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
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
    },
  ];

  return (
    <>
    <Table
      columns={columns}
      dataSource={designacoes}
      rowKey="id"
      expandable={{
        expandedRowRender: (record) => (
          <Collapse>
            <Panel header="Dados Cadastrais" key="1">
  {editModeCadastrais ? (
    <>
      <p><strong>ID:</strong> {record.id}</p>
      <p><strong>Designação:</strong> {record.designacao}</p>
      <Select defaultValue={record.status} onChange={handleStatusChange} style={{ width: 180 }}>
      <Option value="AGENDADO">AGENDADO</Option>
                    <Option value="AGENDAMENTO">AGENDAMENTO</Option>
                    <Option value="CANCELADO">CANCELADO</Option>
                    <Option value="ENTREGUE_PORTAL_OI">ENTREGUE PORTAL OI</Option>
                    <Option value="ENVIO_RB">ENVIO RB</Option>
                    <Option value="HOMOLOGADO">HOMOLOGADO</Option>
                    <Option value="INSTALADO">INSTALADO</Option>
                    <Option value="NEGOCIAÇÃO">NEGOCIAÇÃO</Option>
                    <Option value="PENDENCIA_OI">PENDENCIA OI</Option>
                    <Option value="REAGENDADO">REAGENDADO</Option>
                    <Option value="VIABILIDADE">VIABILIDADE</Option>
      </Select>
      <Select defaultValue={record.cliente} onChange={(value) => handleInputChange('cliente', value)} style={{ width: 180 }}>
        <Option value="AMERICANAS">AMERICANAS</Option>
        <Option value="OUTRO">OUTRO</Option>
      </Select>
      <Button onClick={handleSaveCadastrais} icon={<SaveOutlined />}>Salvar</Button>
    </>
  ) : (
    <>
      <p><strong>ID:</strong> {record.id}</p>
      <p><strong>Designação:</strong> {record.designacao}</p>
      <p><strong>Status:</strong> {record.status}</p>
      <p><strong>Cliente:</strong> {record.cliente}</p>
      <Button onClick={() => setEditModeCadastrais(true)} icon={<EditOutlined />}>Editar</Button>
    </>
  )}
  <p><strong>Cidade:</strong> {record.nomeCidade}</p>
</Panel>  
            <Panel header="Dados Técnicos" key="2">
              <p><strong>IP PUBLICO:</strong> {record.circuitIp}</p>
              <p><strong>CVLAN:</strong> {record.cvlan}</p>
              <p><strong>SVLAN:</strong> {record.svlan}</p>
              <p><strong>IP WAN:</strong> {record.ipWan}</p>
              <Button onClick={handleEditTecnicos} icon={<EditOutlined />}>Editar</Button>
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

<Modal
        title="Editar Dados Técnicos"
        visible={isModalVisible}
        onOk={handleSaveTecnicos}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          placeholder="IP PUBLICO"
          value={editableData.circuitIp}
          onChange={(e) => handleInputChange('circuitIp', e.target.value)}
        />
        <Input
          placeholder="CVLAN"
          value={editableData.cvlan}
          onChange={(e) => handleInputChange('cvlan', e.target.value)}
        />
        <Input
          placeholder="SVLAN"
          value={editableData.svlan}
          onChange={(e) => handleInputChange('svlan', e.target.value)}
        />
        <Input
          placeholder="IP WAN"
          value={editableData.ipWan}
          onChange={(e) => handleInputChange('ipWan', e.target.value)}
        />
      </Modal>

</>
  );
};

export default DesignacaoList;