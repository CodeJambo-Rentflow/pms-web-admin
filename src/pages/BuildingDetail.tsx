import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Tag, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBuilding } from '../api/buildings';
import { listUnitsByBuilding, createUnit, type CreateUnitRequest, type UnitStatus } from '../api/units';

const statusColor: Record<UnitStatus, string> = {
  VACANT: 'orange',
  OCCUPIED: 'green',
  MAINTENANCE: 'red',
};

export default function BuildingDetail() {
  const { id = '' } = useParams();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<CreateUnitRequest>();
  const qc = useQueryClient();

  const building = useQuery({ queryKey: ['building', id], queryFn: () => getBuilding(id) });
  const units = useQuery({ queryKey: ['units', id], queryFn: () => listUnitsByBuilding(id) });

  const createMut = useMutation({
    mutationFn: (req: CreateUnitRequest) => createUnit(id, req),
    onSuccess: () => {
      message.success('Unit added');
      qc.invalidateQueries({ queryKey: ['units', id] });
      qc.invalidateQueries({ queryKey: ['building', id] });
      setOpen(false);
      form.resetFields();
    },
    onError: (e: any) => message.error(e?.response?.data?.error?.message ?? 'Failed to add'),
  });

  return (
    <div>
      <h2>{building.data?.name}</h2>
      <p style={{ color: '#6b7280' }}>{building.data?.address}, {building.data?.county}</p>

      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <span>Total units: {building.data?.totalUnits ?? 0}</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Unit
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={units.isLoading}
        dataSource={units.data ?? []}
        columns={[
          { title: 'Unit #', dataIndex: 'unitNumber' },
          { title: 'Type', dataIndex: 'type' },
          { title: 'Rent (KES)', dataIndex: 'monthlyRent', render: (v: number) => (v / 100).toLocaleString() },
          { title: 'Beds', dataIndex: 'bedrooms' },
          { title: 'Status', dataIndex: 'status', render: (s: UnitStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
        ]}
      />

      <Modal
        title="Add Unit"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createMut.isPending}
      >
        <Form form={form} layout="vertical" onFinish={(v) => createMut.mutate(v)}>
          <Form.Item name="unitNumber" label="Unit Number" rules={[{ required: true }]}>
            <Input placeholder="e.g. A3" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'BEDSITTER', label: 'Bedsitter' },
                { value: 'STUDIO', label: 'Studio' },
                { value: 'ONE_BR', label: '1 Bedroom' },
                { value: 'TWO_BR', label: '2 Bedroom' },
                { value: 'THREE_BR', label: '3 Bedroom' },
              ]}
            />
          </Form.Item>
          <Form.Item name="monthlyRent" label="Monthly Rent (cents)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="4500000 = KES 45,000" />
          </Form.Item>
          <Form.Item name="bedrooms" label="Bedrooms">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="bathrooms" label="Bathrooms">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
