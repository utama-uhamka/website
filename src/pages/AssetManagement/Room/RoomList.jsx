import { useState } from 'react';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiGrid, FiTrendingUp } from 'react-icons/fi';
import RoomDetail from './RoomDetail';

const RoomList = ({ floor, building, onBack }) => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Ruangan 101', code: 'R-101', capacity: 30, assets: 4 },
    { id: 2, name: 'Ruangan 102', code: 'R-102', capacity: 25, assets: 3 },
    { id: 3, name: 'Ruangan 103', code: 'R-103', capacity: 20, assets: 4 },
    { id: 4, name: 'Ruangan 104', code: 'R-104', capacity: 15, assets: 2 },
    { id: 5, name: 'Ruangan 105', code: 'R-105', capacity: 30, assets: 4 },
    { id: 6, name: 'Ruangan 106', code: 'R-106', capacity: 35, assets: 5 },
  ]);

  const [selectedRoom, setSelectedRoom] = useState(null);

  if (selectedRoom) {
    return (
      <RoomDetail
        room={selectedRoom}
        floor={floor}
        building={building}
        onBack={() => setSelectedRoom(null)}
      />
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Daftar Ruangan</h1>
          <p className="text-gray-500 mt-1">{building?.name} - {floor?.name}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Ruangan</p>
          <p className="text-3xl font-bold text-primary">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Kapasitas Total</p>
          <p className="text-3xl font-bold text-primary">{rooms.reduce((sum, r) => sum + (r.capacity || 0), 0)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 mb-1">Total Asset</p>
          <p className="text-3xl font-bold text-primary">{rooms.reduce((sum, r) => sum + (r.assets || 0), 0)}</p>
        </div>
      </div>

      {/* Room Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Ruangan</h3>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
            <FiPlus size={18} />
            Tambah Ruangan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedRoom(room)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FiGrid size={18} className="text-primary" />
                    <h4 className="font-semibold text-gray-800">{room.name}</h4>
                  </div>
                  <p className="text-sm text-gray-500">Kode: {room.code}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <FiEdit2 size={16} className="text-gray-600" />
                </button>
              </div>

              <div className="flex gap-3 mb-4 py-4 border-y border-gray-200">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Kapasitas</p>
                  <p className="text-xl font-bold text-primary">{room.capacity}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FiTrendingUp size={12} />
                    Asset
                  </p>
                  <p className="text-xl font-bold text-primary">{room.assets}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex-1 text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Hapus
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRoom(room);
                  }}
                  className="flex-1 text-primary hover:bg-primary/10 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;
