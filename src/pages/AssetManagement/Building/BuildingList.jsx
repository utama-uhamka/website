import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiChevronRight } from 'react-icons/fi';
import BuildingModal from './BuildingModal';

const BuildingList = ({ campusId, onSelectBuilding }) => {
  const [buildings, setBuildings] = useState([
    { id: 1, name: 'Gedung A', floors: 5, rooms: 30, assets: 120 },
    { id: 2, name: 'Gedung B', floors: 4, rooms: 24, assets: 95 },
    { id: 3, name: 'Gedung C', floors: 3, rooms: 18, assets: 75 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);

  const handleAddBuilding = (buildingData) => {
    if (editingBuilding) {
      setBuildings(buildings.map(b => b.id === editingBuilding.id ? { ...b, ...buildingData } : b));
    } else {
      const newBuilding = {
        id: Math.max(...buildings.map(b => b.id), 0) + 1,
        ...buildingData,
        floors: 0,
        rooms: 0,
        assets: 0,
      };
      setBuildings([...buildings, newBuilding]);
    }
    setModalOpen(false);
    setEditingBuilding(null);
  };

  const handleDeleteBuilding = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus gedung ini?')) {
      setBuildings(buildings.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daftar Gedung</h2>
          <p className="text-gray-500 mt-1">Kelola gedung dan lantai</p>
        </div>
        <button
          onClick={() => {
            setEditingBuilding(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus size={20} />
          Tambah Gedung
        </button>
      </div>

      {/* Building Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {buildings.map((building) => (
          <div
            key={building.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 cursor-pointer group"
            onClick={() => onSelectBuilding && onSelectBuilding(building)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">{building.name}</h3>
                <p className="text-sm text-gray-500">ID: {building.id}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingBuilding(building);
                  setModalOpen(true);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <FiEdit2 size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-y border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{building.floors}</p>
                <p className="text-xs text-gray-500">Lantai</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{building.rooms}</p>
                <p className="text-xs text-gray-500">Ruangan</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{building.assets}</p>
                <p className="text-xs text-gray-500">Asset</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBuilding(building.id);
                }}
                className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Hapus
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBuilding && onSelectBuilding(building);
                }}
                className="flex-1 text-primary hover:bg-primary/10 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-1"
              >
                Detail <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {buildings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Belum ada gedung. Klik tombol "Tambah Gedung" untuk memulai.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <BuildingModal
          building={editingBuilding}
          onClose={() => {
            setModalOpen(false);
            setEditingBuilding(null);
          }}
          onSubmit={handleAddBuilding}
        />
      )}
    </div>
  );
};

export default BuildingList;
