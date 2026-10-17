import { useState } from 'react';
import { Button, Table, Modal, Form, Input, message, Space, Typography, Tag, Avatar } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listTenants, createTenant, type CreateTenantRequest } from '../api/tenants';

const { Title, Text } = Typography;

export default function Tenants() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<CreateTenantRequest>();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['tenants'], queryFn: listTenants });

  const createMut = useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      message.success('Tenant created successfully');
      qc.invalidateQueries({ queryKey: ['tenants'] });
      setOpen(false);
      form.resetFields();
    },
    onError: (e: any) => message.error(e?.response?.data?.error?.message ?? 'Failed to create tenant'),
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Tenants</Title>
          <Text type="secondary">Manage your tenant directory and contact information</Text>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Tenant
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={data ?? []}
        pagination={{ pageSize: 10 }}
        columns={[
          { 
            title: 'Tenant Name', 
            dataIndex: 'fullName', 
            render: (v, r) => (
              <Space>
                <Avatar style={{ backgroundColor: '#E0E7FF', color: '#1E3A8A' }} icon={<UserOutlined />} />
                <div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>ID: {r.id.split('-')[0]}...</div>
                </div>
              </Space>
            )
          },
          { 
            title: 'Email Address', 
            dataIndex: 'email',
            render: (v) => v || <Text type="secondary">Not provided</Text>
          },
          { 
            title: 'Status', 
            dataIndex: 'status',
            render: (s: string) => (
              <Tag color={s === 'ACTIVE' ? 'green' : 'default'}>
                {s}
              </Tag>
            )
          },
        ]}
      />

      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Add New Tenant</Title>}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMut.isPending}
        okText="Create Tenant"
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={(v) => createMut.mutate(v)} style={{ marginTop: 20 }}>
          <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="e.g. Jane Wanjiku" />
          </Form.Item>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
              <Input size="large" placeholder="+254712345678" />
            </Form.Item>
            <Form.Item name="mpesaPhone" label="M-Pesa Number (Optional)">
              <Input size="large" placeholder="+254712345678" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="email" label="Email Address">
              <Input size="large" type="email" placeholder="jane@example.com" />
            </Form.Item>
            <Form.Item name="nationalId" label="National ID" rules={[{ required: true }]}>
              <Input size="large" placeholder="e.g. 12345678" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
