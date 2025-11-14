import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiDownload } from 'react-icons/fi';
import AssetModal from './AssetModal';

const AssetList = () => {
  const [assets, setAssets] = useState([
    { id: 1, name: 'Meja Kerja', code: 'DSK-001', category: 'Furniture', location: 'Gedung A - Lantai 1 - Ruangan 101', condition: 'Good', status: 'Active', value: '2.500.000' },
    { id: 2, name: 'Kursi Kantor', code: 'CHR-001', category: 'Furniture', location: 'Gedung A - Lantai 1 - Ruangan 101', condition: 'Good', status: 'Active', value: '1.200.000' },
    { id: 3, name: 'AC Unit', code: 'AC-001', category: 'Elektronik', location: 'Gedung A - Lantai 1 - Ruangan 102', condition: 'Good', status: 'Active', value: '5.000.000' },
    { id: 4, name: 'Proyektor', code: 'PRJ-001', category: 'Elektronik', location: 'Gedung A - Lantai 2 - Ruangan 201', condition: 'Fair', status: 'Active', value: '8.000.000' },
    { id: 5, name: 'Whiteboard', code: 'WB-001', category: 'Perlengkapan', location: 'Gedung B - Lantai 1 - Ruangan 301', condition: 'Good', status: 'Active', value: '500.000' },
    { id: 6, name: 'Server Rack', code: 'SRV-001', category: 'IT Equipment', location: 'Gedung C - Lantai 3 - Ruangan 501', condition: 'Good', status: 'Active', value: '25.000.000' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['Furniture', 'Elektronik', 'Perlengkapan', 'IT Equipment'];

  const filteredAssets = assets.filter(asset => {
    const matchSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       asset.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = filterCategory === 'all' || asset.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const handleAddAsset = (assetData) => {
    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? { ...a, ...assetData } : a));
    } else {
      const newAsset = {
        id: Math.max(...assets.map(a => a.id), 0) + 1,
        ...assetData,
      };
      setAssets([...assets, newAsset]);
    }
    setModalOpen(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus asset ini?')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Asset</h1>
          <p className="text-gray-500 mt-1">Kelola semua asset di seluruh kampus</p>
        </div>
        <button
          onClick={() => {
            setEditingAsset(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus size={20} />
          Tambah Asset
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <p className="text-3xl font-bold text-yellow-600">{assets.filter(a => a.condition === 'Fair').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Nilai</p>
          <p className="text-2xl font-bold text-primary">Rp {(assets.reduce((sum, a) => sum + parseInt(a.value.replace(/\./g, '')), 0) / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Asset</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <div className="flex items-center gap-2">
              <FiFilter size={20} className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Kategori</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors w-full sm:w-auto justify-center">
              <FiDownload size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama Asset</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Kategori</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Lokasi</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Kondisi</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nilai</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-800">{asset.name}</p>
                      <p className="text-sm text-gray-500">{asset.code}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{asset.category}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{asset.location}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(asset.condition)}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-800">Rp {asset.value}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingAsset(asset);
                          setModalOpen(true);
                        }}
                        className="p-2 hover:bg-primary/10 rounded transition-colors"
                      >
                        <FiEdit2 size={16} className="text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="p-2 hover:bg-red-100 rounded transition-colors"
                      >
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

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Tidak ada asset yang sesuai dengan filter.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <AssetModal
          asset={editingAsset}
          onClose={() => {
            setModalOpen(false);
            setEditingAsset(null);
          }}
          onSubmit={handleAddAsset}
        />
      )}
    </div>
  );
};

export default AssetList;
