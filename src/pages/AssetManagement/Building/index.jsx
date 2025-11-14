import { useState } from 'react';
import BuildingList from './BuildingList';
import BuildingDetail from './BuildingDetail';

const BuildingPage = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  return (
    <div>
      {selectedBuilding ? (
        <BuildingDetail
          building={selectedBuilding}
          onBack={() => setSelectedBuilding(null)}
        />
      ) : (
        <BuildingList onSelectBuilding={setSelectedBuilding} />
      )}
    </div>
  );
};

export default BuildingPage;
