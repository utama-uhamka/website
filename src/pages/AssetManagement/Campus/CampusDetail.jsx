import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import BuildingList from '../Building/BuildingList';
import EventList from '../Event/EventList';

const CampusDetail = ({ campus, onBack }) => {
  const [activeTab, setActiveTab] = useState('buildings');
  const [buildings, setBuildings] = useState([
    { id: 1, name: 'Gedung A', floors: 5, rooms: 30, assets: 120 },
    { id: 2, name: 'Gedung B', floors: 4, rooms: 24, assets: 95 },
    { id: 3, name: 'Gedung C', floors: 3, rooms: 18, assets: 75 },
  ]);

  const [events, setEvents] = useState([
    { id: 1, name: 'Seminar IT 2024', date: '2024-01-15', location: 'Gedung A', attendees: 50 },
    { id: 2, name: 'Workshop Leadership', date: '2024-01-20', location: 'Gedung B', attendees: 30 },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{campus.name}</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <FiMapPin size={16} />
            {campus.location}
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Lokasi</p>
            <p className="text-lg font-semibold text-gray-800">{campus.location}</p>
          </div>
          {campus.phone && (
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                <FiPhone size={14} />
                Telepon
              </p>
              <p className="text-lg font-semibold text-gray-800">{campus.phone}</p>
            </div>
          )}
          {campus.email && (
            <div>
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                <FiMail size={14} />
                Email
              </p>
              <p className="text-lg font-semibold text-gray-800">{campus.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Gedung</p>
          <p className="text-3xl font-bold text-primary">{buildings.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Ruangan</p>
          <p className="text-3xl font-bold text-primary">{buildings.reduce((sum, b) => sum + (b.rooms || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Asset</p>
          <p className="text-3xl font-bold text-primary">{buildings.reduce((sum, b) => sum + (b.assets || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Event</p>
          <p className="text-3xl font-bold text-primary">{events.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('buildings')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'buildings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Gedung
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'events'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Event
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'buildings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Daftar Gedung</h3>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                  <FiPlus size={18} />
                  Tambah Gedung
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buildings.map((building) => (
                  <div key={building.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-3">{building.name}</h4>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p>Lantai: <span className="font-medium">{building.floors}</span></p>
                      <p>Ruangan: <span className="font-medium">{building.rooms}</span></p>
                      <p>Asset: <span className="font-medium">{building.assets}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 text-primary hover:bg-primary/10 py-2 rounded transition-colors text-sm">
                        <FiEdit2 size={16} />
                        Edit
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded transition-colors text-sm">
                        <FiTrash2 size={16} />
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Daftar Event</h3>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                  <FiPlus size={18} />
                  Tambah Event
                </button>
              </div>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-800">{event.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">📅 {event.date}</p>
                        <p className="text-sm text-gray-600">📍 {event.location}</p>
                        <p className="text-sm text-gray-600">👥 {event.attendees} peserta</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors">
                          <FiEdit2 size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampusDetail;
