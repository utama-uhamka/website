import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { PageHeader } from '../components/ui';
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiLoader,
} from 'react-icons/fi';
import { changePasswordAsync, clearError } from '../store/authSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});

  // Handle errors from redux
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { label: 'Sangat Lemah', color: 'bg-red-500', textColor: 'text-red-500' };
      case 2:
        return { label: 'Lemah', color: 'bg-orange-500', textColor: 'text-orange-500' };
      case 3:
        return { label: 'Cukup', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
      case 4:
        return { label: 'Kuat', color: 'bg-green-500', textColor: 'text-green-500' };
      case 5:
        return { label: 'Sangat Kuat', color: 'bg-primary', textColor: 'text-primary' };
      default:
        return { label: '', color: 'bg-gray-200', textColor: 'text-gray-500' };
    }
  };

  const passwordStrength = checkPasswordStrength(formData.new_password);
  const strengthInfo = getStrengthLabel(passwordStrength);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.current_password) {
      newErrors.current_password = 'Password saat ini harus diisi';
    }
    if (!formData.new_password) {
      newErrors.new_password = 'Password baru harus diisi';
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password minimal 8 karakter';
    }
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Konfirmasi password harus diisi';
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = 'Password tidak cocok';
    }
    if (formData.current_password === formData.new_password && formData.new_password) {
      newErrors.new_password = 'Password baru harus berbeda dengan password saat ini';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      await dispatch(
        changePasswordAsync({
          current_password: formData.current_password,
          new_password: formData.new_password,
        })
      ).unwrap();
      toast.success('Password berhasil diubah');
      setFormData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      // Error handled by effect
    } finally {
      setFormLoading(false);
    }
  };

  const passwordRequirements = [
    { met: formData.new_password.length >= 8, text: 'Minimal 8 karakter' },
    { met: /[a-z]/.test(formData.new_password), text: 'Huruf kecil (a-z)' },
    { met: /[A-Z]/.test(formData.new_password), text: 'Huruf besar (A-Z)' },
    { met: /[0-9]/.test(formData.new_password), text: 'Angka (0-9)' },
    { met: /[^a-zA-Z0-9]/.test(formData.new_password), text: 'Karakter khusus (!@#$%^&*)' },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Pengaturan"
        subtitle="Kelola pengaturan akun Anda"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Pengaturan' },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FiLock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Ubah Password</h3>
                <p className="text-sm text-gray-500">Perbarui password akun Anda secara berkala</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Saat Ini <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.current_password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan password saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.current_password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={14} />
                    {errors.current_password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.new_password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.new_password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={14} />
                    {errors.new_password}
                  </p>
                )}
                {formData.new_password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Kekuatan Password:</span>
                      <span className={`text-sm font-medium ${strengthInfo.textColor}`}>
                        {strengthInfo.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength ? strengthInfo.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Konfirmasi password baru"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle size={14} />
                    {errors.confirm_password}
                  </p>
                )}
                {formData.confirm_password &&
                  formData.new_password === formData.confirm_password && (
                    <p className="mt-1 text-sm text-green-500 flex items-center gap-1">
                      <FiCheckCircle size={14} />
                      Password cocok
                    </p>
                  )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {formLoading ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <FiLock className="w-5 h-5" />
                  )}
                  {formLoading ? 'Mengubah Password...' : 'Ubah Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiShield className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Persyaratan Password</h4>
            </div>

            <ul className="space-y-3">
              {passwordRequirements.map((req, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    formData.new_password
                      ? req.met
                        ? 'text-green-600'
                        : 'text-gray-500'
                      : 'text-gray-500'
                  }`}
                >
                  {formData.new_password ? (
                    req.met ? (
                      <FiCheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  )}
                  {req.text}
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex gap-3">
                <FiInfo className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Tips Keamanan</p>
                  <ul className="mt-2 text-sm text-amber-700 space-y-1">
                    <li>• Jangan gunakan password yang sama dengan akun lain</li>
                    <li>• Ubah password secara berkala (3-6 bulan)</li>
                    <li>• Jangan bagikan password kepada siapapun</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
