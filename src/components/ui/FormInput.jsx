const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  options = [],
  rows = 3,
  className = '',
  helperText,
  noDefaultOption = false, // Skip adding default "Pilih..." option
}) => {
  const baseInputClass = `w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
    error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200'
  } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={`${baseInputClass} resize-none`}
          />
        );

      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={baseInputClass}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            type="file"
            name={name}
            onChange={onChange}
            disabled={disabled}
            className={`${baseInputClass} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20`}
          />
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              disabled={disabled}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20"
            />
            <span className="text-sm text-gray-700">{placeholder}</span>
          </label>
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClass}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && type !== 'checkbox' && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
