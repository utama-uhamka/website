import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const PDAMModal = ({ billing, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    campus: '',
    meter: '',
    month: '',
    usage: '',
    rate: 15000,
    status: 'Pending',
    dueDate: '',
    paymentDate: '',
  });

  const campuses = ['Campus Pusat', 'Campus Bandung', 'Campus Jakarta'];

  useEffect(() => {
    if (billing) {
      setFormData({
        campus: billing.campus || '',
        meter: billing.meter || '',
        month: billing.month || '',
        usage: billing.usage || '',
        rate: billing.rate || 15000,
        status: billing.status || 'Pending',
        dueDate: billing.dueDate || '',
        paymentDate: billing.paymentDate || '',
      });
    }
  }, [billing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'usage' || name === 'rate' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const total = (formData.usage || 0) * (formData.rate || 0);
    onSubmit({ ...formData, total });
  };

  const total = (formData.usage || 0) * (formData.rate || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {billing ? 'Edit Tagihan PDAM' : 'Tambah Tagihan PDAM Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kampus
              </label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Pilih Kampus</option>
                {campuses.map(campus => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Meter
              </label>
              <input
                type="text"
                name="meter"
                value={formData.meter}
                onChange={handleChange}
                placeholder="Contoh: PDAM-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bulan/Periode
              </label>
              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={handleChange}
                placeholder="Contoh: November 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penggunaan (m³)
              </label>
              <input
                type="number"
                name="usage"
                value={formData.usage}
                onChange={handleChange}
                placeholder="Contoh: 350"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarif Per m³ (Rp)
              </label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Pending">Menunggu</option>
                <option value="Paid">Lunas</option>
                <option value="Overdue">Jatuh Tempo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Jatuh Tempo
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Pembayaran
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Total Calculation */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Tagihan:</span>
              <span className="text-2xl font-bold text-primary">Rp {total.toLocaleString('id-ID')}</span>
            </div>
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
              {billing ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PDAMModal;
