import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';

// Generic hook for handling API responses with toast notifications
export const useApiResponse = (slice, options = {}) => {
  const dispatch = useDispatch();
  const { error, success, loading } = useSelector((state) => state[slice]);
  const { clearError, clearSuccess } = options;

  useEffect(() => {
    if (error && clearError) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, clearError, dispatch]);

  useEffect(() => {
    if (success && clearSuccess) {
      toast.success(success);
      dispatch(clearSuccess());
    }
  }, [success, clearSuccess, dispatch]);

  return { error, success, loading };
};

// Hook for pagination
export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const getParams = (page, limit, search = '', filters = {}) => {
    const params = {
      page,
      limit,
    };

    if (search) {
      params.search = search;
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params[key] = value;
      }
    });

    return params;
  };

  return { getParams };
};

export default useApiResponse;
