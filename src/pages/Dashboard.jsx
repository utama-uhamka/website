import { FiTrendingUp, FiClock, FiUsers, FiFileText } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import MainLayout from '../layouts/MainLayout';

const Dashboard = () => {
  // Stats data
  const stats = [
    {
      id: 1,
      title: 'Late Clock In',
      value: '5',
      subtitle: '+6% from yesterday',
      icon: FiClock,
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-500',
      iconBg: 'bg-pink-100',
    },
    {
      id: 2,
      title: 'Passed Clock In',
      value: '120',
      subtitle: '+12% from yesterday',
      icon: FiTrendingUp,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100',
    },
    {
      id: 3,
      title: 'Total User',
      value: '8',
      subtitle: '',
      icon: FiUsers,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-100',
    },
  ];

  // Billing & KWH PLN data
  const billingData = [
    { month: 'Kampus A', kwh: 45, billing: 38 },
    { month: 'Kampus B', kwh: 52, billing: 45 },
    { month: 'Kampus C', kwh: 61, billing: 50 },
    { month: 'Kampus D', kwh: 58, billing: 42 },
    { month: 'Kampus E', kwh: 70, billing: 48 },
    { month: 'Kampus F', kwh: 75, billing: 52 },
    { month: 'Kampus G', kwh: 85, billing: 68 },
  ];

  // PGAM Statistics data
  const pgamData = [
    { month: 'Kampus A', nilai1: 1242.42, nilai2: 1242.42 },
    { month: 'Kampus B', nilai1: 1540.82, nilai2: 1341.23 },
    { month: 'Kampus C', nilai1: 1340.62, nilai2: 1542.62 },
    { month: 'Kampus D', nilai1: 1840.42, nilai2: 1642.12 },
    { month: 'Kampus E', nilai1: 1742.22, nilai2: 1842.42 },
    { month: 'Kampus F', nilai1: 1942.82, nilai2: 2042.22 },
    { month: 'Kampus G', nilai1: 2142.12, nilai2: 2242.82 },
  ];

  // Issue Insights data
  const issueInsightsData = [
    { month: 'Jun', designated: 45, unresolved: 35, issue: 50 },
    { month: 'Jul', designated: 52, unresolved: 45, issue: 30 },
    { month: 'Aug', designated: 40, unresolved: 55, issue: 45 },
    { month: 'Sep', designated: 60, unresolved: 50, issue: 60 },
    { month: 'Oct', designated: 55, unresolved: 40, issue: 50 },
    { month: 'Nov', designated: 70, unresolved: 60, issue: 65 },
    { month: 'Dec', designated: 65, unresolved: 55, issue: 45 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Top Row: Today's Clock In + Issue Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Clock In */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Today's Clock In</h2>
                  <p className="text-sm text-gray-500 mt-1">HR Summary</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                  <FiFileText size={16} />
                  Export
                </button>
              </div>

              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.id} className={`${stat.bgColor} rounded-2xl p-5`}>
                      <div className={`${stat.iconBg} ${stat.iconColor} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                        <Icon size={22} />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                      <p className="text-gray-800 text-sm font-semibold mb-1">{stat.title}</p>
                      {stat.subtitle && (
                        <p className="text-xs text-gray-600">{stat.subtitle}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Issue Insights */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm h-full">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Issue Insights</h3>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={issueInsightsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    iconType="circle"
                    layout="horizontal"
                    align="center"
                  />
                  <Line
                    type="monotone"
                    dataKey="designated"
                    name="Designated Fix"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="unresolved"
                    name="New Issue"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ fill: '#ef4444', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="issue"
                    name="Issue Fixed"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Billing & KWH PLN Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Billing & KWH PLN</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={billingData} barGap={2} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Bar dataKey="kwh" fill="#4A22AD" radius={[6, 6, 0, 0]} />
              <Bar dataKey="billing" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PDAM Statistics Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-800">PDAM Statistics</h3>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-600">Kampus A</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Kampus B</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={pgamData}>
              <defs>
                <linearGradient id="colorNilai1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNilai2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="nilai1"
                stroke="#22d3ee"
                strokeWidth={2.5}
                fill="url(#colorNilai1)"
                dot={{ fill: '#22d3ee', r: 3 }}
              />
              <Area
                type="monotone"
                dataKey="nilai2"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#colorNilai2)"
                dot={{ fill: '#3b82f6', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
