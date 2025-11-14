import { useState } from 'react';
import CampusList from './CampusList';
import CampusDetail from './CampusDetail';

const CampusPage = () => {
  const [selectedCampus, setSelectedCampus] = useState(null);

  return (
    <div>
      {selectedCampus ? (
        <CampusDetail
          campus={selectedCampus}
          onBack={() => setSelectedCampus(null)}
        />
      ) : (
        <CampusList onSelectCampus={setSelectedCampus} />
      )}
    </div>
  );
};

export default CampusPage;
