const StatusBadge = ({ status, type = 'default', size = 'md' }) => {
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
    in_progress: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-700',

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
    in_progress: 'In Progress',
    resolved: 'Resolved',
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
  };

  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '_') || 'default';
  const styleClass = statusStyles[normalizedStatus] || statusStyles.default;
  const label = statusLabels[normalizedStatus] || status;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full whitespace-nowrap ${styleClass} ${sizeStyles[size]}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
