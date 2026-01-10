import { useEffect, useMemo, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Select,
  Space,
  Table,
  Upload,
} from "antd";
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { api, defaultAvatarURL } from "../api/axios";
import type { ApiResponse, Dev, Nivel } from "../types/dev";
import {
  DeleteFilled,
  EditFilled,
  FileAddFilled,
  ReloadOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { confirmDelete } from "../utils/Swal";
import dayjs from "dayjs";
import ImgCrop from "antd-img-crop";
import { useAuth } from "../contexts/AuthContext";
import { toBase64 } from "../utils/Utils";
import { useLocation, useNavigate } from "react-router-dom";

type TableParams = {
  pagination?: TablePaginationConfig;
  filters?: Record<string, FilterValue | null>;
  sortField?: string;
  sortOrder?: "ascend" | "descend" | null;
};

function getParams(params: TableParams) {
  const { pagination, filters, sortField, sortOrder } = params;
  const result = new URLSearchParams();

  result.append("per_page", String(pagination?.pageSize ?? 10));
  result.append("page", String(pagination?.current ?? 1));

  if (filters) {
    Object.entries(filters).forEach(([key, values]) => {
      if (!Array.isArray(values) || values.length === 0) return;

      if (key === "nivel_id") {
        values.forEach((v) => {
          result.append("nivel_id[]", String(v));
        });
      } else {
        result.append(key, String(values[0]));
      }
    });
  }

  if (sortField) {
    result.append("orderby", sortField);
    result.append("order", sortOrder === "ascend" ? "asc" : "desc");
  }

  return result.toString();
}

export default function DevTable() {
  const [data, setData] = useState<Dev[]>([]);
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentDev, setCurrentDev] = useState<Dev | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form] = Form.useForm();
  const [firstLoadDone, setFirstLoadDone] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { dev } = useAuth();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: { current: 1, pageSize: 5 },
    filters: {},
    sortField: undefined,
    sortOrder: null,
  });

  const queryString = useMemo(() => getParams(tableParams), [tableParams]);

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortField,
    tableParams.sortOrder,
    JSON.stringify(tableParams.filters),
  ]);

  useEffect(() => {

    if (!firstLoadDone || loading) return;

    if(location.hash === "#new") {
      handleCreate();
      navigate(location.pathname, { replace: true });
    }
    if(location.hash.startsWith("#edit")) {
      const id = parseInt(location.hash.split(":")[1]);
      handleEdit(id ? data.find(d => d.id === id) as Dev : null);
      navigate(location.pathname, { replace: true });
    }
  }, [location.hash, loading, firstLoadDone]);

  useEffect(() => {
    fetchNiveis();
  }, []);

  async function handleDeleteDev(id: number) {
    if (id === dev?.id) {
      notification.error({ message: "Voce nao pode excluir a si mesmo" });
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/desenvolvedores/${id}`);
      notification.success({ message: "Desenvolvedor excluído com sucesso." });
      fetchData();
    } catch (error: any) {
      let feedback = error?.response?.data?.message ?? error?.message;

      notification.error({
        message: "Erro ao excluir desenvolvedor. " + feedback,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(devE: Dev|null) {

    if(!devE) {
      notification.error({
        message: "Desenvolvedor não encontrado para edição.",
      });
      return;
    }

    if(!dev?.nivel?.permissions?.includes("update")) {
      notification.error({
        message: "Você nao tem permissao para editar desenvolvedores.",
      });
      return;
    }

    if(dev.id === devE.id) {
      notification.error({
        message: "Você nao pode editar a si mesmo por aqui.",
      });
      return;
    }

    form.resetFields();
    setAvatarPreview(null);
    setCurrentDev(devE);
    setEditModal(true);

    form.setFieldsValue({
      id: devE.id,
      email: devE.email,
      nome: devE.nome,
      sexo: devE.sexo,
      hobby: devE.hobby,
      nivel_id: devE.nivel?.id,
      data_nascimento: dayjs(devE.data_nascimento),
    });

    
  }

  function handleCreate() {

    if(!dev?.nivel?.permissions?.includes("create")) {
      notification.error({
        message: "Você nao tem permissao para criar desenvolvedores.",
      });
      return;
    }

    form.resetFields();
    setAvatarPreview(null);
    setAvatarFile(null);
    setCurrentDev(null);
    setEditModal(true);
    setAvatarPreview(defaultAvatarURL);
  }

  async function updateDev(updatedDev: FormData) {
    try {
      setLoading(true);
      updatedDev.append("_method", "PUT");
      await api.post(`/desenvolvedores/${currentDev?.id}`, updatedDev, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      notification.success({ message: "Desenvolvedor editado com sucesso." });
      fetchData();
    } catch (error: any) {
      let feedback = error?.response?.data?.message ?? error?.message;

      notification.error({
        message: "Erro ao editar desenvolvedor." + feedback,
      });
    } finally {
      setLoading(false);
    }
  }

  async function createDev(newDev: FormData) {
    try {
      setLoading(true);
      await api.post(`/desenvolvedores`, newDev, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      notification.success({
        message: "Desenvolvedor cadastrado com sucesso.",
      });
      fetchData();
    } catch (error: any) {
      let feedback = error?.response?.data?.message ?? error?.message;

      notification.error({
        message: "Erro ao cadastrar desenvolvedor. " + feedback,
      });
    } finally {
      setLoading(false);
    }
  }

  function textSearchColumn<T>(label: string): ColumnsType<T>[number] {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Buscar ${label}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<SearchOutlined />}
              onClick={() => confirm()}
            >
              Buscar
            </Button>
            <Button
              size="small"
              onClick={() => {
                clearFilters?.();
                confirm();
              }}
            >
              Limpar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "green" : undefined }} />
      ),
    };
  }

  const columns: ColumnsType<Dev> = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      width: "20%",
      render: (avatar: string) => (
        <img
          src={'data:image/png;base64,' + avatar}
          alt="Avatar"
          style={{
            width: 50,
            height: 50,
            borderRadius: "50%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.src = defaultAvatarURL;
          }}
        />
      ),
    },
    {
      title: "Nome",
      dataIndex: "nome",
      sorter: true,
      filterSearch: true,
      width: "20%",
      filteredValue: tableParams.filters?.nome || null,
      ...textSearchColumn<Dev>("Nome"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      filterSearch: true,
      width: "20%",
      filteredValue: tableParams.filters?.email || null,
      ...textSearchColumn<Dev>("Email"),
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      filteredValue: tableParams.filters?.sexo || null,
      filters: [
        { text: "Masculino", value: "M" },
        { text: "Feminino", value: "F" },
      ],
      filterMultiple: false,
      width: "20%",
    },
    {
      title: "Data de Nascimento",
      dataIndex: "data_nascimento",
      sorter: true,
      width: "30%",
      render: (data_nascimento: string) =>
        new Date(data_nascimento).toLocaleDateString(),
    },
    {
      title: "Idade",
      dataIndex: "idade",
      sorter: true,
      width: "20%",
    },
    {
      title: "Hobby",
      dataIndex: "hobby",
      width: "20%",
      filterSearch: true,
      filteredValue: tableParams.filters?.hobby || null,
      ...textSearchColumn<Dev>("Hobby"),
    },
    {
      title: "Nivel",
      dataIndex: "nivel_id",
      render: (_id: any, dev: Dev) => dev.nivel?.nivel ?? "N/A",
      filters: niveis.map((nivel) => ({
        text: nivel.nivel,
        value: nivel.id,
      })),
      filteredValue: tableParams.filters?.nivel_id || null,
    },
    {
      title: "Acoes",
      render: (Adev: Dev) => {
        if (dev?.id !== Adev.id)
          return (
            <>
              <Button
                icon={<EditFilled />}
                onClick={() => handleEdit(Adev)}
              ></Button>
              <Button
                icon={<DeleteFilled />}
                onClick={async () => {
                  if (
                    (
                      await confirmDelete(
                        "Tem certeza que deseja excluir esse desenvolvedor?"
                      )
                    ).isConfirmed
                  ) {
                    handleDeleteDev(Adev.id);
                  }
                }}
              ></Button>
            </>
          );

        return <></>;
      },
      width: "30%",
    },
  ];

  function fillTable(data: ApiResponse) {
    setData(Array.isArray(data.data) ? (data.data as Dev[]) : []);
    setTableParams((prev) => ({
      ...prev,
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: [1, 5, 10, 20, 50],
        ...prev.pagination,
        pageSize: data.meta.per_page,
        current: data.meta.current_page,
        last_page: data.meta.last_page,
        total: data.meta.total,
      },
    }));
  }

  async function fetchData() {
    if (!dev?.nivel?.permissions?.includes("read")) {
      notification.error({
        message: "Você não tem permissão para ver a tabela de desenvolvedores.",
      });
      return;
    }

    setLoading(true);
    try {
      const req = await api.get(`/desenvolvedores?${queryString}`);
      const datad: ApiResponse = req.data;
      fillTable(datad);
      setFirstLoadDone(true);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        notification.error({ message: "Nenhum desenvolvedor encontrado." });
      } else {
        let feedback = error?.response?.data?.message ?? error?.message;

        notification.error({
          message: "Erro ao buscar desenvolvedores. " + feedback,
        });
      }
      fillTable({
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: tableParams.pagination?.pageSize || 10,
          total: 1,
        },
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchNiveis() {
    setLoading(true);

    if (!dev?.nivel?.permissions?.includes("read") && !dev?.nivel?.permissions?.includes("create")) return;

    try {
      const res = await api.get("/niveis");
      const data: ApiResponse = res.data;
      setNiveis(Array.isArray(data.data) ? (data.data as Nivel[]) : []);
    } catch (error: any) {
      let feedback = error?.response?.data?.message ?? error?.message;
      notification.error({ message: "Erro ao buscar níveis. " + feedback });
    } finally {
      setLoading(false);
    }
  }

  const handleTableChange: TableProps<Dev>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const s = sorter as SorterResult<Dev>;

    setTableParams((prev) => {
      const isFilterChange =
        JSON.stringify(filters) !== JSON.stringify(prev.filters);

      const isSortChange =
        (Array.isArray(sorter) ? null : s.order) !== prev.sortOrder ||
        (Array.isArray(sorter) ? undefined : s.field) !== prev.sortField;

      return {
        pagination: {
          ...prev.pagination,
          current: isFilterChange || isSortChange ? 1 : pagination.current,
          pageSize: pagination.pageSize,
        },
        filters,
        sortField: Array.isArray(sorter) ? undefined : (s.field as string),
        sortOrder: Array.isArray(sorter) ? null : s.order,
      };
    });
  };

  return (
    <>
      {dev?.nivel?.permissions?.includes("create") && (
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          style={{ marginBottom: 16 }}
          onClick={handleCreate}
        ></Button>
      )}
      <Button
        type="primary"
        icon={<ReloadOutlined />}
        onClick={fetchData}
        loading={loading}
      />
      <Modal
        loading={loading}
        open={editModal}
        title={currentDev ? "Editar Desenvolvedor" : "Cadastrar Desenvolvedor"}
        onCancel={() => setEditModal(false)}
        onOk={() => form.submit()}
        okText="Salvar"
      >
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <img
            src={avatarPreview ?? ('data:image/png;base64,' + currentDev?.avatar as string)}
            alt="Avatar preview"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.src = defaultAvatarURL;
            }}
          />
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            const formData = new FormData();

            formData.append("nome", values.nome);
            formData.append("email", values.email);
            formData.append("sexo", values.sexo);
            formData.append("hobby", values.hobby);
            formData.append("nivel_id", values.nivel_id);
            formData.append(
              "data_nascimento",
              values.data_nascimento.format("YYYY-MM-DD")
            );

            if (avatarFile) {
              const base64 = await toBase64(avatarFile) as string;
              formData.append("avatar", base64.split(',')[1]);
            }

            currentDev ? updateDev(formData) : createDev(formData);
            setEditModal(false);
          }}
        >
          <Form.Item
            name="avatar"
            label="Novo avatar"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <ImgCrop
              rotationSlider
              cropShape="round"
              aspect={1}
              quality={1}
              modalTitle="Ajustar avatar"
              modalOk="Salvar"
              modalCancel="Cancelar"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={(file) => {
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                  return false;
                }}
                accept="image/*"
                onChange={({ fileList }) => {
                  if (fileList.length === 0) {
                    setAvatarPreview(defaultAvatarURL);
                    setAvatarFile(null);
                  }
                }}
              >
                <FileAddFilled />
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Insira um email valido",
              },
            ]}
          >
            <Input type={"email"} />
          </Form.Item>

          <Form.Item name="sexo" label="Sexo" rules={[{ required: true }]}>
            <Select options={[{ value: "M" }, { value: "F" }]} />
          </Form.Item>

          <Form.Item
            name="data_nascimento"
            label="Nascimento"
            rules={[{ required: true }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current.isAfter(dayjs(), "day")
              }
            />
          </Form.Item>

          <Form.Item name="hobby" label="Hobby" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="nivel_id" label="Nivel" rules={[{ required: true }]}>
            <Select
              options={niveis.map((nivel) => ({
                value: nivel.id,
                label: nivel.nivel,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table<Dev>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
}
