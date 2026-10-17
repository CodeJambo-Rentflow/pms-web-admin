import { apiClient } from './client';

export type UnitType = 'BEDSITTER' | 'STUDIO' | 'ONE_BR' | 'TWO_BR' | 'THREE_BR' | 'FOUR_BR' | 'SHOP' | 'OFFICE' | 'WAREHOUSE';
export type UnitStatus = 'VACANT' | 'OCCUPIED' | 'MAINTENANCE';

export interface Unit {
  id: string;
  buildingId: string;
  unitNumber: string;
  type: UnitType;
  monthlyRent: number;
  currency: string;
  depositMonths: number;
  status: UnitStatus;
  vacantSince?: string;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  notes?: string;
  createdAt: string;
}

export interface CreateUnitRequest {
  unitNumber: string;
  type: UnitType;
  monthlyRent: number;
  depositMonths?: number;
  floor?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  notes?: string;
}

export interface VacantUnit {
  unitId: string;
  unitNumber: string;
  buildingId: string;
  buildingName: string;
  monthlyRent: number;
  currency: string;
  vacantSince: string;
  daysVacant: number;
}

export async function listUnitsByBuilding(buildingId: string): Promise<Unit[]> {
  const { data } = await apiClient.get<Unit[]>(`/api/v1/buildings/${buildingId}/units`);
  return data;
}

export async function createUnit(buildingId: string, req: CreateUnitRequest): Promise<Unit> {
  const { data } = await apiClient.post<Unit>(`/api/v1/buildings/${buildingId}/units`, req);
  return data;
}

export async function listVacantUnits(): Promise<VacantUnit[]> {
  const { data } = await apiClient.get<VacantUnit[]>('/api/v1/property-units/vacant');
  return data;
}
