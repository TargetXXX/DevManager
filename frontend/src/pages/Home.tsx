import { Layout, Row, Col, Card, Statistic, Button, Typography, Space, notification, Collapse, Descriptions, Tag } from 'antd';
import { 
  PlusOutlined, 
  UnorderedListOutlined, 
  DatabaseOutlined, 
  CheckCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import type { DashboardStats } from '../types/dev';
import CollapsePanel from 'antd/es/collapse/CollapsePanel';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.get<DashboardStats>('/dashboard/stats');
      console.log('Dashboard Stats:', response.data);
      setStats(response.data);
    } catch (error) {
      notification.error({
        message: 'Erro ao carregar dados do dashboard',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <Card loading={loading}  style={{ margin: 24, minHeight: 280 }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Dashboard DevManager by Eduardo</Title>
          <Text type="secondary">Bem-vindo ao sistema. Esse crud foi desenvolvido com React TS e Laravel</Text>
        </div>

        <Row  gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card hoverable><Statistic title="Total de Devs" value={stats?.total_devs} prefix={<DatabaseOutlined />} /></Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable><Statistic title="Total de Níveis" value={stats?.total_niveis} prefix={<CheckCircleOutlined />} /></Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable><Statistic title="Nível com mais Devs" value={stats?.nivel_com_mais_devs?.nivel || 'N/A'} prefix={<UnorderedListOutlined />} /></Card>
          </Col>
            <Col xs={24} sm={12}>
              <Card title={<span><PlusOutlined style={{color: '#eb2f96'}} />  Ultimo Dev Cadastrado</span>} hoverable>
                <Statistic value={stats?.ultimo_dev?.nome || 'Nenhum'} />
                <Collapse ghost>
                  <CollapsePanel header="Ver detalhes" key="1">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Email">{stats?.ultimo_dev?.email}</Descriptions.Item>
                      <Descriptions.Item label="Hobby">{stats?.ultimo_dev?.hobby}</Descriptions.Item>
                      <Descriptions.Item label="Sexo">
                          <Tag color={stats?.ultimo_dev?.sexo === 'M' ? 'blue' : 'magenta'}>
                              {stats?.ultimo_dev?.sexo === 'M' ? 'Masculino' : 'Feminino'}
                          </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                    <Button size="small" type="link" onClick={() => navigate(`/desenvolvedores#edit:` + stats?.ultimo_dev?.id)} style={{ padding: 0, marginTop: 8 }}>
                      Editar
                    </Button>
                  </CollapsePanel>
                </Collapse>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card title={<span><PlusOutlined style={{color: '#722ed1'}} />   Ultimo Nível Cadastrado</span>} hoverable>
                <Statistic value={stats?.ultimo_nivel?.nivel || 'Nenhum'} />
                <Collapse ghost>
                  <CollapsePanel header="Ver detalhes" key="2">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="ID do Nivel">{stats?.ultimo_nivel?.id}</Descriptions.Item>
                      <Descriptions.Item label="Data Registro">
                          {new Date(stats?.ultimo_nivel?.created_at ?? "").toLocaleDateString()}
                      </Descriptions.Item>
                    </Descriptions>
                    <Button size="small" type="link" onClick={() => navigate(`/niveis#edit:` + stats?.ultimo_nivel?.id)} style={{ padding: 0, marginTop: 8 }}>
                      Editar
                    </Button>
                  </CollapsePanel>
                </Collapse>
              </Card>
            </Col>
        </Row>

        <Card title="Acoes Rápidas" style={{ marginTop: 24 }}>
          <Space size="middle">
            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/desenvolvedores#new')}>
              Novo Desenvolvedor
            </Button>
            <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/niveis#new')}>
              Novo Nivel
            </Button>
            <Button icon={<UnorderedListOutlined />} size="large" onClick={() => navigate('/desenvolvedores')}>
              Ver Devs
            </Button>
            <Button icon={<UnorderedListOutlined />} size="large" onClick={() => navigate('/niveis')}>
              Ver Niveis
            </Button>
          </Space>
        </Card>

        <Card style={{ marginTop: 24, backgroundColor: '#fafafa' }}>
          <Title level={4}>Informações do Projeto</Title>
          <Text>
            Este projeto foi desenvolvedor como um teste FULLSTACK. 
            Design feito com ANT DESIGN.
          </Text>
        </Card>
      </Content>
    </Card>
  );
};
