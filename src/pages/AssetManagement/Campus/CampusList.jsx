import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiChevronRight, FiMapPin } from 'react-icons/fi';
import CampusModal from './CampusModal';

const CampusList = ({ onSelectCampus }) => {
  const [campuses, setCampuses] = useState([
    { id: 1, name: 'Campus Pusat', location: 'Jakarta', buildings: 5, employees: 120 },
    { id: 2, name: 'Campus Bandung', location: 'Bandung', buildings: 3, employees: 85 },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState(null);

  const handleAddCampus = (campusData) => {
    if (editingCampus) {
      setCampuses(campuses.map(c => c.id === editingCampus.id ? { ...c, ...campusData } : c));
    } else {
      const newCampus = {
        id: Math.max(...campuses.map(c => c.id), 0) + 1,
        ...campusData,
        buildings: 0,
        employees: 0,
      };
      setCampuses([...campuses, newCampus]);
    }
    setModalOpen(false);
    setEditingCampus(null);
  };

  const handleEditCampus = (campus) => {
    setEditingCampus(campus);
    setModalOpen(true);
  };

  const handleDeleteCampus = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kampus ini?')) {
      setCampuses(campuses.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Kampus</h1>
          <p className="text-gray-500 mt-1">Kelola data kampus dan gedung</p>
        </div>
        <button
          onClick={() => {
            setEditingCampus(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus size={20} />
          Tambah Kampus
        </button>
      </div>

      {/* Campus List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campuses.map((campus) => (
          <div
            key={campus.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 cursor-pointer"
            onClick={() => onSelectCampus(campus)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiMapPin className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{campus.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiMapPin size={14} />
                    {campus.location}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCampus(campus);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiEdit2 size={18} className="text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Gedung</p>
                <p className="text-2xl font-bold text-gray-800">{campus.buildings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Karyawan</p>
                <p className="text-2xl font-bold text-gray-800">{campus.employees}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCampus(campus.id);
              }}
              className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors"
            >
              <FiTrash2 size={18} />
              Hapus
            </button>
          </div>
        ))}
      </div>

      {campuses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Belum ada kampus. Klik tombol "Tambah Kampus" untuk memulai.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <CampusModal
          campus={editingCampus}
          onClose={() => {
            setModalOpen(false);
            setEditingCampus(null);
          }}
          onSubmit={handleAddCampus}
        />
      )}
    </div>
  );
};

export default CampusList;
