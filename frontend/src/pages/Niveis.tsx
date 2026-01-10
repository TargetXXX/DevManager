import { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Modal, notification, Select, Space, Table } from "antd";
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import { api } from "../api/axios";
import type { ApiResponse, Nivel } from "../types/dev";
import { DeleteFilled, EditFilled, FileAddFilled, ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { confirmDelete } from "../utils/Swal";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";


type TableParams = {
  pagination?: TablePaginationConfig;
  filters?: Record<string, FilterValue | null>;
  sortField?: string;
  sortOrder?: "ascend" | "descend" | null;
};

function isNonNullable<T>(val: T | null | undefined): val is T {
  return val !== undefined && val !== null;
}

function toURLSearchParams(record: Record<string, string | number | boolean>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    params.append(key, String(value));
  }
  return params;
}

function getParams(params: TableParams) {
  const { pagination, filters, sortField, sortOrder } = params;

  const result: Record<string, string | number | boolean> = {};

  result.per_page = pagination?.pageSize ?? 1;
  result.page = pagination?.current ?? 1;

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (isNonNullable(value) && value.length > 0) {
        result[key] = String(value[0]);
      }
    });
  }

  if (sortField) {
    result.orderby = sortField;
    result.order = sortOrder === "ascend" ? "asc" : "desc";
  }

  return result;
}

export default function NivelTable() {
    const [data, setData] = useState<Nivel[]>([]);
    const [loading, setLoading] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [currentNivel, setCurrentNivel] = useState<Nivel | null>(null);
    const [form] = Form.useForm();
    const [permissions, setPermissions] = useState<String[] | null>(null);
    const location = useLocation();
    const [firstLoadDone, setFirstLoadDone] = useState(false);

    const {dev} = useAuth();

    const navigate = useNavigate();

    if (!dev || dev.first_login) {
        setTimeout(() => navigate("/trocarsenha"), 0); 
        return null; 
    }

    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: { current: 1, pageSize: 5 },
        filters: {},
        sortField: undefined,
        sortOrder: null,
    });

    const queryString = useMemo(() => {
        const params = toURLSearchParams(getParams(tableParams));
        return params.toString();
    }, [tableParams]);

    useEffect(() => {
        if (!dev?.first_login) {
            fetchData();
        }
    }, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        tableParams.sortField,
        tableParams.sortOrder,
        JSON.stringify(tableParams.filters),
    ]);

    useEffect(() => {
        if (!dev?.first_login) {
            fetchPermissions();
        }
    }, []);

    useEffect(() => {

        if (!firstLoadDone || loading) return;

        if(location.hash === "#new") {
            handleCreate();
            navigate(location.pathname, { replace: true });
        }
        if(location.hash.startsWith("#edit")) {
            if(loading) return;

            const id = parseInt(location.hash.split(":")[1]);
            handleEdit(id ? data.find(d => d.id === id) as Nivel : null);
            navigate(location.pathname, { replace: true });
        }
    }, [location.hash, loading]);

    async function handleDeleteNivel(id: number) {
        try {
            setLoading(true);
            await api.delete(`/niveis/${id}`);
            notification.success({ message: "Nível excluído com sucesso." });
            fetchData();
        } catch (error: any) {
            let feedback = error?.response?.data?.message ?? error?.message;
            notification.error({ message: "Erro ao excluir nível.  " + feedback });
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(nivel: Nivel|null) {


        if(!nivel) {
            notification.error({
                message: "Nível não encontrado para edição.",
            });
            return;
        }

        if(!dev?.nivel?.permissions?.includes("update")) {
            notification.error({
                message: "Você nao tem permissao para editar niveis.",
            });
            return;
        }

        if(dev?.nivel?.id === nivel.id) {
            notification.error({
                message: "Voce nao pode editar o nivel associado ao seu usuario.",
            });
            return;
        }

        form.resetFields();
        setCurrentNivel(nivel);
        setEditModal(true);
        
        form.setFieldsValue({
            nivel: nivel.nivel,
            nivel_id: nivel.id,
            permissions: nivel.permissions || []
        });
    }

    function handleCreate() {


        if(!dev?.nivel?.permissions?.includes("create")) {
            notification.error({
                message: "Você nao tem permissao para criar niveis.",
            });
            return;
        }

        form.resetFields();
        setCurrentNivel(null);
        setEditModal(true);
        
    }

    function textSearchColumn<T>(label: string): ColumnsType<T>[number] {
        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input placeholder={`Buscar ${label}`} value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: "block" }}
                    />
                    <Space>
                    <Button type="primary" size="small" icon={<SearchOutlined />} onClick={() => confirm()}>
                        Buscar
                    </Button>
                    <Button size="small" onClick={() => { clearFilters?.(); confirm();}}>
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

    const columns: ColumnsType<Nivel> = [
        {
        title: "ID",
        dataIndex: "id",
        sorter: true,
        width: "20%",
        },
        {
        title: "Nivel",
        dataIndex: "nivel",
        sorter: true,
        filterSearch: true,
        width: "20%",
        filteredValue: tableParams.filters?.nivel || null,
        ...textSearchColumn<Nivel>("nivel"),
        
        },
        {
        title: "Devs associados",
        dataIndex: "devs_count",
        sorter: true,
        width: "20%",
        },
        {
        title: "Acoes",
        render: (nivel: Nivel) => {

            if(dev?.nivel?.id !== nivel.id) 
                return (
                    <><Button icon={<EditFilled />} onClick={() => handleEdit(nivel)}></Button>
                    <Button icon={<DeleteFilled />} onClick={async () => {
                        if((await confirmDelete("Tem certeza que deseja excluir esse nivel?")).isConfirmed) {
                            handleDeleteNivel(nivel.id);
                        }
                    }}></Button></>)

            return (<></>)
        },
        sorter: true,
        width: "10%",

        }

    ];

    function fillTable(data: ApiResponse) {
        setData(Array.isArray(data.data) ? (data.data as Nivel[]) : []);
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

     async function updateNivel(updatedNivel: FormData) {
        try {
            setLoading(true);
            updatedNivel.append('_method', 'PUT');
            await api.post(`/niveis/${currentNivel?.id}`, updatedNivel, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            notification.success({ message: "Nivel editado com sucesso." });
            fetchData();
        } catch (error: any) {
            let feedback = error?.response?.data?.message ?? error?.message;
            notification.error({ message: "Erro ao editar nivel. " + feedback });
        } finally {
            setLoading(false);
        }
    }

    async function createNivel(newNivel: FormData) {
        try {
            setLoading(true);
            await api.post(`/niveis`, newNivel, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            notification.success({ message: "Nivel cadastrado com sucesso." });
            fetchData();
        } catch (error: any) {
            let feedback = error?.response?.data?.message ?? error?.message;
            notification.error({ message: "Erro ao cadastrar nivel. " + feedback });
        } finally {
            setLoading(false);
        }
    }

    async function fetchData() {

         if(!dev?.nivel?.permissions?.includes("read")) {
            notification.error({ message: "Você não tem permissão para ver a tabela de niveis." });
            return;
        }

        setLoading(true);
        try {
            const req = await api.get(`/niveis?${queryString}`);
            const datad: ApiResponse = req.data;
            fillTable(datad);
            setFirstLoadDone(true);
        } catch (error: any) {
            
            if(error.response && error.response.status === 404) { 
                notification.error({ message: "Nenhum nivel encontrado." });
            } else {
                let feedback = error?.response?.data?.message ?? error?.message;
                notification.error({ message: "Erro ao buscar niveis. " + feedback });
            }
            fillTable({data: [], meta: {current_page: 1, last_page: 1, per_page: tableParams.pagination?.pageSize || 10, total: 1}});
        } finally {
            setLoading(false);
        }
    }

    async function fetchPermissions() {
        try {
            const permreq = await api.get('/permissions');

            setPermissions(permreq.data);
        } catch (error){
            console.log("Erro ao buscar permissioes");
        }
    }

    const handleTableChange: TableProps<Nivel>["onChange"] = (
        pagination,
        filters,
        sorter
        ) => {
        const s = sorter as SorterResult<Nivel>;

        setTableParams((prev) => {
            const isFilterChange =
            JSON.stringify(filters) !== JSON.stringify(prev.filters);

            const isSortChange =
            (Array.isArray(sorter) ? null : s.order) !== prev.sortOrder ||
            (Array.isArray(sorter) ? undefined : s.field) !== prev.sortField;

            return {
            pagination: {
                ...prev.pagination,
                current: isFilterChange || isSortChange
                ? 1               
                : pagination.current, 
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
        {dev?.nivel?.permissions?.includes("create") && <Button type="primary" icon={<FileAddFilled/>} style={{ marginBottom: 16 }} onClick={handleCreate}></Button>}
        <Button type="primary" icon={<ReloadOutlined />} onClick={fetchData} loading={loading}/>
        <Modal loading={loading} open={editModal} title={currentNivel ? "Editar nivel" : "Criar nivel"} onCancel={() => setEditModal(false)} onOk={() => form.submit()} okText="Salvar">
            <Form form={form} layout="vertical" onFinish={(values) => {
                    const formData = new FormData();

                    formData.append("nivel", values.nivel);
                    formData.append("id", values.nivel_id);

                    if (values.permissions && Array.isArray(values.permissions)) {
                        values.permissions.forEach((p: string) => {
                            formData.append("permissions[]", p);
                        });
                    }

                    currentNivel ? updateNivel(formData) : createNivel(formData);
                    setEditModal(false);
                }}>   
                <Form.Item name="nivel" label="Nivel" rules={[{ required: true }]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="permissions" label="Permissoes" rules={[{ required: true}]}>
                    <Select mode="multiple" placeholder="Selecione as permissoes" allowClear options={permissions?.map(permissions => ({ value: permissions, label: permissions }))} />
                </Form.Item>
            </Form>
        </Modal>
        <Table<Nivel> columns={columns} rowKey={(record) => record.id} dataSource={data} pagination={tableParams.pagination} loading={loading} onChange={handleTableChange}/>
        </>
    );
}
