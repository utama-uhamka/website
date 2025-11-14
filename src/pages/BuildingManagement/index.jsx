import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import CampusList from '../AssetManagement/Campus/CampusList';
import CampusDetail from '../AssetManagement/Campus/CampusDetail';
import BuildingDetail from '../AssetManagement/Building/BuildingDetail';
import FloorList from '../AssetManagement/Floor/FloorList';
import RoomList from '../AssetManagement/Room/RoomList';

const BuildingManagement = () => {
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Campus view
  if (!selectedCampus && !selectedBuilding && !selectedFloor) {
    return (
      <MainLayout>
        <CampusList onSelectCampus={setSelectedCampus} />
      </MainLayout>
    );
  }

  // Campus detail view
  if (selectedCampus && !selectedBuilding && !selectedFloor) {
    return (
      <MainLayout>
        <CampusDetail
          campus={selectedCampus}
          onBack={() => setSelectedCampus(null)}
        />
      </MainLayout>
    );
  }

  // Building detail view
  if (selectedBuilding && !selectedFloor) {
    return (
      <MainLayout>
        <BuildingDetail
          building={selectedBuilding}
          onBack={() => setSelectedBuilding(null)}
        />
      </MainLayout>
    );
  }

  // Floor view
  if (selectedFloor) {
    return (
      <MainLayout>
        <RoomList
          floor={selectedFloor}
          building={selectedBuilding}
          onBack={() => setSelectedFloor(null)}
        />
      </MainLayout>
    );
  }

  return null;
};

export default BuildingManagement;
