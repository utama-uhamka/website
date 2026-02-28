import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DEEP_LINK_DOMAIN = import.meta.env.VITE_DEEP_LINK_DOMAIN || 'utamaapp.brainsia.com';
const DEEP_LINK_SCHEME = import.meta.env.VITE_DEEP_LINK_SCHEME || 'utamaapp';
const API_URL = import.meta.env.VITE_API_URL?.replace('/api/dashboard', '') || 'http://localhost:3000';

const TYPE_CONFIG = {
  item: {
    apiPath: '/api/public/item',
    appPath: 'app/item',
    fallbackText: 'Tekan tombol di bawah untuk membuka item di aplikasi Utama Apps.',
  },
  unit: {
    apiPath: '/api/public/unit',
    appPath: 'app/unit',
    fallbackText: 'Tekan tombol di bawah untuk membuka unit di aplikasi Utama Apps.',
  },
  event: {
    apiPath: '/api/public/event',
    appPath: 'app/event',
    fallbackText: 'Tekan tombol di bawah untuk membuka event di aplikasi Utama Apps.',
  },
};

const DeepLinkRedirect = ({ type = 'item' }) => {
  const { id } = useParams();
  const [showFallback, setShowFallback] = useState(false);
  const [data, setData] = useState(null);

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.item;
  const schemeFallback = `${DEEP_LINK_SCHEME}://${config.appPath}/${id}`;

  useEffect(() => {
    // Fetch data from API
    axios.get(`${API_URL}${config.apiPath}/${id}`)
      .then(res => {
        if (res.data.success) {
          setData(res.data.data);
        }
      })
      .catch(() => {});

    // Try to open the app via custom scheme
    window.location.href = schemeFallback;

    const timer = setTimeout(() => setShowFallback(true), 1500);
    return () => clearTimeout(timer);
  }, [id, config.apiPath, schemeFallback]);

  const getDisplayName = () => {
    if (!data) return 'Utama Apps';
    if (type === 'item') return data.item_name || 'Item';
    if (type === 'unit') return data.campus_name || 'Unit';
    if (type === 'event') return data.event_title || 'Event';
    return 'Utama Apps';
  };

  const getSubtitle = () => {
    if (!data) return null;
    if (type === 'item') return data.item_code;
    if (type === 'unit') return data.alamat;
    if (type === 'event') {
      if (!data.date) return data.tempat;
      const dateStr = new Date(data.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      return data.tempat ? `${dateStr} • ${data.tempat}` : dateStr;
    }
    return null;
  };

  const getBadge = () => {
    if (!data) return null;
    if (type === 'item') {
      const catName = data.category_item?.category_item_name;
      const catType = data.category_item?.type;
      return catName ? `${catName}${catType ? ` • ${catType}` : ''}` : null;
    }
    if (type === 'unit') return data.buildingCount != null ? `${data.buildingCount} Gedung` : null;
    if (type === 'event') return data.category?.event_category_name || 'Event';
    return null;
  };

  const getDescription = () => {
    if (!data) return config.fallbackText;
    if (type === 'item') return data.item_description || config.fallbackText;
    if (type === 'event') return data.event_description || config.fallbackText;
    return config.fallbackText;
  };

  const getPhoto = () => {
    return data?.photo_1 || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full overflow-hidden">
        {/* Photo */}
        {getPhoto() && (
          <img
            src={getPhoto()}
            alt={getDisplayName()}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-6 text-center">
          {/* Badge */}
          {getBadge() && (
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {getBadge()}
            </span>
          )}

          {/* Name */}
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {getDisplayName()}
          </h1>

          {/* Subtitle */}
          {getSubtitle() && (
            <p className="text-sm text-gray-400 mb-2">{getSubtitle()}</p>
          )}

          {!showFallback ? (
            <>
              <p className="text-gray-500 mb-6">Membuka di aplikasi...</p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-[3px] border-purple-200 border-t-purple-600 rounded-full animate-spin" />
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-5 text-sm">
                {getDescription()}
              </p>
              <a
                href={schemeFallback}
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Buka di Aplikasi
              </a>
              <p className="text-gray-400 text-xs mt-4">
                Pastikan aplikasi Utama Apps sudah terinstall.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeepLinkRedirect;
