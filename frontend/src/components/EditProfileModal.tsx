import { DatePicker, Form, Input, Modal, notification, Select, Upload } from "antd";
import { FileAddFilled, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import ImgCrop from "antd-img-crop";
import { api, defaultAvatarURL } from "../api/axios";
import dayjs from "dayjs";
import { toBase64 } from "../utils/Utils";

interface EditProfileModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function EditProfileModal({ open, setOpen }: EditProfileModalProps) {
    const { dev, setDev } = useAuth();
    const [form] = Form.useForm();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const formValues = Form.useWatch([], form);
    const novaSenha = Form.useWatch("nova_senha", form);

    const hasChanges = () => {
        if (!formValues) return false;

        if (avatarFile) return true;
        
        return ((formValues.nome && formValues.nome !== dev?.nome) || (formValues.email && formValues.email !== dev?.email) ||
            (formValues.sexo && formValues.sexo !== dev?.sexo) ||
            (formValues.hobby && formValues.hobby !== dev?.hobby) ||
            (formValues.data_nascimento && formValues.data_nascimento.format("YYYY-MM-DD") !== dev?.data_nascimento) ||
            !!formValues.nova_senha);
    };

    async function updateDev(formData: FormData) {
        try {
            setLoading(true);
            formData.append('_method', 'PUT');
            const res =await api.post(`/editProfile`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            

            if (res.data && res.data.data) {
                setDev(res.data.data);
            } else {
                setDev(res.data);
            }

            form.resetFields();
            setAvatarPreview(null);
            setAvatarFile(null);
            notification.success({ message: "Perfil atualizado com sucesso." });
            setOpen(false);
        } catch (error: any) {
            let feedback = error?.response?.data?.message ?? error?.message;
            notification.error({ message: "Erro ao atualizar perfil: " + feedback });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal loading={loading} open={open} title="Editar perfil" onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Salvar" okButtonProps={{ disabled: !hasChanges() }}>   
            <div style={{ marginBottom: 10, textAlign: "center" }}>
                <img src={avatarPreview ?? 'data:image/png;base64,' + dev?.avatar as string} alt="Avatar" style={{width: 80, height: 80, borderRadius: "50%", objectFit: "cover"}}/>
            </div>

            <Form form={form} layout="vertical" onFinish={async (values) => {
                    const formData = new FormData();

                    if(values.nome) formData.append("nome", values.nome);
                    if(values.email) formData.append("email", values.email);
                    if(values.sexo) formData.append("sexo", values.sexo);
                    if(values.hobby) formData.append("hobby", values.hobby);
                    if(values.data_nascimento) formData.append("data_nascimento", values.data_nascimento.format("YYYY-MM-DD"));
                    if(values.nova_senha) {

                        if(values.nova_senha.length < 8) {
                            notification.error({
                                message: "A senha deve ter no minimo 8 caracteres"
                            });
                            return;
                        }

                        formData.append("senha", values.nova_senha);
                        formData.append("senha_confirmation", values.confirmacao);
                    }
                    formData.append("senha_atual", values.senha_atual);
                    if (avatarFile) {
                        const base64 = await toBase64(avatarFile) as string;
                        formData.append("avatar", base64.split(',')[1]);
                    }
                    updateDev(formData);
                }}>   
                <Form.Item name="avatar" label="Novo avatar">
                    <ImgCrop rotationSlider cropShape="round" aspect={1}>
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
                        ><FileAddFilled/></Upload>
                    </ImgCrop>
                </Form.Item>

                <Form.Item name="nome" label="Nome"><Input placeholder={dev?.nome}/></Form.Item>
                <Form.Item rules={[
                    {type: "email", message: "Insira um email valido"}
                ]} name="email" label="Email"><Input type="email" placeholder={dev?.email}/></Form.Item>
                <Form.Item name="sexo" label="Sexo">
                    <Select options={[{ value: "M" }, { value: "F" }]} placeholder={dev?.sexo} />
                </Form.Item>
                <Form.Item name="data_nascimento" label="Nascimento">
                    <DatePicker style={{ width: "100%" }} disabledDate={(c) => c && c.isAfter(dayjs())}/>
                </Form.Item>
                <Form.Item name="hobby" label="Hobby"><Input placeholder={dev?.hobby}/></Form.Item>

                <Form.Item name="senha_atual" label="Senha atual" rules={[{ required: true, message: "Senha atual obrigatória" }]}>
                    <Input.Password prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item name="nova_senha" label="Nova senha">
                    <Input.Password prefix={<LockOutlined />} placeholder="Deixe em branco para manter" />
                </Form.Item>

                <Form.Item 
                    name="confirmacao" 
                    label="Confirmar nova senha" 
                    dependencies={["nova_senha"]}
                    rules={[
                        { required: !!novaSenha, message: "Confirmação obrigatória" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("nova_senha") === value) return Promise.resolve();
                                return Promise.reject("As senhas não coincidem");
                            }
                        })
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} disabled={!novaSenha} />
                </Form.Item>  
            </Form>
        </Modal>
    );
}