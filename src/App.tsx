import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Buildings from './pages/Buildings';
import BuildingDetail from './pages/BuildingDetail';
import Tenants from './pages/Tenants';
import Leases from './pages/Leases';
import VacantUnits from './pages/VacantUnits';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="buildings" element={<Buildings />} />
        <Route path="buildings/:id" element={<BuildingDetail />} />
        <Route path="vacant" element={<VacantUnits />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="leases" element={<Leases />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
