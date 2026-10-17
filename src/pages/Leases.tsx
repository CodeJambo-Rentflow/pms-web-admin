
import { useState } from 'react';
import { Table, Tag, Button, Modal, Form, Input, InputNumber, DatePicker, Select, message, Space, Typography } from 'antd';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { listLeases, createLease, type CreateLeaseRequest, type LeaseStatus } from '../api/leases';
import { listTenants } from '../api/tenants';
import { listBuildings } from '../api/buildings';

const { Title, Text } = Typography;

const statusColor: Record<LeaseStatus, string> = {
  DRAFT: 'default',
  ACTIVE: 'green',
  ENDED: 'default',
  TERMINATED: 'red',
  RENEWED: 'blue',
};

export default function Leases() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<any>();
  const qc = useQueryClient();

  const leases = useQuery({ queryKey: ['leases'], queryFn: listLeases });
  const tenants = useQuery({ queryKey: ['tenants'], queryFn: listTenants });
  const buildings = useQuery({ queryKey: ['buildings'], queryFn: listBuildings });

  const createMut = useMutation({
    mutationFn: (req: CreateLeaseRequest) => createLease(req),
    onSuccess: () => {
      message.success('Lease created successfully');
      qc.invalidateQueries({ queryKey: ['leases'] });
      setOpen(false);
      form.resetFields();
    },
    onError: (e: any) => message.error(e?.response?.data?.error?.message ?? 'Failed to create lease'),
  });

  const onSubmit = (values: any) => {
    // Note: For this MVP, we require the user to paste a Unit ID. 
    // In the future, we will replace this with a dropdown of vacant units.
    createMut.mutate({
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Leases</Title>
          <Text type="secondary">Track active agreements and occupancy</Text>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Create Lease
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={leases.isLoading}
        dataSource={leases.data ?? []}
        pagination={{ pageSize: 10 }}
        columns={[
          { 
            title: 'Lease Info', 
            dataIndex: 'leaseNumber', 
            render: (v, r) => (
              <Space>
                <div style={{ background: '#F3F4F6', padding: 8, borderRadius: 8, color: '#4B5563' }}>
                  <FileTextOutlined />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{v}</div>
                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                    {dayjs(r.startDate).format('MMM D, YYYY')} - {dayjs(r.endDate).format('MMM D, YYYY')}
                  </div>
                </div>
              </Space>
            )
          },
          { 
            title: 'Monthly Rent', 
            dataIndex: 'monthlyRent', 
            render: (v: number) => (
              <span style={{ fontWeight: 600, color: '#1E3A8A' }}>
                KES {(v / 100).toLocaleString()}
              </span>
            )
          },
          { 
            title: 'Status', 
            dataIndex: 'status', 
            render: (s: LeaseStatus) => <Tag color={statusColor[s]}>{s}</Tag> 
          },
        ]}
      />

      <Modal
        title={<Title level={4} style={{ margin: 0 }}>Create New Lease</Title>}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMut.isPending}
        okText="Create Lease"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit} style={{ marginTop: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="tenantId" label="Select Tenant" rules={[{ required: true }]}>
              <Select
                size="large"
                placeholder="Choose a tenant"
                options={(tenants.data ?? []).map((t) => ({ value: t.id, label: t.fullName }))}
              />
            </Form.Item>
            <Form.Item name="buildingId" label="Select Property" rules={[{ required: true }]}>
              <Select
                size="large"
                placeholder="Choose a building"
                options={(buildings.data ?? []).map((b) => ({ value: b.id, label: b.name }))}
              />
            </Form.Item>
          </div>

          {/* Temporary input until we build the "Select Vacant Unit" dropdown */}
          <Form.Item 
            name="unitId" 
            label="Unit ID (Paste UUID from Property page)" 
            rules={[{ required: true }]}
            tooltip="In the next phase, this will be a dropdown of vacant units."
          >
            <Input size="large" placeholder="e.g. 7e39c2ff-2ad0-4757-b5de-98a60ef4347e" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Form.Item name="leaseNumber" label="Lease Number" rules={[{ required: true }]}>
              <Input size="large" placeholder="LSE-2026-0001" />
            </Form.Item>
            <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
              <DatePicker size="large" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
              <DatePicker size="large" style={{ width: '100%' }} />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="monthlyRent" label="Monthly Rent (Cents)" rules={[{ required: true }]}>
              <InputNumber size="large" min={1} style={{ width: '100%' }} placeholder="4500000 = KES 45,000" />
            </Form.Item>
            <Form.Item name="depositAmount" label="Deposit Amount (Cents)">
              <InputNumber size="large" min={0} style={{ width: '100%' }} placeholder="9000000 = KES 90,000" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
