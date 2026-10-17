import { Table, Tag, Typography, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { listVacantUnits } from '../api/units';

const { Title, Text } = Typography;

export default function VacantUnits() {
  const { data, isLoading } = useQuery({ queryKey: ['vacantUnits'], queryFn: listVacantUnits });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Vacant Units</Title>
        <Text type="secondary">Track units that are currently unoccupied</Text>
      </div>

      <Table
        rowKey="unitId"
        loading={isLoading}
        dataSource={data ?? []}
        pagination={{ pageSize: 10 }}
        columns={[
          { 
            title: 'Property', 
            dataIndex: 'buildingName',
            render: (v, r) => (
              <Space>
                <div style={{ background: '#FEF3C7', padding: 8, borderRadius: 8, color: '#D97706' }}>
                  <InboxOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>Unit {r.unitNumber}</div>
                </div>
              </Space>
            )
          },
          { 
            title: 'Rent (KES)', 
            dataIndex: 'monthlyRent', 
            render: (v: number) => <span style={{ fontWeight: 500 }}>{(v / 100).toLocaleString()}</span> 
          },
          {
            title: 'Vacancy Duration',
            dataIndex: 'daysVacant',
            render: (d: number) => (
              <Tag color={d > 30 ? 'red' : d > 14 ? 'orange' : 'blue'}>
                {d} days vacant
              </Tag>
            ),
          },
        ]}
      />
    </div>
  );
}
