import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import FloorList from '../Floor/FloorList';

const BuildingDetail = ({ building, onBack }) => {
  const [floors, setFloors] = useState([
    { id: 1, name: 'Lantai 1', rooms: 6, assets: 24 },
    { id: 2, name: 'Lantai 2', rooms: 6, assets: 24 },
    { id: 3, name: 'Lantai 3', rooms: 6, assets: 24 },
    { id: 4, name: 'Lantai 4', rooms: 6, assets: 24 },
    { id: 5, name: 'Lantai 5', rooms: 6, assets: 24 },
  ]);

  const [selectedFloor, setSelectedFloor] = useState(null);

  if (selectedFloor) {
    return (
      <FloorList
        building={building}
        onBack={() => setSelectedFloor(null)}
        floors={floors}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{building.name}</h1>
          <p className="text-gray-500 mt-1">Kode: {building.code || 'N/A'}</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Tahun Dibangun</p>
            <p className="text-lg font-semibold text-gray-800">{building.year_built || new Date().getFullYear()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Total Lantai</p>
            <p className="text-lg font-semibold text-gray-800">{floors.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Total Ruangan</p>
            <p className="text-lg font-semibold text-gray-800">{floors.reduce((sum, f) => sum + (f.rooms || 0), 0)}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Lantai</p>
          <p className="text-3xl font-bold text-primary">{floors.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Ruangan</p>
          <p className="text-3xl font-bold text-primary">{floors.reduce((sum, f) => sum + (f.rooms || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Asset</p>
          <p className="text-3xl font-bold text-primary">{floors.reduce((sum, f) => sum + (f.assets || 0), 0)}</p>
        </div>
      </div>

      {/* Floor List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Daftar Lantai</h3>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            <FiPlus size={18} />
            Tambah Lantai
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {floors.map((floor) => (
            <div
              key={floor.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedFloor(floor)}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{floor.name}</h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <FiEdit2 size={16} className="text-gray-600" />
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>Ruangan: <span className="font-medium">{floor.rooms}</span></p>
                <p>Asset: <span className="font-medium">{floor.assets}</span></p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-full text-red-600 hover:bg-red-50 py-2 rounded transition-colors text-sm font-medium"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildingDetail;
