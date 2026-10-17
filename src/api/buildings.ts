import { apiClient } from './client';

export interface Building {
  id: string;
  landlordId: string;
  name: string;
  address: string;
  county: string;
  city?: string;
  postalCode?: string;
  description?: string;
  totalUnits: number;
  createdAt: string;
}

export interface CreateBuildingRequest {
  landlordId: string;
  name: string;
  address: string;
  county: string;
  city?: string;
  postalCode?: string;
  description?: string;
}

export async function listBuildings(): Promise<Building[]> {
  const { data } = await apiClient.get<Building[]>('/api/v1/buildings');
  return data;
}

export async function createBuilding(req: CreateBuildingRequest): Promise<Building> {
  const { data } = await apiClient.post<Building>('/api/v1/buildings', req);
  return data;
}

export async function getBuilding(id: string): Promise<Building> {
  const { data } = await apiClient.get<Building>(`/api/v1/buildings/${id}`);
  return data;
}
