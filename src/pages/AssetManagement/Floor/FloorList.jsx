import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import RoomList from '../Room/RoomList';

const FloorList = ({ building, onBack, floors: initialFloors }) => {
  const [floors] = useState(initialFloors || []);
  const [selectedFloor, setSelectedFloor] = useState(null);

  if (selectedFloor) {
    return (
      <RoomList
        floor={selectedFloor}
        building={building}
        onBack={() => setSelectedFloor(null)}
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
          <h1 className="text-3xl font-bold text-gray-800">Daftar Lantai</h1>
          <p className="text-gray-500 mt-1">{building?.name}</p>
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

      {/* Floor Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Lantai-Lantai</h3>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            <FiPlus size={18} />
            Tambah Lantai
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {floors.map((floor) => (
            <div
              key={floor.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedFloor(floor)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">{floor.name}</h4>
                  <p className="text-sm text-gray-500">ID: {floor.id}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FiEdit2 size={18} className="text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{floor.rooms}</p>
                  <p className="text-xs text-gray-500">Ruangan</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{floor.assets}</p>
                  <p className="text-xs text-gray-500">Asset</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Hapus
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFloor(floor);
                  }}
                  className="flex-1 text-primary hover:bg-primary/10 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorList;
