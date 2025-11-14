import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiEye, FiCalendar } from 'react-icons/fi';
import EmployeeModal from './EmployeeModal';
import EmployeeDetail from './EmployeeDetail';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Ahmad Rizki', email: 'ahmad.rizki@utama.com', phone: '081234567890', position: 'Manager IT', department: 'IT', campus: 'Campus Pusat', joinDate: '2022-01-15', status: 'Active' },
    { id: 2, name: 'Siti Nurhaliza', email: 'siti.nurhaliza@utama.com', phone: '081234567891', position: 'HR Specialist', department: 'Human Resources', campus: 'Campus Pusat', joinDate: '2021-06-10', status: 'Active' },
    { id: 3, name: 'Budi Santoso', email: 'budi.santoso@utama.com', phone: '081234567892', position: 'Technician', department: 'IT', campus: 'Campus Bandung', joinDate: '2023-03-20', status: 'Active' },
    { id: 4, name: 'Eka Putri', email: 'eka.putri@utama.com', phone: '081234567893', position: 'Finance Officer', department: 'Finance', campus: 'Campus Pusat', joinDate: '2020-09-05', status: 'Active' },
    { id: 5, name: 'Reza Pratama', email: 'reza.pratama@utama.com', phone: '081234567894', position: 'Staff IT', department: 'IT', campus: 'Campus Pusat', joinDate: '2023-07-01', status: 'Inactive' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredEmployees = employees.filter(emp => {
    const matchSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAddEmployee = (employeeData) => {
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? { ...e, ...employeeData } : e));
    } else {
      const newEmployee = {
        id: Math.max(...employees.map(e => e.id), 0) + 1,
        ...employeeData,
      };
      setEmployees([...employees, newEmployee]);
    }
    setModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  if (selectedEmployee) {
    return (
      <EmployeeDetail
        employee={selectedEmployee}
        onBack={() => setSelectedEmployee(null)}
      />
    );
  }

  const statusColor = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Karyawan</h1>
          <p className="text-gray-500 mt-1">Kelola data karyawan dan absensi</p>
        </div>
        <button
          onClick={() => {
            setEditingEmployee(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus size={20} />
          Tambah Karyawan
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Karyawan</p>
          <p className="text-3xl font-bold text-primary">{employees.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Aktif</p>
          <p className="text-3xl font-bold text-green-600">{employees.filter(e => e.status === 'Active').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Tidak Aktif</p>
          <p className="text-3xl font-bold text-gray-600">{employees.filter(e => e.status === 'Inactive').length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cari Karyawan</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau email..."
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
                <option value="Active">Aktif</option>
                <option value="Inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Nama</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Posisi</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Departemen</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Kampus</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-800">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{employee.position}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.department}</td>
                  <td className="py-4 px-6 text-gray-600">{employee.campus}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{employee.email}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[employee.status]}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedEmployee(employee)}
                        className="p-2 hover:bg-blue-100 rounded transition-colors"
                        title="Lihat Detail & Absensi"
                      >
                        <FiEye size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingEmployee(employee);
                          setModalOpen(true);
                        }}
                        className="p-2 hover:bg-primary/10 rounded transition-colors"
                      >
                        <FiEdit2 size={16} className="text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
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

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Tidak ada karyawan yang sesuai dengan filter.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => {
            setModalOpen(false);
            setEditingEmployee(null);
          }}
          onSubmit={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeList;
