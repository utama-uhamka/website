import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import { PageHeader } from '../components/ui';
import { FiLayers, FiMapPin, FiActivity, FiTarget, FiSearch, FiX } from 'react-icons/fi';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { mapsAPI } from '../services/api';

// Fix Leaflet default marker icons (bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom attendance marker icons
const clockInIcon = new L.DivIcon({
  html: '<div style="background:#10b981;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>',
  className: 'custom-div-icon',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const clockOutIcon = new L.DivIcon({
  html: '<div style="background:#ef4444;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>',
  className: 'custom-div-icon',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

// ── Sub-components ────────────────────────────────

const HeatmapLayer = ({ points, visible }) => {
  const map = useMap();
  const heatRef = useRef(null);

  useEffect(() => {
    if (!visible || points.length === 0) {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
      return;
    }

    const heatPoints = points.map((p) => [
      parseFloat(p.latitude),
      parseFloat(p.longitude),
      parseFloat(p.intensity) || 1,
    ]);

    if (heatRef.current) {
      heatRef.current.setLatLngs(heatPoints);
    } else {
      heatRef.current = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: { 0.2: 'blue', 0.4: 'lime', 0.6: 'yellow', 0.8: 'orange', 1.0: 'red' },
      }).addTo(map);
    }

    return () => {
      if (heatRef.current) {
        map.removeLayer(heatRef.current);
        heatRef.current = null;
      }
    };
  }, [map, points, visible]);

  return null;
};

const MapAutoCenter = ({ buildings }) => {
  const map = useMap();

  useEffect(() => {
    const valid = buildings.filter((b) => b.latitude && b.longitude);
    if (valid.length === 0) return;

    if (valid.length === 1) {
      map.setView([parseFloat(valid[0].latitude), parseFloat(valid[0].longitude)], 16);
    } else {
      const bounds = L.latLngBounds(valid.map((b) => [parseFloat(b.latitude), parseFloat(b.longitude)]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [buildings, map]);

  return null;
};

const FlyToLocation = ({ target }) => {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 18, { duration: 1.2 });
    }
  }, [target, map]);

  return null;
};

const LayerSwitcher = ({ layers, onToggle }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-xl shadow-lg border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 w-full text-left font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
      >
        <FiLayers size={18} />
        <span className="text-sm">Layers</span>
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 p-3 space-y-1">
          {layers.map((layer) => (
            <label
              key={layer.id}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={layer.visible}
                onChange={() => onToggle(layer.id)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className={`w-3 h-3 rounded-full ${layer.colorClass}`} />
              <span className="text-sm text-gray-700">{layer.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────

const Maps = () => {
  // Filter state
  const [campusFilter, setCampusFilter] = useState('');
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const firstDay = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
    return { start: firstDay, end: today };
  });

  // Data state
  const [campusOptions, setCampusOptions] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [attendancePoints, setAttendancePoints] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Layer visibility
  const [showBuildings, setShowBuildings] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const searchRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search logic - filter buildings & attendance points by query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const q = searchQuery.toLowerCase();
    const results = [];

    // Search buildings
    buildings.forEach((b) => {
      if (b.building_name?.toLowerCase().includes(q) || b.campus?.campus_name?.toLowerCase().includes(q)) {
        results.push({
          type: 'building',
          label: b.building_name,
          sublabel: b.campus?.campus_name || '',
          lat: parseFloat(b.latitude),
          lng: parseFloat(b.longitude),
          id: `b-${b.building_id}`,
        });
      }
    });

    // Search attendance points by user name (deduplicate by user)
    const seenUsers = new Set();
    attendancePoints.forEach((p) => {
      const name = p.user?.full_name || '';
      if (name.toLowerCase().includes(q) && !seenUsers.has(name)) {
        seenUsers.add(name);
        results.push({
          type: 'member',
          label: name,
          sublabel: `${p.type === 'IN' ? 'Clock In' : 'Clock Out'} - ${new Date(p.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
          lat: parseFloat(p.latitude),
          lng: parseFloat(p.longitude),
          id: `a-${p.attendance_id}`,
        });
      }
    });

    setSearchResults(results.slice(0, 10));
    setShowSearchResults(results.length > 0);
  }, [searchQuery, buildings, attendancePoints]);

  const handleSelectResult = (result) => {
    setFlyTarget({ lat: result.lat, lng: result.lng });
    setShowSearchResults(false);
    setSearchQuery(result.label);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setFlyTarget(null);
  };

  // Load campus options on mount
  useEffect(() => {
    const loadCampuses = async () => {
      try {
        const res = await mapsAPI.getCampusOptions();
        if (res.data?.success) setCampusOptions(res.data.data);
      } catch {
        /* silent */
      }
    };
    loadCampuses();
  }, []);

  // Load map data when filters change
  const loadMapData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        campus_id: campusFilter || undefined,
        start_date: dateRange.start || undefined,
        end_date: dateRange.end || undefined,
      };

      const [buildingRes, pointsRes, heatRes] = await Promise.all([
        mapsAPI.getBuildingGeofences({ campus_id: params.campus_id }),
        mapsAPI.getAttendancePoints(params),
        mapsAPI.getHeatmapData(params),
      ]);

      if (buildingRes.data?.success) setBuildings(buildingRes.data.data);
      if (pointsRes.data?.success) setAttendancePoints(pointsRes.data.data);
      if (heatRes.data?.success) setHeatmapData(heatRes.data.data);
    } catch {
      toast.error('Gagal memuat data peta');
    } finally {
      setLoading(false);
    }
  }, [campusFilter, dateRange]);

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  // Layer config for switcher
  const layerConfig = [
    { id: 'buildings', label: 'Gedung & Radius', visible: showBuildings, colorClass: 'bg-primary' },
    { id: 'points', label: 'Titik Absensi', visible: showPoints, colorClass: 'bg-emerald-500' },
    { id: 'heatmap', label: 'Heatmap Absensi', visible: showHeatmap, colorClass: 'bg-orange-500' },
  ];

  const handleLayerToggle = (id) => {
    if (id === 'buildings') setShowBuildings((v) => !v);
    if (id === 'points') setShowPoints((v) => !v);
    if (id === 'heatmap') setShowHeatmap((v) => !v);
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <PageHeader
          title="Peta"
          subtitle="Visualisasi lokasi gedung (absensi) dan data absensi"
          breadcrumbs={[
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Peta' },
          ]}
        />

        {/* Filter Panel */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit/Kampus</label>
              <select
                value={campusFilter}
                onChange={(e) => setCampusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[180px]"
              >
                <option value="">Semua Kampus</option>
                {campusOptions.map((c) => (
                  <option key={c.campus_id} value={c.campus_id}>
                    {c.campus_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {/* Search */}
            <div className="relative ml-auto" ref={searchRef}>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  placeholder="Cari gedung atau anggota..."
                  className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-[260px]"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <FiX size={16} />
                  </button>
                )}
              </div>

              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[300px] overflow-y-auto">
                  {searchResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectResult(r)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0"
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${r.type === 'building' ? 'bg-primary/10 text-primary' : 'bg-emerald-100 text-emerald-600'}`}>
                        {r.type === 'building' ? <FiTarget size={14} /> : <FiMapPin size={14} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{r.label}</p>
                        <p className="text-xs text-gray-500 truncate">{r.sublabel}</p>
                      </div>
                      <span className="ml-auto flex-shrink-0 text-[10px] font-medium text-gray-400 uppercase">
                        {r.type === 'building' ? 'Gedung' : 'Anggota'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FiTarget className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Gedung</p>
              <p className="text-lg font-bold text-gray-800">{buildings.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <FiMapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Titik Absensi</p>
              <p className="text-lg font-bold text-gray-800">{attendancePoints.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <FiActivity className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Hotspot Heatmap</p>
              <p className="text-lg font-bold text-gray-800">{heatmapData.length}</p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-white/60 z-[1001] flex items-center justify-center">
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-sm">Memuat data peta...</span>
              </div>
            </div>
          )}

          <LayerSwitcher layers={layerConfig} onToggle={handleLayerToggle} />

          <MapContainer
            center={[-6.2088, 106.8456]}
            zoom={13}
            style={{ height: 'calc(100vh - 380px)', minHeight: '500px', width: '100%' }}
            className="rounded-xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapAutoCenter buildings={buildings} />
            <HeatmapLayer points={heatmapData} visible={showHeatmap} />
            <FlyToLocation target={flyTarget} />

            {/* Building geofence circles */}
            {showBuildings &&
              buildings.map((b) => (
                <Circle
                  key={b.building_id}
                  center={[parseFloat(b.latitude), parseFloat(b.longitude)]}
                  radius={b.radius || 100}
                  pathOptions={{
                    color: '#4A22AD',
                    fillColor: '#4A22AD',
                    fillOpacity: 0.15,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-800">{b.building_name}</p>
                      {b.campus && <p className="text-gray-500 text-xs">{b.campus.campus_name}</p>}
                      <p className="text-gray-400 text-xs mt-1">Radius: {b.radius || 100}m</p>
                    </div>
                  </Popup>
                </Circle>
              ))}

            {/* Attendance point markers */}
            {showPoints &&
              attendancePoints.map((p) => (
                <Marker
                  key={p.attendance_id}
                  position={[parseFloat(p.latitude), parseFloat(p.longitude)]}
                  icon={p.type === 'IN' ? clockInIcon : clockOutIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{p.user?.full_name || '-'}</p>
                      <p className="text-xs text-gray-500">
                        {p.type === 'IN' ? '🟢 Clock In' : '🔴 Clock Out'} &middot;{' '}
                        {new Date(p.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {p.building && <p className="text-xs text-gray-400 mt-1">{p.building.building_name}</p>}
                      {p.address && <p className="text-xs text-gray-400">{p.address}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow-md border border-gray-200 px-3 py-2">
            <p className="text-xs font-medium text-gray-600 mb-1.5">Keterangan</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary border-2 border-primary/30" />
                <span className="text-xs text-gray-600">Area Gedung (Geofence)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow" />
                <span className="text-xs text-gray-600">Clock In</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow" />
                <span className="text-xs text-gray-600">Clock Out</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </MainLayout>
  );
};

export default Maps;
