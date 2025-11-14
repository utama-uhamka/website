import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import EventModal from './EventModal';

const EventList = () => {
  const [events, setEvents] = useState([
    { id: 1, name: 'Seminar IT 2024', date: '2024-01-15', startTime: '09:00', endTime: '12:00', location: 'Gedung A - Lantai 1', campus: 'Campus Pusat', attendees: 50, description: 'Seminar tentang teknologi terbaru' },
    { id: 2, name: 'Workshop Leadership', date: '2024-01-20', startTime: '10:00', endTime: '15:00', location: 'Gedung B - Lantai 2', campus: 'Campus Pusat', attendees: 30, description: 'Workshop pengembangan kepemimpinan' },
    { id: 3, name: 'Rapat Koordinasi', date: '2024-01-25', startTime: '14:00', endTime: '16:00', location: 'Gedung C - Lantai 3', campus: 'Campus Bandung', attendees: 20, description: 'Rapat evaluasi program' },
    { id: 4, name: 'Pelatihan Keselamatan', date: '2024-02-01', startTime: '08:00', endTime: '10:00', location: 'Gedung A - Lantai 3', campus: 'Campus Pusat', attendees: 100, description: 'Pelatihan K3 untuk semua karyawan' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEvent = (eventData) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, ...eventData } : e));
    } else {
      const newEvent = {
        id: Math.max(...events.map(e => e.id), 0) + 1,
        ...eventData,
      };
      setEvents([...events, newEvent]);
    }
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Event</h1>
          <p className="text-gray-500 mt-1">Kelola acara dan pelatihan</p>
        </div>
        <button
          onClick={() => {
            setEditingEvent(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full sm:w-auto justify-center"
        >
          <FiPlus size={20} />
          Tambah Event
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Event</p>
          <p className="text-3xl font-bold text-primary">{events.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Event Mendatang</p>
          <p className="text-3xl font-bold text-blue-600">{upcomingEvents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Peserta</p>
          <p className="text-3xl font-bold text-purple-600">{events.reduce((sum, e) => sum + e.attendees, 0)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari event berdasarkan nama atau lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Event List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FiCalendar className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Tanggal</p>
                      <p className="text-sm font-medium text-gray-800">{new Date(event.date).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⏰</span>
                    <div>
                      <p className="text-xs text-gray-500">Waktu</p>
                      <p className="text-sm font-medium text-gray-800">{event.startTime} - {event.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Lokasi</p>
                      <p className="text-sm font-medium text-gray-800">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers size={16} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Peserta</p>
                      <p className="text-sm font-medium text-gray-800">{event.attendees} orang</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 md:flex-col">
                <button
                  onClick={() => {
                    setEditingEvent(event);
                    setModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors"
                >
                  <FiEdit2 size={18} />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                  <FiTrash2 size={18} />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500">Tidak ada event yang sesuai dengan pencarian.</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <EventModal
          event={editingEvent}
          onClose={() => {
            setModalOpen(false);
            setEditingEvent(null);
          }}
          onSubmit={handleAddEvent}
        />
      )}
    </div>
  );
};

export default EventList;
