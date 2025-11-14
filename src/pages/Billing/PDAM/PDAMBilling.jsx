import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiDownload, FiDroplet } from 'react-icons/fi';
import PDAMModal from './PDAMModal';

const PDAMBilling = () => {
  const [billings, setBillings] = useState([
    { id: 1, campus: 'Campus Pusat', meter: 'PDAM-001', month: 'November 2024', usage: 350, rate: 15000, total: 5250000, status: 'Paid', dueDate: '2024-11-30', paymentDate: '2024-11-28' },
    { id: 2, campus: 'Campus Bandung', meter: 'PDAM-002', month: 'November 2024', usage: 200, rate: 15000, total: 3000000, status: 'Pending', dueDate: '2024-11-30', paymentDate: null },
    { id: 3, campus: 'Campus Pusat', meter: 'PDAM-001', month: 'October 2024', usage: 320, rate: 15000, total: 4800000, status: 'Paid', dueDate: '2024-10-31', paymentDate: '2024-10-30' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBilling, setEditingBilling] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredBillings = billings.filter(billing => {
    const matchSearch = billing.campus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       billing.meter.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || billing.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAddBilling = (billingData) => {
    if (editingBilling) {
      setBillings(billings.map(b => b.id === editingBilling.id ? { ...b, ...billingData } : b));
    } else {
      const newBilling = {
        id: Math.max(...billings.map(b => b.id), 0) + 1,
        ...billingData,
      };
      setBillings([...billings, newBilling]);
    }
    setModalOpen(false);
    setEditingBilling(null);
  };

  const handleDeleteBilling = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tagihan ini?')) {
      setBillings(billings.filter(b => b.id !== id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalBilling = billings.reduce((sum, b) => sum + b.total, 0);
  const paidBilling = billings.filter(b => b.status === 'Paid').reduce((sum, b) => sum + b.total, 0);
  const pendingBilling = billings.filter(b => b.status === 'Pending' || b.status === 'Overdue').reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiDroplet className="text-blue-500" size={28} />
            Tagihan Air (PDAM)
          </h2>
        </div>
        <button
          onClick={() => {
            setEditingBilling(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus size={20} />
          Tambah Tagihan
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Tagihan</p>
          <p className="text-2xl font-bold text-primary">Rp {(totalBilling / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Sudah Dibayar</p>
          <p className="text-2xl font-bold text-green-600">Rp {(paidBilling / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Belum Dibayar</p>
          <p className="text-2xl font-bold text-red-600">Rp {(pendingBilling / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Tagihan</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan kampus atau meter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex items-center gap-2">
              <FiFilter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Status</option>
                <option value="Paid">Lunas</option>
                <option value="Pending">Menunggu</option>
                <option value="Overdue">Jatuh Tempo</option>
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

      {/* Billing Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Kampus</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Meter</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Bulan</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Penggunaan (m³)</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Total</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredBillings.map((billing) => (
                <tr key={billing.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-800">{billing.campus}</td>
                  <td className="py-4 px-6 text-gray-600">{billing.meter}</td>
                  <td className="py-4 px-6 text-gray-600">{billing.month}</td>
                  <td className="py-4 px-6 text-gray-600">{billing.usage.toLocaleString()}</td>
                  <td className="py-4 px-6 font-semibold text-gray-800">Rp {(billing.total / 1000000).toFixed(1)}M</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(billing.status)}`}>
                      {billing.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBilling(billing);
                          setModalOpen(true);
                        }}
                        className="p-2 hover:bg-primary/10 rounded transition-colors"
                      >
                        <FiEdit2 size={16} className="text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteBilling(billing.id)}
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

      {filteredBillings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Tidak ada tagihan yang sesuai dengan filter.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <PDAMModal
          billing={editingBilling}
          onClose={() => {
            setModalOpen(false);
            setEditingBilling(null);
          }}
          onSubmit={handleAddBilling}
        />
      )}
    </div>
  );
};

export default PDAMBilling;
