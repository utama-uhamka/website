import { useState } from 'react';
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
  FiZap,
  FiDroplet,
  FiWifi,
  FiActivity,
  FiPieChart,
  FiBarChart2,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import MainLayout from '../layouts/MainLayout';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Summary Stats
  const summaryStats = [
    { id: 1, title: 'Total Unit', value: '7', change: '+2', isUp: true, icon: FiMapPin, color: 'primary' },
    { id: 2, title: 'Total Gedung', value: '24', change: '+3', isUp: true, icon: FiHome, color: 'blue' },
    { id: 3, title: 'Total Lantai', value: '86', change: '+5', isUp: true, icon: FiLayers, color: 'purple' },
    { id: 4, title: 'Total Ruangan', value: '342', change: '+12', isUp: true, icon: FiBox, color: 'green' },
  ];

  // Clock In Stats
  const clockInStats = [
    { id: 1, title: 'Tepat Waktu', value: '120', subtitle: '+12% dari kemarin', icon: FiCheckCircle, bgColor: 'bg-green-50', iconColor: 'text-green-500', iconBg: 'bg-green-100' },
    { id: 2, title: 'Terlambat', value: '5', subtitle: '+6% dari kemarin', icon: FiClock, bgColor: 'bg-amber-50', iconColor: 'text-amber-500', iconBg: 'bg-amber-100' },
    { id: 3, title: 'Tidak Hadir', value: '3', subtitle: '-2% dari kemarin', icon: FiAlertCircle, bgColor: 'bg-red-50', iconColor: 'text-red-500', iconBg: 'bg-red-100' },
  ];

  // Employee Stats by Role
  const employeeByRole = [
    { name: 'Admin', value: 8, color: '#4A22AD' },
    { name: 'Staff', value: 45, color: '#10b981' },
    { name: 'Security', value: 32, color: '#3b82f6' },
    { name: 'Cleaning', value: 28, color: '#f59e0b' },
    { name: 'Technician', value: 15, color: '#ef4444' },
  ];

  // Inventory Condition
  const inventoryCondition = [
    { name: 'Baik', value: 856, fill: '#10b981' },
    { name: 'Cukup', value: 124, fill: '#f59e0b' },
    { name: 'Rusak', value: 45, fill: '#ef4444' },
  ];

  // Billing data per unit
  const billingData = [
    { unit: 'Unit A', pln: 4200, pdam: 850, internet: 100 },
    { unit: 'Unit B', pln: 3800, pdam: 720, internet: 100 },
    { unit: 'Unit C', pln: 5100, pdam: 980, internet: 150 },
    { unit: 'Unit D', pln: 2900, pdam: 540, internet: 75 },
    { unit: 'Unit E', pln: 3500, pdam: 670, internet: 100 },
    { unit: 'Unit F', pln: 4800, pdam: 890, internet: 125 },
    { unit: 'Unit G', pln: 3200, pdam: 610, internet: 100 },
  ];

  // Attendance trend data
  const attendanceTrend = [
    { date: '01 Jan', hadir: 118, terlambat: 8, izin: 2 },
    { date: '02 Jan', hadir: 122, terlambat: 4, izin: 2 },
    { date: '03 Jan', hadir: 115, terlambat: 9, izin: 4 },
    { date: '04 Jan', hadir: 120, terlambat: 6, izin: 2 },
    { date: '05 Jan', hadir: 125, terlambat: 2, izin: 1 },
    { date: '06 Jan', hadir: 119, terlambat: 7, izin: 2 },
    { date: '07 Jan', hadir: 120, terlambat: 5, izin: 3 },
  ];

  // Issue Statistics
  const issueStats = [
    { month: 'Jul', new: 45, resolved: 38, pending: 12 },
    { month: 'Aug', new: 52, resolved: 48, pending: 16 },
    { month: 'Sep', new: 38, resolved: 42, pending: 12 },
    { month: 'Oct', new: 61, resolved: 55, pending: 18 },
    { month: 'Nov', new: 55, resolved: 52, pending: 21 },
    { month: 'Dec', new: 48, resolved: 58, pending: 11 },
    { month: 'Jan', new: 42, resolved: 45, pending: 8 },
  ];

  // Recent Activity
  const recentActivities = [
    { id: 1, user: 'Ahmad Fauzi', action: 'Check-in', location: 'Gedung Rektorat', time: '07:05', type: 'checkin' },
    { id: 2, user: 'Siti Nurhaliza', action: 'Submitted Issue', location: 'Gedung FKIP Lt.2', time: '08:30', type: 'issue' },
    { id: 3, user: 'Budi Santoso', action: 'Patrol Completed', location: 'Area Parkir', time: '09:15', type: 'patrol' },
    { id: 4, user: 'Dewi Lestari', action: 'Cleaning Done', location: 'Lobby Utama', time: '10:00', type: 'cleaning' },
    { id: 5, user: 'Eko Prasetyo', action: 'Maintenance', location: 'Ruang Server', time: '11:30', type: 'maintenance' },
  ];

  // Upcoming Events
  const upcomingEvents = [
    { id: 1, name: 'Wisuda Semester Ganjil', date: '15 Feb 2025', location: 'Aula Utama', category: 'Akademik' },
    { id: 2, name: 'Seminar Nasional IT', date: '20 Feb 2025', location: 'Gedung FKIP', category: 'Seminar' },
    { id: 3, name: 'Workshop Leadership', date: '25 Feb 2025', location: 'Ruang Rapat', category: 'Workshop' },
  ];

  // Leave Summary
  const leaveSummary = [
    { name: 'Cuti Tahunan', used: 45, total: 120 },
    { name: 'Izin Sakit', used: 28, total: 60 },
    { name: 'Izin Lainnya', used: 15, total: 40 },
  ];

  // Performance Score Radial
  const performanceData = [
    { name: 'Kehadiran', value: 92, fill: '#10b981' },
    { name: 'Kinerja', value: 85, fill: '#3b82f6' },
    { name: 'Sikap', value: 88, fill: '#8b5cf6' },
    { name: 'Skill', value: 80, fill: '#f59e0b' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'checkin': return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'issue': return <FiAlertCircle className="w-4 h-4 text-red-500" />;
      case 'patrol': return <FiActivity className="w-4 h-4 text-blue-500" />;
      case 'cleaning': return <FiCheckCircle className="w-4 h-4 text-purple-500" />;
      case 'maintenance': return <FiBox className="w-4 h-4 text-amber-500" />;
      default: return <FiActivity className="w-4 h-4 text-gray-500" />;
    }
  };

  const COLORS = ['#4A22AD', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">Selamat datang! Berikut ringkasan data hari ini.</p>
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
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.isUp ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
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
          {/* Today's Clock In */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Absensi Hari Ini</h2>
                <p className="text-sm text-gray-500">Ringkasan kehadiran karyawan</p>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                128 Karyawan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clockInStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.id} className={`${stat.bgColor} rounded-xl p-5`}>
                    <div className={`${stat.iconBg} ${stat.iconColor} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
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
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
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
                  <span className="text-gray-600">Hadir</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-600">Terlambat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Izin</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="hadir" stroke="#10b981" strokeWidth={2.5} fill="url(#colorHadir)" />
                <Line type="monotone" dataKey="terlambat" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
                <Line type="monotone" dataKey="izin" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Issue Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Statistik Issue</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <FiCheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">85% Resolved</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={issueStats} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
                <Bar dataKey="new" name="Issue Baru" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Billing Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Billing Summary Cards */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Billing</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                <div className="p-3 bg-amber-500 rounded-xl">
                  <FiZap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">PLN Total</p>
                  <p className="text-xl font-bold text-gray-800">27,500 kWh</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <FiTrendingUp className="w-3 h-3" /> +5%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <FiDroplet className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">PDAM Total</p>
                  <p className="text-xl font-bold text-gray-800">5,260 m³</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <FiTrendingUp className="w-3 h-3" /> +2%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="p-3 bg-purple-500 rounded-xl">
                  <FiWifi className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Internet Total</p>
                  <p className="text-xl font-bold text-gray-800">750 Mbps</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-medium">Stabil</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing per Unit Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Billing per Unit</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={billingData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="unit" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
                <Bar dataKey="pln" name="PLN (kWh)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pdam" name="PDAM (m³)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section: Inventory, Recent Activity, Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inventory Condition */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Kondisi Inventory</h3>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                1,025 Item
              </span>
            </div>
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
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Aktivitas Terbaru</h3>
              <button className="text-sm text-primary font-medium hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.action} • {activity.location}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Event Mendatang</h3>
              <button className="text-sm text-primary font-medium hover:underline">Lihat Semua</button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 bg-gradient-to-r from-primary/5 to-white rounded-xl border border-primary/10">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-800">{event.name}</h4>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded">{event.category}</span>
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
              ))}
            </div>
          </div>
        </div>

        {/* Leave Summary & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leave Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ringkasan Cuti Karyawan</h3>
            <div className="space-y-4">
              {leaveSummary.map((item, index) => {
                const percentage = Math.round((item.used / item.total) * 100);
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.used}/{item.total} hari</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Average Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Rata-rata Performa Karyawan</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="100%" data={performanceData} startAngle={180} endAngle={0}>
                  <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={5} />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <span className="text-sm font-bold text-gray-800">{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.fill }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
