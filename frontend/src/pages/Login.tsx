import { Button, Form, Input, notification, Card, Layout, Typography, Row, Col } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { login } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const feedback = localStorage.getItem('feedback');

  useEffect(() => {
    if(feedback) {
      notification.info({
        message: 'Sessao expirada!'
      });

      localStorage.removeItem('feedback');
    }
  }, [])

  async function onFinish(values: any) {
    if(values.senha.length < 8) {
      notification.error({
        message: "A senha deve ter no minimo 8 caracteres",
      });
      return;
    }
    try {
      setLoading(true);
      const data = await login(values.email, values.senha);
      loginUser(data);

      if (data.first_login) {
        navigate("/trocarsenha");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      notification.error({
        message: "Erro ao logar",
        description: err.response?.data?.message ?? "Credenciais inválidas",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <Card loading={loading} style={{ boxShadow: "0 4px 12px black", borderRadius: 12 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={2} style={{ marginBottom: 8 }}>DevManager</Title>
              <Text type="secondary">Logue para acessar</Text>
            </div>
            <Form layout="vertical" onFinish={onFinish} size="large"requiredMark={false}>
              <Form.Item name="email" label="Email" rules={[
                  { required: true, message: "Por favor, insira seu email!" },
                  { type: "email", message: "Insira um email válido!" }
                ]}>
                <Input prefix={<UserOutlined style={{ color: "black" }} />} placeholder="seuemail@email.com" />
              </Form.Item>
              <Form.Item name="senha" label="Senha" rules={[{ required: true, message: "Por favor, insira sua senha!" }]}>
                <Input.Password prefix={<LockOutlined style={{ color: "black" }} />} placeholder="Sua senha" />
              </Form.Item>
              <Form.Item style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" block style={{ borderRadius: 8 }}>
                  Entrar
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}