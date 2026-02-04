import { FiEdit2, FiTrash2, FiEye, FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown } from 'react-icons/fi';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  customActions,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onSort,
  sortColumn = '',
  sortDirection = 'asc',
  loading = false,
  emptyMessage = 'Tidak ada data',
  showActions = true,
  actionColumn = { edit: true, delete: true, view: false },
  canDelete, // Function to check if item can be deleted: (item) => boolean
  canEdit, // Function to check if item can be edited: (item) => boolean
}) => {
  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key] || '-';
  };

  const hasAnyAction = actionColumn.edit || actionColumn.delete || actionColumn.view || customActions;

  const handleSort = (columnKey) => {
    if (onSort) {
      const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(columnKey, newDirection);
    }
  };

  const renderSortIcon = (columnKey) => {
    if (!onSort) return null;

    if (sortColumn === columnKey) {
      return sortDirection === 'asc' ? (
        <FiChevronUp size={14} className="text-primary" />
      ) : (
        <FiChevronDown size={14} className="text-primary" />
      );
    }
    return (
      <div className="opacity-0 group-hover:opacity-50">
        <FiChevronUp size={14} />
      </div>
    );
  };

  // Calculate showing range
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-100 border-b"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 border-b flex items-center px-6 gap-4">
              {columns.map((_, idx) => (
                <div key={idx} className="h-4 bg-gray-200 rounded flex-1"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider group ${
                    column.sortable !== false && onSort ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                  } ${column.className || ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable !== false && onSort && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.label}</span>
                    {column.sortable !== false && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {showActions && hasAnyAction && (
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions && hasAnyAction ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-gray-700 ${column.cellClassName || ''}`}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {showActions && hasAnyAction && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {customActions && customActions(item)}
                        {actionColumn.view && onView && (
                          <button
                            onClick={() => onView(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat"
                          >
                            <FiEye size={16} />
                          </button>
                        )}
                        {actionColumn.edit && onEdit && (!canEdit || canEdit(item)) && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                        )}
                        {actionColumn.delete && onDelete && (!canDelete || canDelete(item)) && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {totalItems > 0 ? (
              <>Menampilkan {startItem} - {endItem} dari {totalItems} data</>
            ) : (
              <>Halaman {currentPage} dari {totalPages}</>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
