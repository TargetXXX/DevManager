import { Button, Card, Col, Form, Input, Layout, notification, Row } from "antd";
import { api } from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import { LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";


export default function TrocarSenha() {
    const {dev, setDev} = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    if(!dev) navigate("/login");


    if(!dev?.first_login) return <Navigate to="/" replace />;
    
    async function onFinish(values: any) {

        if(values.nova_senha.length < 8) {
            notification.error({ message: "A nova senha deve ter no minimo 8 caracteres" });
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/auth/changepassword", {senha_atual: values.senha_atual, nova_senha: values.nova_senha, nova_senha_confirmation: values.confirmacao});
            notification.success({ message: "Senha alterada com sucesso" });
            setDev(res.data.data);
            navigate("/");
        } catch {
            notification.error({ message: "Erro ao alterar senha" });
            
        } finally {
            setLoading(false);
        }
    }

    notification.info({message: "Voce precisa trocar sua senha antes de prosseguir."});

    return (
        <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
            <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
                <Col xs={22} sm={16} md={12} lg={8} xl={6}>
                    <Card loading={loading} style={{ boxShadow: "0 4px 12px black", borderRadius: 12 }}>
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            <Title level={2} style={{ marginBottom: 8 }}>Nova Senha</Title>
                            <text type="secondary">Você precisa trocar sua senha antes de prosseguir</text>
                        </div>
                        <Form layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
                            <Form.Item name="senha_atual" label="Senha atual" rules={[{ required: true, message: "Insira a senha atual!" }]}>
                                <Input.Password prefix={<LockOutlined style={{ color: "black" }} />} placeholder="Senha atual" />
                            </Form.Item>
                            <Form.Item name="nova_senha" label="Nova senha" rules={[{ required: true, message: "Insira a nova senha!" }]}>
                                <Input.Password prefix={<LockOutlined style={{ color: "black" }} />} placeholder="Nova senha" />
                            </Form.Item>
                            <Form.Item name="confirmacao" label="Confirmar senha" dependencies={["nova_senha"]} rules={[
                                    { required: true, message: "Confirme a nova senha!" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {

                                            if(getFieldValue("nova_senha") < 8 ) return Promise.reject("A senha deve ter no minimo 8 caracteres");
                                            

                                            if (!value || getFieldValue("nova_senha") === value) return Promise.resolve();
                                            return Promise.reject("As senhas não coincidem");
                                        }
                                    })
                                ]}>
                                <Input.Password prefix={<LockOutlined style={{ color: "black" }} />} placeholder="Confirme a senha" />
                            </Form.Item>
                            <Form.Item style={{ marginTop: 32 }}>
                                <Button type="primary" htmlType="submit" block style={{ borderRadius: 8 }}>
                                    Alterar senha
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
}