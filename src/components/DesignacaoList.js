import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Collapse,
  Typography,
  Select,
  message,
  Modal,
  Input,
  DatePicker,
} from "antd";

import {
  PlusOutlined,
  MinusOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import moment from "moment";

const { Panel } = Collapse;
const { Text } = Typography;
const { Option } = Select;

const DesignacaoList = () => {
  const [designacoes, setDesignacoes] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [editModeCadastrais, setEditModeCadastrais] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [parceiros, setParceiros] = useState([]);

  useEffect(() => {
    const fetchDesignacoes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/designacoes"
        );
        setDesignacoes(response.data);
      } catch (err) {
        console.error("Erro ao carregar designações:", err);
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
      await axios.put(
        `http://localhost:8080/api/designacoes/${editableData.id}/dados-tecnicos`,
        editableData
      );
      const updatedDesignacoes = designacoes.map((d) =>
        d.id === editableData.id ? { ...d, ...editableData } : d
      );
      setDesignacoes(updatedDesignacoes);
      setIsModalVisible(false);
    } catch (err) {
      console.error("Erro ao atualizar dados técnicos:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setEditableData({ ...editableData, [field]: value });
  };

  const handleSaveCadastrais = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/designacoes/${editableData.id}/status`,
        { status: editableData.status }
      );
      message.success("Status atualizado com sucesso");
      const updatedDesignacoes = designacoes.map((d) =>
        d.id === editableData.id ? { ...d, status: editableData.status } : d
      );
      setDesignacoes(updatedDesignacoes);
      setEditModeCadastrais(false);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      message.error("Erro ao atualizar status");
    }
  };

  const handleSaveDataAgendamento = async () => {
    try {
      const formattedDate = moment(editableData.dataAgendado).format("YYYY-MM-DDTHH:mm:ss");
      await axios.put(
        `http://localhost:8080/api/agendamento/${editableData.id}`,
        { dataAgendado: formattedDate }
      );
      message.success("Data agendada salva");
      const updatedDesignacoes = designacoes.map((d) =>
        d.id === editableData.id ? { ...d, dataAgendado: formattedDate } : d
      );
      setDesignacoes(updatedDesignacoes);
      setEditModeCadastrais(false);
    } catch (err) {
      console.error("Erro ao salvar data agendada:", err);
      message.error("Erro ao salvar data agendada");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [designacoesResponse, clientesResponse] = await Promise.all([
          axios.get("http://localhost:8080/api/designacoes"),
          axios.get("http://localhost:8080/api/clientes"),
        ]);
        setDesignacoes(designacoesResponse.data);
        setClientes(clientesResponse.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        message.error("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  const handleSaveCliente = async () => {
    if (!editableData.clienteId) {
      message.error("ID do cliente não pode ser vazio");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/designacoes/${editableData.id}/cliente`,
        { clienteId: editableData.clienteId }
      );
      if (response.data) {
        message.success("Cliente atualizado com sucesso");
        const updatedDesignacoes = designacoes.map((d) =>
          d.id === editableData.id
            ? {
                ...d,
                clienteId: editableData.clienteId,
                clienteNome: response.data.clienteNome,
              }
            : d
        );
        setDesignacoes(updatedDesignacoes);
        setEditModeCadastrais(false);
      } else {
        throw new Error("Resposta vazia do servidor");
      }
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err);
      message.error("Erro ao atualizar cliente: " + err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [designacoesResponse, clientesResponse, statusResponse] =
          await Promise.all([
            axios.get("http://localhost:8080/api/designacoes"),
            axios.get("http://localhost:8080/api/clientes"),
            axios.get("http://localhost:8080/api/status"),
          ]);
        setDesignacoes(designacoesResponse.data);
        setClientes(clientesResponse.data);
        setStatusOptions(statusResponse.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        message.error("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [designacoesResponse, clientesResponse, parceirosResponse] =
          await Promise.all([
            axios.get("http://localhost:8080/api/designacoes"),
            axios.get("http://localhost:8080/api/clientes"),
            axios.get("http://localhost:8080/api/parceiros"),
          ]);
        setDesignacoes(designacoesResponse.data);
        setClientes(clientesResponse.data);
        setParceiros(parceirosResponse.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        message.error("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  const handleSaveParceiro = async () => {
    if (!editableData.parceiroId) {
      message.error("ID do parceiro não pode ser vazio");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/api/parceiros/${editableData.id}/parceiro`,
        { parceiroId: editableData.parceiroId }
      );
      if (response.data) {
        message.success("Parceiro atualizado com sucesso");
        const updatedDesignacoes = designacoes.map((d) =>
          d.id === editableData.id ? { ...d, parceiroId: editableData.parceiroId, parceiroNome: response.data.parceiroNome } : d
        );
        setDesignacoes(updatedDesignacoes);
        setEditModeCadastrais(false);
      } else {
        throw new Error("Resposta vazia do servidor");
      }
    } catch (err) {
      console.error("Erro ao atualizar parceiro:", err);
      message.error("Erro ao atualizar parceiro: " + err.message);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Designação",
      dataIndex: "designacao",
      key: "designacao",
    },
    {
      title: "Cidade",
      dataIndex: "nomeCidade",
      key: "cidade",
    },
    {
      title: "Parceiro",
      dataIndex: "parceiroNome",
      key: "parceiro",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Text type={status === "INSTALADO" ? "success" : "danger"}>
          {status}
        </Text>
      ),
    },
    {
      title: "Cliente",
      dataIndex: "clienteNome",
      key: "cliente",
    },
  ];

  return (
    <>
      <Table
        columns={[
          { title: "ID", dataIndex: "id", key: "id" },
          { title: "Designação", dataIndex: "designacao", key: "designacao" },
          { title: "Cidade", dataIndex: "nomeCidade", key: "cidade" },
          { title: "Cliente", dataIndex: "clienteNome", key: "cliente" },
          { title: "Parceiro", dataIndex: "parceiroNome", key: "parceiro" },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
              <Text type={status === "INSTALADO" ? "success" : "danger"}>
                {status}
              </Text>
            ),
          },
        ]}
        dataSource={designacoes}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <Collapse>
              <Panel header="Dados Cadastrais" key="1">
                <p>
                  <strong>ID:</strong> {record.id}
                </p>
                <p>
                  <strong>Designação:</strong> {record.designacao}
                </p>

                <p>
                  <strong>Cidade:</strong> {record.nomeCidade}
                </p>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>
                    <strong>Parceiro:</strong> {record.parceiroNome}
                  </p>
                  <Button
                    onClick={() => setEditModeCadastrais("parceiro")}
                    icon={<EditOutlined />}
                    style={{ marginLeft: 8 }}
                  >
                    Editar
                  </Button>
                </div>

                {editModeCadastrais === "parceiro" && (
                  <>
                    <Select
                      value={editableData.parceiroId}
                      onChange={(value) =>
                        handleInputChange("parceiroId", value)
                      }
                      style={{ width: 510 }}
                    >
                      {parceiros.map((parceiro) => (
                        <Option key={parceiro.id} value={parceiro.id}>
                          {parceiro.nome}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      onClick={handleSaveParceiro}
                      icon={<SaveOutlined />}
                    >
                      Salvar
                    </Button>
                  </>
                )}

                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>
                    <strong>Cliente:</strong> {record.clienteNome}
                  </p>
                  <Button
                    onClick={() => setEditModeCadastrais("cliente")}
                    icon={<EditOutlined />}
                    style={{ marginLeft: 8 }}
                  >
                    Editar
                  </Button>
                </div>

                {editModeCadastrais === "cliente" && (
                  <>
                    <Select
                      value={editableData.clienteId}
                      onChange={(value) =>
                        handleInputChange("clienteId", value)
                      }
                      style={{ width: 510 }}
                    >
                      {clientes.map((cliente) => (
                        <Option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </Option>
                      ))}
                    </Select>
                    <Button onClick={handleSaveCliente} icon={<SaveOutlined />}>
                      Salvar
                    </Button>
                  </>
                )}

                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>
                    <strong>Status:</strong> {record.status}
                  </p>
                  <Button
                    onClick={() => setEditModeCadastrais("status")}
                    icon={<EditOutlined />}
                    style={{ marginLeft: 8 }}
                  >
                    Editar
                  </Button>
                  {editModeCadastrais === "status" && (
                    <>
                      <Select
                        value={editableData.status}
                        onChange={handleStatusChange}
                        style={{ width: 180, marginLeft: 8 }}
                      >
                        {statusOptions.map((status) => (
                          <Option key={status} value={status}>
                            {status}
                          </Option>
                        ))}
                      </Select>
                      <Button
                        onClick={handleSaveCadastrais}
                        icon={<SaveOutlined />}
                        style={{ marginLeft: 8 }}
                      >
                        Salvar
                      </Button>
                    </>
                  )}
                </div>

                <p>
                  <strong>Agendado para: </strong>
                  {record.dataAgendado}
                  <DatePicker
  value={editableData.dataAgendado ? moment(editableData.dataAgendado) : null}
  onChange={(date) => handleInputChange("dataAgendado", date ? date.format("YYYY-MM-DD") : null)}
  disabledDate={(current) => current && current < moment().endOf('day')}
  style={{ marginLeft: 8 }}
/>
                  <Button
                    onClick={handleSaveDataAgendamento}
                    icon={<SaveOutlined />}
                  >
                    Salvar
                  </Button>
                </p>
              </Panel>
              <Panel header="Dados Técnicos" key="2">
                <p>
                  <strong>IP PUBLICO:</strong> {record.circuitIp}
                </p>
                <p>
                  <strong>CVLAN:</strong> {record.cvlan}
                </p>
                <p>
                  <strong>SVLAN:</strong> {record.svlan}
                </p>
                <p>
                  <strong>IP WAN:</strong> {record.ipWan}
                </p>
                <Button onClick={handleEditTecnicos} icon={<EditOutlined />}>
                  Editar
                </Button>
              </Panel>
              <Panel header="Datas" key="3">
                <p>
                  <strong>Data de Criação:</strong> {record.dataCriacao}
                </p>
                <p>
                  <strong>Última Modificação:</strong>{" "}
                  {record.dataUltimaModificacao}
                </p>
                <p>
                  <strong>Data de envio da RB:</strong> {record.dataEnvioRb}
                </p>
                <p>
                  <strong>Data que ocorreu o agendamento:</strong>{" "}
                  {record.dataAgendamento}
                </p>

                <p>
                  <strong>Instalação:</strong> {record.dataInstalacao}
                </p>
                <p>
                  <strong>Homologação:</strong> {record.dataHomologacao}
                </p>
                <p>
                  <strong>Entrega Oi:</strong> {record.dataEntregaOi}
                </p>
              </Panel>
            </Collapse>
          ),
          onExpand: handleExpand,
          expandedRowKeys,
          expandIcon: ({ expanded, onExpand, record }) => (
            <Button
              icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
              shape="circle"
              onClick={(e) => onExpand(record, e)}
            />
          ),
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
          onChange={(e) => handleInputChange("circuitIp", e.target.value)}
        />
        <Input
          placeholder="CVLAN"
          value={editableData.cvlan}
          onChange={(e) => handleInputChange("cvlan", e.target.value)}
        />
        <Input
          placeholder="SVLAN"
          value={editableData.svlan}
          onChange={(e) => handleInputChange("svlan", e.target.value)}
        />
        <Input
          placeholder="IP WAN"
          value={editableData.ipWan}
          onChange={(e) => handleInputChange("ipWan", e.target.value)}
        />
      </Modal>
    </>
  );
};

export default DesignacaoList;
