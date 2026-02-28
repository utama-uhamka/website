const StatusBadge = ({ status, type = 'default', size = 'md' }) => {
  // Map numeric statuses to string statuses (for issue status)
  const numericStatusMap = {
    0: 'rusak',
    1: 'menunggu_diperbaiki',
    2: 'diperbaiki',
    3: 'maintenance',
    4: 'baik',
  };

  const statusStyles = {
    // General statuses
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700',

    // Issue statuses
    open: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-blue-100 text-blue-700',
    diproses: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    selesai: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',

    // Condition/status statuses
    rusak: 'bg-red-100 text-red-700',
    menunggu_diperbaiki: 'bg-yellow-100 text-yellow-700',
    diperbaiki: 'bg-green-100 text-green-700',
    maintenance: 'bg-blue-100 text-blue-700',
    baik: 'bg-emerald-100 text-emerald-700',

    // Priority
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',

    // Attendance
    present: 'bg-green-100 text-green-700',
    late: 'bg-yellow-100 text-yellow-700',
    absent: 'bg-red-100 text-red-700',
    leave: 'bg-blue-100 text-blue-700',

    // Payment
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-red-100 text-red-700',
    partial: 'bg-yellow-100 text-yellow-700',

    // Default
    default: 'bg-gray-100 text-gray-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const statusLabels = {
    active: 'Aktif',
    inactive: 'Nonaktif',
    pending: 'Pending',
    approved: 'Disetujui',
    rejected: 'Ditolak',
    cancelled: 'Dibatalkan',
    open: 'Open',
    in_progress: 'Diproses',
    diproses: 'Diproses',
    resolved: 'Selesai',
    selesai: 'Selesai',
    closed: 'Closed',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    present: 'Hadir',
    late: 'Terlambat',
    absent: 'Tidak Hadir',
    leave: 'Cuti',
    paid: 'Lunas',
    unpaid: 'Belum Bayar',
    partial: 'Sebagian',

    // Condition/status labels
    rusak: 'Rusak',
    menunggu_diperbaiki: 'Menunggu Diperbaiki',
    diperbaiki: 'Diperbaiki',
    maintenance: 'Maintenance',
    baik: 'Baik',
  };

  // Handle numeric status
  let normalizedStatus = 'default';
  if (status !== null && status !== undefined) {
    if (typeof status === 'number' || (typeof status === 'string' && !isNaN(parseInt(status)) && status.match(/^\d+$/))) {
      const numStatus = parseInt(status);
      normalizedStatus = numericStatusMap[numStatus] || 'pending';
    } else if (typeof status === 'string') {
      normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
    }
  }

  const styleClass = statusStyles[normalizedStatus] || statusStyles.default;
  const label = statusLabels[normalizedStatus] || status || '-';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${styleClass} ${sizeStyles[size]}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
