import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { PageHeader, FormInput, AvatarWithFallback } from '../components/ui';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiBriefcase,
  FiShield,
  FiLoader,
} from 'react-icons/fi';
import { getProfileAsync, updateProfileAsync, clearError } from '../store/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Load profile on mount
  useEffect(() => {
    dispatch(getProfileAsync());
  }, [dispatch]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      await dispatch(updateProfileAsync(formData)).unwrap();
      toast.success('Profile berhasil diperbarui');
      setIsEditing(false);
    } catch (err) {
      // Error handled by effect
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
  };

  if (loading && !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

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
                disabled={formLoading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <FiX className="w-4 h-4" />
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={formLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {formLoading ? (
                  <FiLoader className="w-4 h-4 animate-spin" />
                ) : (
                  <FiSave className="w-4 h-4" />
                )}
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
                <AvatarWithFallback
                  src={user?.photo_1}
                  alt={user?.full_name}
                  size={128}
                  className="shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                    <FiCamera className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mt-4">{formData.full_name || '-'}</h2>
              <p className="text-gray-500">{user?.role?.role_name || '-'}</p>
              <span className="mt-2 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {user?.role?.role_name || 'User'}
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
                  <p className="font-medium text-gray-800">{formData.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiPhone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-500">Telepon</p>
                  <p className="font-medium text-gray-800">{formData.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiBriefcase className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-500">Unit</p>
                  <p className="font-medium text-gray-800">{user?.campus?.campus_name || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FiCalendar className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-gray-500">Bergabung</p>
                  <p className="font-medium text-gray-800">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '-'}
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
                name="full_name"
                value={formData.full_name}
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
              <div className="flex">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                    <FiShield className="w-4 h-4 text-primary" />
                    <span className="text-gray-800 font-medium">{user?.role?.role_name || '-'}</span>
                  </div>
                </div>
              </div>
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
              Informasi Penempatan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit / Kampus
                </label>
                <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-800">{user?.campus?.campus_name || '-'}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift
                </label>
                <div className="px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-800">{user?.shift?.shift_name || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Status Akun</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    user?.is_active === 1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {user?.is_active === 1 ? 'Aktif' : 'Nonaktif'}
                </span>
                <p className="text-sm text-gray-500 mt-2">Status Akun</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-blue-600">{user?.role?.role_name || '-'}</p>
                <p className="text-sm text-gray-500 mt-2">Role</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {user?.createdAt
                    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                    : 0}
                </p>
                <p className="text-sm text-gray-500 mt-2">Hari Bergabung</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
