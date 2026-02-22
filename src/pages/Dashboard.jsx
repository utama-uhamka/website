import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiUsers,
  FiFileText,
  FiMapPin,
  FiHome,
  FiLayers,
  FiBox,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  Line,
} from 'recharts';
import MainLayout from '../layouts/MainLayout';
import {
  fetchDashboardStats,
  fetchAttendanceChart,
  clearDashboardError,
} from '../store/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, attendanceChart, loading, error } = useSelector(
    (state) => state.dashboard
  );
  const { user } = useSelector((state) => state.auth);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Fetch data when period changes
  useEffect(() => {
    dispatch(fetchDashboardStats(selectedPeriod));

    // Adjust chart parameters based on period
    const attendanceDays = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;

    dispatch(fetchAttendanceChart(attendanceDays));
  }, [dispatch, selectedPeriod]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDashboardError());
    }
  }, [error, dispatch]);

  // Transform API data for charts
  const summaryStats = stats?.overview
    ? [
        {
          id: 1,
          title: 'Total Unit',
          value: stats.overview.totalCampuses?.toString() || '0',
          change: '+0',
          isUp: true,
          icon: FiMapPin,
          color: 'primary',
        },
        {
          id: 2,
          title: 'Total Gedung',
          value: stats.overview.totalBuildings?.toString() || '0',
          change: '+0',
          isUp: true,
          icon: FiHome,
          color: 'blue',
        },
        {
          id: 3,
          title: 'Total Lantai',
          value: stats.overview.totalFloors?.toString() || '0',
          change: '+0',
          isUp: true,
          icon: FiLayers,
          color: 'purple',
        },
        {
          id: 4,
          title: 'Total Ruangan',
          value: stats.overview.totalRooms?.toString() || '0',
          change: '+0',
          isUp: true,
          icon: FiBox,
          color: 'green',
        },
      ]
    : [];

  // Period label helper
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'week': return 'Minggu Ini';
      case 'year': return 'Tahun Ini';
      default: return 'Bulan Ini';
    }
  };

  // Clock In Stats from API (using period data)
  const clockInStats = stats?.attendance
    ? [
        {
          id: 1,
          title: 'Clock In',
          value: stats.attendance.periodClockIn?.toString() || '0',
          subtitle: getPeriodLabel(),
          icon: FiCheckCircle,
          bgColor: 'bg-green-50',
          iconColor: 'text-green-500',
          iconBg: 'bg-green-100',
        },
        {
          id: 2,
          title: 'Clock Out',
          value: stats.attendance.periodClockOut?.toString() || '0',
          subtitle: getPeriodLabel(),
          icon: FiClock,
          bgColor: 'bg-amber-50',
          iconColor: 'text-amber-500',
          iconBg: 'bg-amber-100',
        },
        {
          id: 3,
          title: 'Total User Aktif',
          value: stats.overview?.activeUsers?.toString() || '0',
          subtitle: `dari ${stats.overview?.totalUsers || 0} user`,
          icon: FiUsers,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-100',
        },
      ]
    : [];

  // Employee by Role from API
  const COLORS = ['#4A22AD', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const employeeByRole =
    stats?.usersByRole?.map((item, index) => ({
      name: item.role?.role_name || `Role ${item.role_id}`,
      value: parseInt(item.count),
      color: COLORS[index % COLORS.length],
    })) || [];

  // Inventory Condition from API
  const inventoryCondition =
    stats?.itemsByCondition?.map((item) => ({
      name: item.item_condition || 'Unknown',
      value: parseInt(item.count),
      fill:
        item.item_condition === 'Baik'
          ? '#10b981'
          : item.item_condition === 'Cukup'
          ? '#f59e0b'
          : '#ef4444',
    })) || [];

  // Transform attendance chart data
  const attendanceTrend =
    attendanceChart?.reduce((acc, item) => {
      const dateStr = new Date(item.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
      });
      const existing = acc.find((a) => a.date === dateStr);
      if (existing) {
        if (item.type === 'IN') existing.clockIn = parseInt(item.count);
        if (item.type === 'OUT') existing.clockOut = parseInt(item.count);
      } else {
        acc.push({
          date: dateStr,
          clockIn: item.type === 'IN' ? parseInt(item.count) : 0,
          clockOut: item.type === 'OUT' ? parseInt(item.count) : 0,
        });
      }
      return acc;
    }, []) || [];

  // Issue Statistics from API
  const issueStats = stats?.issues
    ? [
        {
          label: 'Total',
          value: stats.issues.totalIssues || 0,
          color: '#3b82f6',
        },
        {
          label: 'Pending',
          value: stats.issues.pendingIssues || 0,
          color: '#f59e0b',
        },
        {
          label: 'Resolved',
          value: stats.issues.resolvedIssues || 0,
          color: '#10b981',
        },
      ]
    : [];

  // Upcoming Events from API
  const upcomingEvents =
    stats?.upcomingEvents?.map((event) => ({
      id: event.event_id,
      name: event.event_name,
      date: new Date(event.date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      location: event.campus?.campus_name || '-',
      category: event.event_type || 'Event',
    })) || [];

  // Recent Issues from API
  const recentIssues =
    stats?.recentIssues?.map((issue) => ({
      id: issue.issue_id,
      user: issue.user?.full_name || 'Unknown',
      item: issue.item?.item_name || 'Unknown',
      status: issue.status === 1 ? 'Resolved' : 'Pending',
      time: new Date(issue.createdAt).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    })) || [];

  // Performance stats
  const totalItems = stats?.overview?.totalItems || 0;

  if (loading && !stats) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <FiLoader className="w-10 h-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Selamat Datang, {user?.full_name || 'User'}!
            </h1>
            <p className="text-gray-500 text-sm">
              {user?.role?.role_name || 'Admin'} • Berikut ringkasan data {getPeriodLabel().toLowerCase()}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition">
              <FiFileText size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryStats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              primary: 'bg-primary/10 text-primary',
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              green: 'bg-green-100 text-green-600',
            };
            return (
              <div key={stat.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      stat.isUp ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.isUp ? (
                      <FiTrendingUp className="w-3 h-3" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800 mt-4">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Clock In & Employee Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Period Clock In */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Absensi {getPeriodLabel()}</h2>
                <p className="text-sm text-gray-500">Ringkasan kehadiran karyawan</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                {stats?.overview?.totalUsers || 0} Karyawan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clockInStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.id} className={`${stat.bgColor} rounded-xl p-5`}>
                    <div
                      className={`${stat.iconBg} ${stat.iconColor} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                    <p className="text-gray-800 text-sm font-semibold mb-1">{stat.title}</p>
                    <p className="text-xs text-gray-600">{stat.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Employee by Role */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Karyawan per Role</h3>
            {employeeByRole.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={employeeByRole}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {employeeByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {employeeByRole.map((item, index) => (
                    <div key={index} className="flex items-center gap-1.5 text-xs">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-gray-600">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
                Tidak ada data
              </div>
            )}
          </div>
        </div>

        {/* Attendance Trend & Issue Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Tren Kehadiran</h3>
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Clock In</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Clock Out</span>
                </div>
              </div>
            </div>
            {attendanceTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="colorClockIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clockIn"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fill="url(#colorClockIn)"
                    name="Clock In"
                  />
                  <Line
                    type="monotone"
                    dataKey="clockOut"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                    name="Clock Out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
                Tidak ada data kehadiran
              </div>
            )}
          </div>

          {/* Issue Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Statistik Issue {getPeriodLabel()}</h3>
              {stats?.issues?.resolvedIssues > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {Math.round(
                      (stats.issues.resolvedIssues / stats.issues.totalIssues) * 100
                    )}
                    % Resolved
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {issueStats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-xl" style={{ backgroundColor: `${stat.color}10` }}>
                  <p className="text-3xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Issues List */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Issue Terbaru {getPeriodLabel()}</h4>
              <div className="space-y-3">
                {recentIssues.length > 0 ? (
                  recentIssues.slice(0, 4).map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{issue.item}</p>
                        <p className="text-xs text-gray-500">oleh {issue.user}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            issue.status === 'Resolved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {issue.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">{issue.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">Tidak ada issue</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Inventory, Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Condition */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Kondisi Inventory</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                {totalItems} Item
              </span>
            </div>
            {inventoryCondition.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={inventoryCondition}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {inventoryCondition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {inventoryCondition.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        ></div>
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[180px] text-gray-400 text-sm">
                Tidak ada data inventory
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Event Mendatang</h3>
              <button className="text-sm text-primary font-medium hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-gradient-to-r from-primary/5 to-white rounded-xl border border-primary/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">{event.name}</h4>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">
                        {event.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                  Tidak ada event mendatang
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Leave Summary & Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leave Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Cuti {getPeriodLabel()}</h3>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-amber-600">
                    {stats?.leaves?.pendingLeaves || 0}
                  </span>
                </div>
                <p className="text-gray-600 font-medium">Pengajuan Cuti Pending</p>
                <p className="text-sm text-gray-400 mt-1">{getPeriodLabel()}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik Cepat</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <FiUsers className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stats?.overview?.totalUsers || 0}</p>
                <p className="text-sm text-gray-600">Total User</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <FiCheckCircle className="w-8 h-8 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stats?.overview?.activeUsers || 0}</p>
                <p className="text-sm text-gray-600">User Aktif</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <FiBox className="w-8 h-8 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stats?.overview?.totalItems || 0}</p>
                <p className="text-sm text-gray-600">Total Item</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <FiAlertCircle className="w-8 h-8 text-amber-600 mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stats?.issues?.pendingIssues || 0}</p>
                <p className="text-sm text-gray-600">Issue Pending {getPeriodLabel()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
