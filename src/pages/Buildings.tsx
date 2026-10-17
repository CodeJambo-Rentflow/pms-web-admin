import { useState } from 'react';
import { Button, Table, Modal, Form, Input, message, Space, Typography, Tag } from 'antd';
import { PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { listBuildings, createBuilding, type CreateBuildingRequest } from '../api/buildings';
import { keycloak } from '../auth/keycloak';

const { Title, Text } = Typography;

export default function Buildings() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<CreateBuildingRequest>();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['buildings'], queryFn: listBuildings });

  const createMut = useMutation({
    mutationFn: createBuilding,
    onSuccess: () => {
      message.success('Property created');
      qc.invalidateQueries({ queryKey: ['buildings'] });
      setOpen(false);
      form.resetFields();
    },
    onError: (e: any) => message.error(e?.response?.data?.error?.message ?? 'Failed to create'),
  });

  const onSubmit = (values: CreateBuildingRequest) => {
    const landlordId = keycloak.subject ?? '00000000-0000-0000-0000-000000000000';
    createMut.mutate({ ...values, landlordId });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Properties</Title>
          <Text type="secondary">Manage your buildings and apartments</Text>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Property
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={data ?? []}
        pagination={{ pageSize: 10 }}
        columns={[
          { 
            title: 'Property Name', 
            dataIndex: 'name', 
            render: (v, r) => (
              <Space>
                <div style={{ background: '#E0E7FF', padding: 8, borderRadius: 8, color: '#1E3A8A' }}>
                  <HomeOutlined />
                </div>
                <div>
                  <Link to={`/buildings/${r.id}`} style={{ fontWeight: 600 }}>{v}</Link>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>{r.address}</div>
                </div>
              </Space>
            )
          },
          { title: 'County', dataIndex: 'county' },
          { 
            title: 'Units', 
            dataIndex: 'totalUnits',
            render: (v) => <Tag color="blue">{v} units</Tag>
          },
          { 
            title: 'Status', 
            render: () => <Tag color="green">Active</Tag>
          },
        ]}
      />

      <Modal
        title="Add New Property"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMut.isPending}
        okText="Create Property"
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} style={{ marginTop: 20 }}>
          <Form.Item name="name" label="Property Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="e.g. Kilimani Heights" />
          </Form.Item>
          <Form.Item name="address" label="Physical Address" rules={[{ required: true }]}>
            <Input size="large" placeholder="e.g. Wood Avenue" />
          </Form.Item>
          <Form.Item name="county" label="County" rules={[{ required: true }]}>
            <Input size="large" placeholder="e.g. Nairobi" />
          </Form.Item>
          <Form.Item name="city" label="City / Town">
            <Input size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
