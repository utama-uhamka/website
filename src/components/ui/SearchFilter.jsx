import { FiSearch, FiFilter, FiX, FiPlus, FiDownload } from 'react-icons/fi';

const SearchFilter = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filters = [],
  onFilterChange,
  filterValues = {},
  onAdd,
  addLabel = 'Tambah Data',
  onExport,
  showExport = false,
}) => {
  const hasActiveFilters = Object.values(filterValues).some(
    (value) => value !== '' && value !== null && value !== undefined
  );

  const clearFilters = () => {
    filters.forEach((filter) => {
      onFilterChange(filter.key, '');
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <FiFilter className="text-gray-400" size={18} />
            {filters.map((filter) => (
              <select
                key={filter.key}
                value={filterValues[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white min-w-[140px]"
              >
                <option value="">{filter.placeholder || `Semua ${filter.label}`}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiX size={16} />
                Clear
              </button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          {showExport && onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FiDownload size={16} />
              Export
            </button>
          )}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
            >
              <FiPlus size={16} />
              {addLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
