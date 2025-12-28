import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MainLayout from '../layouts/MainLayout';
import { PageHeader, FormInput } from '../components/ui';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiBriefcase,
  FiShield,
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import { login } from '../store/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Muzifa Admin',
    email: user?.email || 'muzifa@utama.ac.id',
    phone: user?.phone || '081234567890',
    address: user?.address || 'Jakarta Timur, Indonesia',
    birthDate: user?.birthDate || '1990-01-15',
    position: user?.position || 'System Administrator',
    department: user?.department || 'IT Department',
    joinDate: user?.joinDate || '2020-03-01',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Update user in redux store
    dispatch(login({ ...user, ...formData }));
    setIsEditing(false);
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Profile berhasil diperbarui',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'Muzifa Admin',
      email: user?.email || 'muzifa@utama.ac.id',
      phone: user?.phone || '081234567890',
      address: user?.address || 'Jakarta Timur, Indonesia',
      birthDate: user?.birthDate || '1990-01-15',
      position: user?.position || 'System Administrator',
      department: user?.department || 'IT Department',
      joinDate: user?.joinDate || '2020-03-01',
    });
    setIsEditing(false);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Profile"
        subtitle="Kelola informasi profil Anda"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Profile' },
        ]}
        actions={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <FiEdit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FiX className="w-4 h-4" />
                Batal
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <FiSave className="w-4 h-4" />
                Simpan
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-5xl">
                    {formData.name?.charAt(0) || 'M'}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                    <FiCamera className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-4">{formData.name}</h2>
              <p className="text-gray-500">{formData.position}</p>
              <span className="mt-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                Admin
              </span>
            </div>

            {/* Quick Info */}
            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{formData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiPhone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500">Telepon</p>
                  <p className="font-medium text-gray-800">{formData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiBriefcase className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500">Departemen</p>
                  <p className="font-medium text-gray-800">{formData.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FiCalendar className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-500">Bergabung</p>
                  <p className="font-medium text-gray-800">
                    {new Date(formData.joinDate).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-primary" />
              Informasi Personal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nama Lengkap"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
              <FormInput
                label="No. Telepon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <FormInput
                label="Tanggal Lahir"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <div className="md:col-span-2">
                <FormInput
                  label="Alamat"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-6 flex items-center gap-2">
              <FiBriefcase className="w-5 h-5 text-primary" />
              Informasi Pekerjaan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Jabatan"
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <FormInput
                label="Departemen"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <FormInput
                label="Tanggal Bergabung"
                name="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <div className="flex items-end">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <FiShield className="w-4 h-4 text-primary" />
                    <span className="text-gray-800 font-medium">Administrator</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Statistik Aktivitas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">127</p>
                <p className="text-sm text-gray-500">Total Login</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-600">45</p>
                <p className="text-sm text-gray-500">Task Selesai</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-500">Report Dibuat</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">98%</p>
                <p className="text-sm text-gray-500">Kehadiran</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
