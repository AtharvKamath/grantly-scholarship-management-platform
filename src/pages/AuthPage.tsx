import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  GraduationCap,
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Phone,
  KeyRound,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'admin-login';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { setUser, setStudentProfile, showToast, navigateTo } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot' | 'admin-login'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // OTP State
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [otpEmail, setOtpEmail] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(300); // 5 mins
  const [cooldown, setCooldown] = useState<number>(60); // 60s resend cooldown
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effects for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'otp' && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [mode, countdown]);

  useEffect(() => {
    let cdTimer: NodeJS.Timeout;
    if (mode === 'otp' && cooldown > 0) {
      cdTimer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(cdTimer);
  }, [mode, cooldown]);

  // Handle OTP digit entry
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste of entire code
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newArr = [...otpValues];
        for (let i = 0; i < 6; i++) {
          newArr[i] = pasted[i] || '';
        }
        setOtpValues(newArr);
        const nextIdx = Math.min(pasted.length, 5);
        otpInputRefs.current[nextIdx]?.focus();
        return;
      }
    }

    const digit = value.replace(/\D/g, '');
    const newArr = [...otpValues];
    newArr[index] = digit;
    setOtpValues(newArr);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Submit handlers
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both student email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.needsVerification) {
          setOtpEmail(data.email || email.trim());
          setMode('otp');
          setCountdown(300);
          setCooldown(60);
          showToast('Please verify your email address to complete registration.', 'info');
          return;
        }
        throw new Error(data.error || 'Invalid credentials.');
      }

      setUser(data.user);
      setStudentProfile((prev) => ({
        ...prev,
        fullName: data.user.fullName,
        email: data.user.email,
        phone: data.user.phone || prev.phone,
      }));
      showToast(`Welcome back, ${data.user.fullName}!`, 'success');
      navigateTo('dashboard', '/student/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to sign in. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter administrator email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid administrator credentials.');
      }

      setUser(data.user);
      showToast(`Administrator authenticated successfully.`, 'success');
      navigateTo('admin-overview', '/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Access Denied: Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Valid email address is required.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Valid contact phone number is required.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create student account.');
      }

      setOtpEmail(email.trim());
      setMode('otp');
      setCountdown(300);
      setCooldown(60);
      showToast('Verification code dispatched to your email address.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const enteredOtp = otpValues.join('');
    if (enteredOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    if (countdown <= 0) {
      setErrorMessage('Verification code has expired. Please click "Resend Code".');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code.');
      }

      setUser(data.user);
      setStudentProfile((prev) => ({
        ...prev,
        fullName: data.user.fullName,
        email: data.user.email,
        phone: phone || prev.phone,
      }));
      showToast('Email verified successfully! Welcome to GRANTLY.', 'success');
      navigateTo('dashboard', '/student/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not resend code.');
      }

      setCountdown(300);
      setCooldown(60);
      setOtpValues(['', '', '', '', '', '']);
      showToast('A new 6-digit verification code has been dispatched to your email.', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend verification code.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid registered email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      showToast(data.message || 'Password reset instructions have been sent.', 'info');
      setMode('login');
    } catch (err: any) {
      setErrorMessage('Failed to initiate password reset.');
    } finally {
      setLoading(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isAdminView = mode === 'admin-login';

  return (
    <div className="min-h-screen bg-[#F7F8FC] py-12 flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <button
            onClick={() => navigateTo('home', '/')}
            className="inline-flex items-center gap-2 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#142B4F] flex items-center justify-center text-white font-bold text-xl shadow-md">
              G
            </div>
            <span className="text-2xl font-black tracking-tight text-[#142B4F]">GRANTLY</span>
          </button>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' && 'Student Portal Sign In'}
            {mode === 'register' && 'Student Portal Registration'}
            {mode === 'otp' && 'Verify Your Email Address'}
            {mode === 'admin-login' && 'Administrator Portal Login'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h2>

          <p className="text-xs text-slate-500">
            {mode === 'login' && 'Access AI recommendations, track applications, and manage deadlines.'}
            {mode === 'register' && 'Create your verified student account to discover matching educational grants.'}
            {mode === 'otp' && 'We have sent a six-digit verification code to your registered email address.'}
            {mode === 'admin-login' && 'Authorized institutional and platform administrators only.'}
            {mode === 'forgot' && 'Enter your registered email to receive account recovery instructions.'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {/* Admin badge */}
          {isAdminView && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Restricted Access: Authorized administrator credentials required.</span>
            </div>
          )}

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. STUDENT LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setMode('forgot');
                    }}
                    className="text-[11px] text-[#6546E8] hover:underline cursor-pointer font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Student Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. STUDENT REGISTRATION FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Atharv Kulkarni"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account & Dispatching OTP...' : 'Register & Send Email OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. DEDICATED 6-DIGIT OTP VERIFICATION SCREEN */}
          {mode === 'otp' && (
            <div className="space-y-5">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 text-center">
                <span>Code sent to: <strong>{otpEmail}</strong></span>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 text-center mb-2">
                    Enter 6-Digit Email Verification Code:
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {otpValues.map((val, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-12 text-center text-lg font-bold text-slate-900 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-[#6546E8] focus:ring-2 focus:ring-purple-200 bg-white"
                      />
                    ))}
                  </div>
                </div>

                {/* Expiry Countdown & Resend */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    Expires in: <strong className={countdown <= 30 ? 'text-rose-600 font-mono' : 'text-slate-800 font-mono'}>
                      {formatSeconds(countdown)}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={cooldown > 0}
                    className={`font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                      cooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-[#6546E8] hover:underline'
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{cooldown > 0 ? `Resend OTP in (${cooldown}s)` : 'Resend OTP'}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpValues.join('').length !== 6 || countdown <= 0}
                  className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Verifying OTP...' : 'Verify & Access Student Portal'}</span>
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('register');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Change registration details
                </button>
              </div>
            </div>
          )}

          {/* 4. FORGOT PASSWORD */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@college.edu"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Dispatching Instructions...' : 'Send Password Reset Email'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('login');
                  }}
                  className="text-xs text-[#6546E8] hover:underline font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 5. ADMINISTRATOR LOGIN FORM (No public registration) */}
          {mode === 'admin-login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@grantly.edu"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#6546E8] bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#142B4F] hover:bg-[#6546E8] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{loading ? 'Authenticating Admin...' : 'Sign In to Admin Portal'}</span>
              </button>
            </form>
          )}

          {/* Footer Navigation Links */}
          <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100 space-y-2">
            {mode === 'login' && (
              <p>
                Don't have a student account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('register');
                    navigateTo('register', '/register');
                  }}
                  className="font-semibold text-[#6546E8] hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already have a student account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('login');
                    navigateTo('login', '/login');
                  }}
                  className="font-semibold text-[#6546E8] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}

            {/* Portal separation switcher */}
            <div className="pt-2">
              {isAdminView ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('login');
                    navigateTo('login', '/login');
                  }}
                  className="text-[11px] text-slate-500 hover:text-[#142B4F] flex items-center justify-center gap-1 mx-auto cursor-pointer font-medium"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Are you a student? Switch to Student Login</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('admin-login');
                    navigateTo('admin-login', '/admin/login');
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Administrative Staff Portal</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-[11px] text-center text-slate-400">
          Protected by GRANTLY 256-bit institutional encryption. Dedicated to THE OUTPOST Hackathon.
        </p>
      </div>
    </div>
  );
};
