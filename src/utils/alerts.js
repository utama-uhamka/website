import Swal from 'sweetalert2';

const customStyles = `
  .swal2-popup {
    border-radius: 16px;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .swal2-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }

  .swal2-html-container {
    font-size: 0.875rem;
    color: #6B7280;
    line-height: 1.5;
  }

  .swal2-confirm {
    background-color: #1E3F5F !important;
    border-radius: 12px !important;
    font-weight: 500 !important;
    padding: 0.75rem 1.5rem !important;
    font-size: 0.875rem !important;
  }

  .swal2-confirm:hover {
    background-color: #B8050F !important;
  }

  .swal2-cancel {
    background-color: #F3F4F6 !important;
    color: #374151 !important;
    border-radius: 12px !important;
    font-weight: 500 !important;
    padding: 0.75rem 1.5rem !important;
    font-size: 0.875rem !important;
  }

  .swal2-cancel:hover {
    background-color: #E5E7EB !important;
  }

  /* Toast styles */
  .swal2-toast {
    border-radius: 12px !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
  }

  .swal2-toast .swal2-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
  }

  .swal2-toast .swal2-html-container {
    font-size: 0.75rem;
    margin: 0;
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

// SUCCESS ALERTS
export const showSuccessAlert = {
  // Success Toast - Top Right
  topRight: (title, text = '') => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: '#F0FDF4',
      color: '#166534',
      iconColor: '#22C55E',
    });
  },

  // Success Toast - Top Center
  topCenter: (title, text = '') => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      position: 'top',
      toast: true,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: '#F0FDF4',
      color: '#166534',
      iconColor: '#22C55E',
    });
  },

  // Success Modal - Center
  center: (title, text = '', confirmButtonText = 'OK') => {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#22C55E',
      background: '#FFFFFF',
      color: '#111827',
      iconColor: '#22C55E',
    });
  }
};

// ERROR/FAILED ALERTS
export const showErrorAlert = {
  // Error Toast - Top Right
  topRight: (title, text = '') => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      background: '#FEF2F2',
      color: '#991B1B',
      iconColor: '#EF4444',
    });
  },

  // Error Toast - Top Center
  topCenter: (title, text = '') => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      position: 'top',
      toast: true,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      background: '#FEF2F2',
      color: '#991B1B',
      iconColor: '#EF4444',
    });
  },

  // Error Modal - Center
  center: (title, text = '', confirmButtonText = 'OK') => {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#EF4444',
      background: '#FFFFFF',
      color: '#111827',
      iconColor: '#EF4444',
    });
  }
};

// WARNING ALERTS
export const showWarningAlert = {
  // Warning Toast - Top Right
  topRight: (title, text = '') => {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
      background: '#FFFBEB',
      color: '#92400E',
      iconColor: '#F59E0B',
    });
  },

  // Warning Toast - Top Center
  topCenter: (title, text = '') => {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      position: 'top',
      toast: true,
      showConfirmButton: false,
      timer: 4500,
      timerProgressBar: true,
      background: '#FFFBEB',
      color: '#92400E',
      iconColor: '#F59E0B',
    });
  },

  // Warning Modal - Center
  center: (title, text = '', confirmButtonText = 'OK') => {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#F59E0B',
      background: '#FFFFFF',
      color: '#111827',
      iconColor: '#F59E0B',
    });
  }
};

// INFO ALERTS
export const showInfoAlert = {
  // Info Toast - Top Right
  topRight: (title, text = '') => {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: '#EFF6FF',
      color: '#1E40AF',
      iconColor: '#3B82F6',
    });
  },

  // Info Toast - Top Center
  topCenter: (title, text = '') => {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      position: 'top',
      toast: true,
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: '#EFF6FF',
      color: '#1E40AF',
      iconColor: '#3B82F6',
    });
  },

  // Info Modal - Center
  center: (title, text = '', confirmButtonText = 'OK') => {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonText: confirmButtonText,
      confirmButtonColor: '#3B82F6',
      background: '#FFFFFF',
      color: '#111827',
      iconColor: '#3B82F6',
    });
  }
};

// CONFIRMATION ALERTS
export const showConfirmAlert = {
  // Confirmation Modal - Center
  center: (title, text = '', confirmText = 'Yes', cancelText = 'Cancel') => {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#1E3F5F',
      cancelButtonColor: '#6B7280',
      background: '#FFFFFF',
      color: '#111827',
      iconColor: '#1E3F5F',
      reverseButtons: true,
    });
  },

  // Delete Confirmation
  delete: (title = 'Are you sure?', text = 'This action cannot be undone!') => {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      background: '#FFFFFF',
      color: '#111827',
      iconColor: '#F59E0B',
      reverseButtons: true,
    });
  }
};

// LOADING ALERTS
export const showLoadingAlert = {
  show: (title = 'Loading...', text = 'Please wait') => {
    return Swal.fire({
      title: title,
      text: text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  },

  close: () => {
    Swal.close();
  }
};

// CUSTOM TOAST (with custom colors)
export const showCustomToast = (options) => {
  const defaultOptions = {
    position: 'top-end',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  };

  return Swal.fire({
    ...defaultOptions,
    ...options
  });
};
