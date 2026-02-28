import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api/dashboard', '') || 'http://localhost:3000';

const DeepLinkRedirect = () => {
  const { id } = useParams();
  const [showFallback, setShowFallback] = useState(false);
  const [item, setItem] = useState(null);
  const deepLink = `utamaapp://item/${id}`;

  useEffect(() => {
    // Fetch item data from API
    axios.get(`${API_URL}/api/public/item/${id}`)
      .then(res => {
        if (res.data.success) {
          setItem(res.data.data);
        }
      })
      .catch(() => {});

    // Try to open the app
    window.location.href = deepLink;

    const timer = setTimeout(() => setShowFallback(true), 1500);
    return () => clearTimeout(timer);
  }, [deepLink, id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full overflow-hidden">
        {/* Item Image */}
        {item?.photo_1 && (
          <img
            src={item.photo_1}
            alt={item.item_name}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-6 text-center">
          {/* Category Badge */}
          {item?.category_item?.category_item_name && (
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {item.category_item.category_item_name}
              {item.category_item.type && ` • ${item.category_item.type}`}
            </span>
          )}

          {/* Item Name or Default */}
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {item?.item_name || 'Utama Apps'}
          </h1>

          {/* Item Code */}
          {item?.item_code && (
            <p className="text-sm text-gray-400 font-mono mb-2">{item.item_code}</p>
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
                {item?.item_description || 'Tekan tombol di bawah untuk membuka item di aplikasi Utama Apps.'}
              </p>
              <a
                href={deepLink}
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
