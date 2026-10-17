import { apiClient } from './client';

export type LeaseStatus = 'DRAFT' | 'ACTIVE' | 'ENDED' | 'TERMINATED' | 'RENEWED';

export interface Lease {
  id: string;
  leaseNumber: string;
  tenantId: string;
  unitId: string;
  buildingId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  currency: string;
  depositAmount: number;
  paymentDueDay: number;
  status: LeaseStatus;
  createdAt: string;
}

export interface CreateLeaseRequest {
  tenantId: string;
  unitId: string;
  buildingId: string;
  leaseNumber: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  depositAmount?: number;
  paymentDueDay?: number;
}

export async function listLeases(): Promise<Lease[]> {
  const { data } = await apiClient.get<Lease[]>('/api/v1/leases');
  return data;
}

export async function createLease(req: CreateLeaseRequest): Promise<Lease> {
  const { data } = await apiClient.post<Lease>('/api/v1/leases', req);
  return data;
}

export async function terminateLease(id: string, moveOutDate: string, reason: string): Promise<Lease> {
  const { data } = await apiClient.post<Lease>(`/api/v1/leases/${id}/terminate`, {
    moveOutDate,
    reason,
  });
  return data;
}
