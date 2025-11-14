import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const BuildingModal = ({ building, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    year_built: new Date().getFullYear(),
    total_floors: 0,
  });

  useEffect(() => {
    if (building) {
      setFormData({
        name: building.name || '',
        code: building.code || '',
        year_built: building.year_built || new Date().getFullYear(),
        total_floors: building.floors || 0,
      });
    }
  }, [building]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year_built' || name === 'total_floors' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {building ? 'Edit Gedung' : 'Tambah Gedung Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Gedung
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Gedung A"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kode Gedung
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Contoh: GDG-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahun Dibangun
            </label>
            <input
              type="number"
              name="year_built"
              value={formData.year_built}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Lantai
            </label>
            <input
              type="number"
              name="total_floors"
              value={formData.total_floors}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {building ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuildingModal;
