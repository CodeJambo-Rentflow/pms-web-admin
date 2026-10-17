import { Layout, Menu, Avatar, Dropdown, Space, Typography, theme } from 'antd';
import {
  DashboardOutlined,
  HomeOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
  InboxOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { keycloak } from '../auth/keycloak';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function MainLayout() {
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
    { key: '/buildings', icon: <HomeOutlined />, label: <Link to="/buildings">Properties</Link> },
    { key: '/vacant', icon: <InboxOutlined />, label: <Link to="/vacant">Vacancies</Link> },
    { key: '/tenants', icon: <TeamOutlined />, label: <Link to="/tenants">Tenants</Link> },
    { key: '/leases', icon: <FileTextOutlined />, label: <Link to="/leases">Leases</Link> },
  ];

  const userMenuItems = [
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings (soon)' },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Log out',
      onClick: () => keycloak.logout({ redirectUri: 'http://localhost:5173' }),
    },
  ];

  const username = keycloak.tokenParsed?.preferred_username ?? 'user';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="dark" style={{ position: 'sticky', height: '100vh', top: 0, left: 0 }}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px', marginBottom: 16 }}>
          <Title level={4} style={{ color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
            RentFlow <span style={{ color: '#60A5FA', fontWeight: 400 }}>KE</span>
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname === '/' ? '/' : '/' + location.pathname.split('/')[1]]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          background: colorBgContainer, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <div style={{ textAlign: 'right', display: 'none', '@media (min-width: 768px)': { display: 'block' } }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{username}</div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>Property Manager</div>
              </div>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1E3A8A' }} size="large" />
            </Space>
          </Dropdown>
        </Header>
        
        <Content style={{ padding: '32px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
