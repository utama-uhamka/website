import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtpAsync, resendOtpAsync, clearError, clearOtpState } from '../store/authSlice';
import { FiAlertCircle, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const OTP_DURATION = 5 * 60; // 5 minutes

const OTPVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, isAuthenticated, otpRequired, otpEmail, otpPassword } = useSelector(
    (state) => state.auth
  );

  // Redirect if not in OTP flow
  useEffect(() => {
    if (!otpRequired || !otpEmail) {
      navigate('/login');
    }
  }, [otpRequired, otpEmail, navigate]);

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Masukkan kode OTP lengkap (6 digit)');
      return;
    }
    dispatch(verifyOtpAsync({ email: otpEmail, otp: otpCode }));
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    try {
      await dispatch(resendOtpAsync({ email: otpEmail, password: otpPassword })).unwrap();
      toast.success('Kode OTP baru telah dikirim ke email Anda');
      setOtp(['', '', '', '', '', '']);
      setCountdown(OTP_DURATION);
      setCanResend(false);
      inputRefs.current[0]?.focus();
      // Restart timer
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // Error handled by slice
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    dispatch(clearOtpState());
    navigate('/login');
  };

  if (!otpRequired || !otpEmail) return null;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-8 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 rounded-full p-3">
              <FiMail size={28} />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Verifikasi OTP</h1>
          <p className="text-purple-200 text-sm">
            Masukkan kode 6 digit yang telah dikirim ke
          </p>
          <p className="text-white font-medium text-sm mt-1">{otpEmail}</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <FiAlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Timer */}
          <div className="text-center mb-6">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500">
                Kode berlaku dalam{' '}
                <span className="font-bold text-primary">{formatTime(countdown)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-500 font-medium">
                Kode OTP sudah kadaluarsa
              </p>
            )}
          </div>

          {/* OTP Inputs */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={loading}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition disabled:bg-gray-100"
                />
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || countdown === 0}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transform hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                'Verifikasi'
              )}
            </button>
          </form>

          {/* Resend & Back */}
          <div className="mt-6 text-center space-y-3">
            <div className="text-sm text-gray-500">
              Tidak menerima kode?{' '}
              {canResend ? (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="text-primary font-semibold hover:underline disabled:opacity-50"
                >
                  {resending ? 'Mengirim...' : 'Kirim Ulang'}
                </button>
              ) : (
                <span className="text-gray-400">
                  Kirim ulang dalam {formatTime(countdown)}
                </span>
              )}
            </div>
            <button
              onClick={handleBackToLogin}
              className="text-sm text-primary hover:underline"
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
