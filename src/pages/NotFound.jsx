import { useNavigate } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative elements - now inside relative container with overflow-hidden */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full translate-x-1/3 translate-y-1/3"></div>

      <div className="text-center relative z-10">
        {/* 404 Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
            <FiAlertCircle className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
          Silakan kembali ke dashboard.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <FiHome className="w-5 h-5" />
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
