import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import MainLayout from '../layouts/MainLayout';
import {
  DataTable,
  Modal,
  SearchFilter,
  StatusBadge,
  PageHeader,
  ImageWithFallback,
} from '../components/ui';
import { FiAlertCircle, FiMapPin, FiCalendar, FiLoader, FiPackage, FiClock, FiCheckCircle, FiXCircle, FiUser, FiTool } from 'react-icons/fi';
import { fetchItems, fetchIssueStats, clearDataError, clearDataSuccess } from '../store/dataSlice';
import { issuesAPI } from '../services/api';

const Issue = () => {
  const dispatch = useDispatch();
  const { items, issues, loading, error, success } = useSelector((state) => state.data);

  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemIssues, setItemIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(false);

  const itemsPerPage = 10;

  const conditions = [
    { value: 'good', label: 'Baik' },
    { value: 'damaged', label: 'Rusak' },
    { value: 'maintenance', label: 'Maintenance' },
  ];

  // Load items with their issues
  const loadItems = useCallback(() => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchValue,
      ...filterValues,
    };
    dispatch(fetchItems(params));
  }, [dispatch, currentPage, itemsPerPage, searchValue, filterValues]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Load issue stats
  useEffect(() => {
    dispatch(fetchIssueStats());
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
      loadItems();
      dispatch(fetchIssueStats()); // Reload stats
      // Reload issues for selected item if modal is open
      if (selectedItem) {
        loadItemIssues(selectedItem.item_id);
      }
    }
  }, [success, dispatch, loadItems]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, filterValues]);

  // Load issues for a specific item
  const loadItemIssues = async (itemId) => {
    setIssuesLoading(true);
    try {
      const response = await issuesAPI.getAll({ item_id: itemId, limit: 100 });
      // Sort by createdAt descending (newest first)
      const sortedIssues = (response.data?.data || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setItemIssues(sortedIssues);
    } catch (err) {
      console.error('Error loading issues:', err);
      toast.error('Gagal memuat issue item');
      setItemIssues([]);
    } finally {
      setIssuesLoading(false);
    }
  };

  // Get issue count per status for an item
  const getIssueCounts = (itemIssues) => {
    if (!itemIssues || !Array.isArray(itemIssues)) return { pending: 0, inProgress: 0, resolved: 0, total: 0 };
    const pending = itemIssues.filter(i => parseInt(i.status) === 0).length;
    const inProgress = itemIssues.filter(i => parseInt(i.status) === 1).length;
    const resolved = itemIssues.filter(i => parseInt(i.status) === 2 || parseInt(i.status) === 4).length;
    return { pending, inProgress, resolved, total: itemIssues.length };
  };

  const columns = [
    {
      key: 'item_name',
      label: 'Item',
      render: (value, item) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {item.photo_1 ? (
              <ImageWithFallback src={item.photo_1} alt={value} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FiPackage className="text-gray-400" size={20} />
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{value}</p>
            <p className="text-xs text-gray-500">{item.item_code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category_item',
      label: 'Kategori',
      width: '150px',
      render: (value) => value?.category_item_name || '-',
    },
    {
      key: 'room',
      label: 'Lokasi',
      width: '150px',
      render: (value, item) => (
        <div className="text-sm">
          <p className="font-medium">{value?.room_name || '-'}</p>
          <p className="text-xs text-gray-500">{item.building?.building_name || ''}</p>
        </div>
      ),
    },
    {
      key: 'item_condition',
      label: 'Kondisi',
      width: '100px',
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: 'issues',
      label: 'Issues',
      width: '180px',
      render: (value) => {
        const counts = getIssueCounts(value);
        if (counts.total === 0) return <span className="text-gray-400 text-sm">Tidak ada issue</span>;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{counts.total} issue</span>
            <div className="flex items-center gap-1">
              {counts.pending > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded">{counts.pending}</span>
              )}
              {counts.inProgress > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">{counts.inProgress}</span>
              )}
              {counts.resolved > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">{counts.resolved}</span>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const filters = [
    {
      key: 'item_condition',
      label: 'Kondisi',
      options: conditions,
    },
  ];

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleViewTimeline = (item) => {
    setSelectedItem(item);
    setIsTimelineOpen(true);
    loadItemIssues(item.item_id);
  };

  // Get status color for timeline
  const getStatusColor = (status) => {
    const statusNum = parseInt(status);
    switch (statusNum) {
      case 0: return 'bg-yellow-500';
      case 1: return 'bg-blue-500';
      case 2: return 'bg-green-500';
      case 3: return 'bg-red-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status icon for timeline
  const getStatusIcon = (status) => {
    const statusNum = parseInt(status);
    switch (statusNum) {
      case 0: return <FiClock className="text-yellow-500" size={16} />;
      case 1: return <FiTool className="text-blue-500" size={16} />;
      case 2: return <FiCheckCircle className="text-green-500" size={16} />;
      case 3: return <FiXCircle className="text-red-500" size={16} />;
      case 4: return <FiCheckCircle className="text-green-500" size={16} />;
      default: return <FiClock className="text-gray-500" size={16} />;
    }
  };

  // Get stats from API
  const getStatusCount = (status) => {
    if (!issues.stats?.issuesByStatus) return 0;
    const found = issues.stats.issuesByStatus.find(s => parseInt(s.status) === status);
    return found ? parseInt(found.count) : 0;
  };

  const totalIssues = issues.stats?.totalIssues || 0;
  const pendingIssues = getStatusCount(0);
  const inProgressIssues = getStatusCount(1);
  const resolvedIssues = getStatusCount(2) + getStatusCount(4);

  // Custom actions - only show view for items with issues
  const customActions = (item) => {
    const hasIssues = item.issues && item.issues.length > 0;
    if (!hasIssues) return null;
    return (
      <button
        onClick={() => handleViewTimeline(item)}
        className="px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors flex items-center gap-1"
      >
        <FiAlertCircle size={14} />
        {item.issues.length} Issue
      </button>
    );
  };

  return (
    <MainLayout>
      <PageHeader
        title="Issue Management"
        subtitle="Kelola laporan masalah per item"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Issue' },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Total Issue</p>
          <p className="text-2xl font-bold text-gray-800">{totalIssues}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-yellow-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">{pendingIssues}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-600 mb-1">Diproses</p>
          <p className="text-2xl font-bold text-blue-700">{inProgressIssues}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600 mb-1">Selesai</p>
          <p className="text-2xl font-bold text-green-700">{resolvedIssues}</p>
        </div>
      </div>

      <SearchFilter
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Cari item..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        showExport={false}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={items.data}
          actionColumn={{ edit: false, delete: false, view: false }}
          customActions={customActions}
          currentPage={items.pagination.page}
          totalPages={items.pagination.totalPages}
          totalItems={items.pagination.total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          emptyMessage="Tidak ada item"
        />
      )}

      {/* Timeline Modal */}
      <Modal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        title="Issue Timeline"
        showFooter={false}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            {/* Item Info with image */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-4">
                {/* Item Images */}
                <div className="flex gap-2 flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                    {selectedItem.photo_1 ? (
                      <ImageWithFallback
                        src={selectedItem.photo_1}
                        alt={selectedItem.item_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiPackage className="text-gray-400" size={28} />
                      </div>
                    )}
                  </div>
                  {selectedItem.photo_2 && (
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                      <ImageWithFallback
                        src={selectedItem.photo_2}
                        alt={selectedItem.item_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 text-lg">{selectedItem.item_name}</h4>
                  <p className="text-sm text-gray-500">{selectedItem.item_code}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FiMapPin size={14} />
                      <span>{selectedItem.room?.room_name || '-'}</span>
                    </div>
                    <StatusBadge status={selectedItem.item_condition} size="sm" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Kategori: {selectedItem.category_item?.category_item_name || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Issue Timeline */}
            <div className="border-t pt-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <FiAlertCircle size={16} />
                Riwayat Issue ({itemIssues.length})
              </h5>

              {issuesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <FiLoader className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : itemIssues.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Tidak ada issue untuk item ini</p>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-4">
                    {itemIssues.map((issue) => {
                      const statusNum = parseInt(issue.status);
                      const isActive = statusNum === 0 || statusNum === 1;

                      return (
                        <div key={issue.issue_history_id} className="relative pl-10">
                          {/* Timeline dot */}
                          <div className={`absolute left-2 w-5 h-5 rounded-full ${getStatusColor(issue.status)} flex items-center justify-center`}>
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>

                          {/* Issue Card */}
                          <div className={`bg-white border rounded-lg p-4 shadow-sm ${isActive ? 'border-l-4 border-l-primary' : ''}`}>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  {getStatusIcon(issue.status)}
                                  <span className="text-sm font-medium text-gray-800">{issue.issue_title || 'Issue'}</span>
                                  <StatusBadge status={issue.status} size="sm" />
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{issue.issue_description || '-'}</p>

                                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                                  <div className="flex items-center gap-1">
                                    <FiCalendar size={12} />
                                    <span>
                                      {issue.createdAt
                                        ? new Date(issue.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                                        : '-'}
                                    </span>
                                  </div>
                                  {issue.user && (
                                    <div className="flex items-center gap-1">
                                      <FiUser size={12} />
                                      <span>{issue.user.full_name}</span>
                                    </div>
                                  )}
                                  {issue.oleh && (
                                    <div className="flex items-center gap-1">
                                      <FiTool size={12} />
                                      <span>Teknisi: {issue.oleh}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Issue photos if available */}
                            {(issue.photo_1 || issue.photo_2) && (
                              <div className="flex gap-2 mt-3 pt-3 border-t">
                                {issue.photo_1 && (
                                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                                    <ImageWithFallback src={issue.photo_1} alt="Issue Photo 1" className="w-full h-full object-cover" />
                                  </div>
                                )}
                                {issue.photo_2 && (
                                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                                    <ImageWithFallback src={issue.photo_2} alt="Issue Photo 2" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

    </MainLayout>
  );
};

export default Issue;
