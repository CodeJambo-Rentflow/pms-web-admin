import { Card, Col, Row, Statistic, Spin, Typography, List, Tag, Empty } from 'antd';
import { HomeOutlined, InboxOutlined, TeamOutlined, FileTextOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { listBuildings } from '../api/buildings';
import { listVacantUnits } from '../api/units';
import { listTenants } from '../api/tenants';
import { listLeases } from '../api/leases';

const { Title, Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  
  const buildings = useQuery({ queryKey: ['buildings'], queryFn: listBuildings });
  const vacant = useQuery({ queryKey: ['vacantUnits'], queryFn: listVacantUnits });
  const tenants = useQuery({ queryKey: ['tenants'], queryFn: listTenants });
  const leases = useQuery({ queryKey: ['leases'], queryFn: listLeases });

  const loading = buildings.isLoading || vacant.isLoading || tenants.isLoading || leases.isLoading;

  if (loading) return <Spin size="large" style={{ display: 'block', marginTop: 100 }} />;

  const activeLeases = leases.data?.filter((l) => l.status === 'ACTIVE').length ?? 0;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Overview</Title>
        <Text type="secondary">Welcome back. Here is what is happening across your properties today.</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable onClick={() => navigate('/buildings')}>
            <Statistic title="Total Properties" value={buildings.data?.length ?? 0} prefix={<HomeOutlined style={{ color: '#1E3A8A' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable onClick={() => navigate('/vacant')}>
            <Statistic title="Vacant Units" value={vacant.data?.length ?? 0} prefix={<InboxOutlined style={{ color: '#F59E0B' }} />} valueStyle={{ color: '#F59E0B' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable onClick={() => navigate('/tenants')}>
            <Statistic title="Registered Tenants" value={tenants.data?.length ?? 0} prefix={<TeamOutlined style={{ color: '#3B82F6' }} />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} hoverable onClick={() => navigate('/leases')}>
            <Statistic title="Active Leases" value={activeLeases} prefix={<FileTextOutlined style={{ color: '#10B981' }} />} valueStyle={{ color: '#10B981' }} />
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card title="Action Needed: Vacant Units" bordered={false} style={{ height: '100%' }}>
            {vacant.data && vacant.data.length > 0 ? (
              <List
                dataSource={vacant.data.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <a key="view" onClick={() => navigate('/vacant')}>View <ArrowRightOutlined /></a>
                    ]}
                  >
                    <List.Item.Meta
                      title={<Text strong>{item.buildingName} - Unit {item.unitNumber}</Text>}
                      description={`Vacant for ${item.daysVacant} days`}
                    />
                    <Tag color={item.daysVacant > 30 ? 'red' : 'orange'}>
                      KES {(item.monthlyRent / 100).toLocaleString()} / mo
                    </Tag>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No vacant units. Full occupancy!" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Recent Leases" bordered={false} style={{ height: '100%' }}>
             {leases.data && leases.data.length > 0 ? (
              <List
                dataSource={leases.data.slice(0, 5)}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.leaseNumber}
                      description={`Ends on ${item.endDate}`}
                    />
                    <Tag color={item.status === 'ACTIVE' ? 'green' : 'default'}>{item.status}</Tag>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No leases yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
