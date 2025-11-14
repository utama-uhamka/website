import { useState } from 'react';
import { FiArrowLeft, FiMail, FiPhone, FiBriefcase, FiMapPin, FiCalendar, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const EmployeeDetail = ({ employee, onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({
    2024: {
      11: {
        1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present',
        6: 'absent', 7: 'present', 8: 'present', 9: 'present', 10: 'present',
        11: 'present', 12: 'present', 13: 'present', 14: 'present', 15: 'sick',
        18: 'present', 19: 'present', 20: 'present', 21: 'present', 22: 'present',
        25: 'present', 26: 'present', 27: 'present', 28: 'present', 29: 'present',
      }
    }
  });

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getAttendanceStatus = (day) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return attendanceData[year]?.[month]?.[day] || 'no-data';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'sick':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'no-data':
        return 'bg-gray-50 text-gray-400 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-400 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'present':
        return 'Hadir';
      case 'absent':
        return 'Absen';
      case 'sick':
        return 'Sakit';
      case 'no-data':
        return '-';
      default:
        return '-';
    }
  };

  const attendanceStats = {
    present: Object.values(attendanceData[currentMonth.getFullYear()]?.[currentMonth.getMonth() + 1] || {}).filter(s => s === 'present').length,
    absent: Object.values(attendanceData[currentMonth.getFullYear()]?.[currentMonth.getMonth() + 1] || {}).filter(s => s === 'absent').length,
    sick: Object.values(attendanceData[currentMonth.getFullYear()]?.[currentMonth.getMonth() + 1] || {}).filter(s => s === 'sick').length,
  };

  const monthYear = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const calendarDays = [];
  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
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
          <h1 className="text-3xl font-bold text-gray-800">{employee.name}</h1>
          <p className="text-gray-500 mt-1">{employee.position}</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Informasi Karyawan</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FiMail className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiPhone className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="font-medium text-gray-800">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiBriefcase className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Departemen</p>
                <p className="font-medium text-gray-800">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiMapPin className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Kampus</p>
                <p className="font-medium text-gray-800">{employee.campus}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiCalendar className="text-primary mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-500">Tanggal Bergabung</p>
                <p className="font-medium text-gray-800">{new Date(employee.joinDate).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Statistik Kehadiran Bulan Ini</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheck className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hadir</p>
                  <p className="font-semibold text-gray-800">{attendanceStats.present} hari</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FiX className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Absen</p>
                  <p className="font-semibold text-gray-800">{attendanceStats.absent} hari</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">S</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sakit</p>
                  <p className="font-semibold text-gray-800">{attendanceStats.sick} hari</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-800">Kehadiran {monthYear}</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-gray-600 min-w-[150px] text-center">{monthYear}</span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium text-gray-600 text-sm py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center rounded-lg border text-sm font-medium transition-all cursor-pointer ${
                day === null
                  ? 'bg-gray-50 border-gray-200'
                  : getStatusColor(getAttendanceStatus(day))
              }`}
            >
              {day !== null && (
                <div className="text-center">
                  <p className="text-xs">{day}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-gray-600">Hadir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-sm text-gray-600">Absen</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span className="text-sm text-gray-600">Sakit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-sm text-gray-600">Tidak Ada Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
