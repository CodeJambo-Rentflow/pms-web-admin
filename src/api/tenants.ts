import { apiClient } from './client';

export interface Tenant {
  id: string;
  fullName: string;
  email?: string;
  status: string;
  createdAt: string;
}

export interface CreateTenantRequest {
  fullName: string;
  phone: string;
  mpesaPhone?: string;
  email?: string;
  nationalId: string;
}

export async function listTenants(): Promise<Tenant[]> {
  const { data } = await apiClient.get<Tenant[]>('/api/v1/tenants');
  return data;
}

export async function createTenant(req: CreateTenantRequest): Promise<Tenant> {
  const { data } = await apiClient.post<Tenant>('/api/v1/tenants', req);
  return data;
}
