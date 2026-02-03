import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  FormInput,
  PageHeader,
  AvatarWithFallback,
  ImageWithFallback,
} from '../components/ui';
import { FiUser, FiImage, FiMapPin, FiCalendar, FiLoader } from 'react-icons/fi';
import { fetchIssues, updateIssue, resolveIssue, clearDataError, clearDataSuccess } from '../store/dataSlice';
import { fetchUsers } from '../store/usersSlice';

const Issue = () => {
  const dispatch = useDispatch();
  const { issues, loading, error, success } = useSelector((state) => state.data);
  const { data: users } = useSelector((state) => state.users);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [assignData, setAssignData] = useState({ assigned_to: '', status: '' });
  const [formLoading, setFormLoading] = useState(false);

  const itemsPerPage = 10;

  const priorities = [
    { value: 'low', label: 'Rendah' },
    { value: 'medium', label: 'Sedang' },
    { value: 'high', label: 'Tinggi' },
    { value: 'critical', label: 'Kritis' },
  ];

  const statuses = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  // Load issues
  const loadIssues = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchIssues(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  // Load users for assignment
  useEffect(() => {
    dispatch(fetchUsers({ limit: 100 }));
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearDataError());
    }
  }, [error, dispatch]);

  // Handle success
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearDataSuccess());
      loadIssues();
    }
  }, [success, dispatch, loadIssues]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // User options for assignment
  const userOptions = users.map((u) => ({
    value: u.user_id?.toString(),
    label: u.full_name,
  }));

  const columns = [
    {
      key: 'title',
      label: 'Issue',
      render: (value, item) => (
        <div>
          <p className="font-medium text-gray-800">{value || item.issue_title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{item.room?.room_name || item.location || '-'}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Prioritas',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'reporter',
      label: 'Pelapor',
      width: '130px',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <AvatarWithFallback src={item.user?.photo_1} alt={item.user?.full_name} size={28} />
          <span className="text-sm">{item.user?.full_name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'assigned',
      label: 'Ditugaskan',
      width: '130px',
      render: (value, item) => item.assignee?.full_name ? (
        <div className="flex items-center gap-2">
          <AvatarWithFallback src={item.assignee?.photo_1} alt={item.assignee?.full_name} size={28} />
          <span className="text-sm">{item.assignee?.full_name}</span>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">Belum ditugaskan</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Tanggal',
      width: '110px',
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '110px',
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  const filters = [
    {
      key: 'priority',
      label: 'Prioritas',
      options: priorities,
    },
    {
      key: 'status',
      label: 'Status',
      options: statuses,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setIsViewOpen(true);
  };

  const handleAssign = (item) => {
    setSelectedItem(item);
    setAssignData({
      assigned_to: item.assigned_to?.toString() || '',
      status: item.status || 'open',
    });
    setIsAssignOpen(true);
  };

  const handleSubmitAssign = async () => {
    setFormLoading(true);
    try {
      const submitData = {
        assigned_to: assignData.assigned_to ? parseInt(assignData.assigned_to) : null,
        status: assignData.status,
      };
      await dispatch(updateIssue({ id: selectedItem.issue_id, data: submitData })).unwrap();
      setIsAssignOpen(false);
    } catch (err) {
      // Error handled by slice
    } finally {
      setFormLoading(false);
    }
  };

  const handleResolve = async (item) => {
    try {
      await dispatch(resolveIssue(item.issue_id)).unwrap();
    } catch (err) {
      // Error handled by slice
    }
  };

  const handleAssignInputChange = (e) => {
    const { name, value } = e.target;
    setAssignData((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate stats
  const openCount = issues.data.filter(d => d.status === 'open').length;
  const inProgressCount = issues.data.filter(d => d.status === 'in_progress').length;
  const resolvedCount = issues.data.filter(d => d.status === 'resolved' || d.status === 'closed').length;

  // Custom actions for issues
  const customActions = (item) => {
    if (item.status === 'open' || item.status === 'in_progress') {
      return (
        <button
          onClick={() => handleAssign(item)}
          className="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors"
        >
          {item.assigned_to ? 'Reassign' : 'Assign'}
        </button>
      );
    }
    return null;
  };

  return (
    <MainLayout>
      <PageHeader
        title="Issue Management"
        subtitle="Lihat laporan masalah dari aplikasi mobile"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Issue' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Issue</p>
          <p className="text-2xl font-bold text-gray-800">{issues.pagination.total || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-600 mb-1">Open</p>
          <p className="text-2xl font-bold text-blue-700">{openCount}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-yellow-600 mb-1">In Progress</p>
          <p className="text-2xl font-bold text-yellow-700">{inProgressCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Resolved</p>
          <p className="text-2xl font-bold text-green-700">{resolvedCount}</p>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari judul atau lokasi..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={true}
        onExport={() => console.log('Export issues')}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={issues.data}
          onView={handleView}
          actionColumn={{ edit: false, delete: false, view: true }}
          customActions={customActions}
          currentPage={issues.pagination.page}
          totalPages={issues.pagination.totalPages}
          totalItems={issues.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* View Modal */}
      <Modal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        title="Detail Issue"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{selectedItem.issue_title || selectedItem.title}</h3>
              <div className="flex items-center gap-3 mt-2">
                <StatusBadge status={selectedItem.priority} />
                <StatusBadge status={selectedItem.status} />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">{selectedItem.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Lokasi</p>
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">{selectedItem.room?.room_name || selectedItem.location || '-'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tanggal Lapor</p>
                <div className="flex items-center gap-2">
                  <FiCalendar size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">
                    {selectedItem.createdAt
                      ? new Date(selectedItem.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '-'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Pelapor</p>
                <div className="flex items-center gap-2">
                  <AvatarWithFallback src={selectedItem.user?.photo_1} alt={selectedItem.user?.full_name} size={24} />
                  <span className="text-sm font-medium">{selectedItem.user?.full_name || '-'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Ditugaskan ke</p>
                {selectedItem.assignee?.full_name ? (
                  <div className="flex items-center gap-2">
                    <AvatarWithFallback src={selectedItem.assignee?.photo_1} alt={selectedItem.assignee?.full_name} size={24} />
                    <span className="text-sm font-medium">{selectedItem.assignee?.full_name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">Belum ditugaskan</span>
                )}
              </div>
            </div>

            {(selectedItem.photo_1 || selectedItem.photo_2) && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Foto Lampiran</p>
                <div className="flex gap-2">
                  {selectedItem.photo_1 && (
                    <div className="w-1/2 h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <ImageWithFallback src={selectedItem.photo_1} alt="Issue Photo 1" className="w-full h-full" />
                    </div>
                  )}
                  {selectedItem.photo_2 && (
                    <div className="w-1/2 h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <ImageWithFallback src={selectedItem.photo_2} alt="Issue Photo 2" className="w-full h-full" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {(selectedItem.status === 'open' || selectedItem.status === 'in_progress') && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsViewOpen(false);
                    handleAssign(selectedItem);
                  }}
                  className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {selectedItem.assigned_to ? 'Reassign' : 'Assign'}
                </button>
                {selectedItem.status === 'in_progress' && (
                  <button
                    onClick={() => {
                      setIsViewOpen(false);
                      handleResolve(selectedItem);
                    }}
                    className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        title="Assign Issue"
        onSubmit={handleSubmitAssign}
        loading={formLoading}
        size="md"
      >
        <FormInput
          label="Ditugaskan ke"
          name="assigned_to"
          type="select"
          value={assignData.assigned_to}
          onChange={handleAssignInputChange}
          options={userOptions}
          placeholder="Pilih petugas"
        />
        <FormInput
          label="Status"
          name="status"
          type="select"
          value={assignData.status}
          onChange={handleAssignInputChange}
          options={statuses}
          required
        />
      </Modal>
    </MainLayout>
  );
};

export default Issue;
