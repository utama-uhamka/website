import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const RoomDetail = ({ room, floor, building, onBack }) => {
  const [assets, setAssets] = useState([
    { id: 1, name: 'Meja Kerja', code: 'DSK-001', category: 'Furniture', condition: 'Good', status: 'Active' },
    { id: 2, name: 'Kursi Kantor', code: 'CHR-001', category: 'Furniture', condition: 'Good', status: 'Active' },
    { id: 3, name: 'AC Unit', code: 'AC-001', category: 'Elektronik', condition: 'Good', status: 'Active' },
    { id: 4, name: 'Proyektor', code: 'PRJ-001', category: 'Elektronik', condition: 'Fair', status: 'Active' },
  ]);

  const [activeTab, setActiveTab] = useState('assets');

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Good':
        return 'bg-green-100 text-green-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-800">{room.name}</h1>
          <p className="text-gray-500 mt-1">{building?.name} - {floor?.name}</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Kode Ruangan</p>
            <p className="text-lg font-semibold text-gray-800">{room.code}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Kapasitas</p>
            <p className="text-lg font-semibold text-gray-800">{room.capacity} Orang</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Status</p>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Aktif
            </span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Asset</p>
          <p className="text-3xl font-bold text-primary">{assets.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Kondisi Baik</p>
          <p className="text-3xl font-bold text-green-600">{assets.filter(a => a.condition === 'Good').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Perlu Perbaikan</p>
          <p className="text-3xl font-bold text-yellow-600">{assets.filter(a => a.condition !== 'Good').length}</p>
        </div>
      </div>

      {/* Asset List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiTrendingUp size={20} className="text-primary" />
            Daftar Asset
          </h3>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            <FiPlus size={18} />
            Tambah Asset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Asset</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kode</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategori</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Kondisi</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{asset.name}</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{asset.code}</td>
                  <td className="py-3 px-4 text-gray-600 text-sm">{asset.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(asset.condition)}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                        <FiEdit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-red-100 rounded transition-colors">
                        <FiTrash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
