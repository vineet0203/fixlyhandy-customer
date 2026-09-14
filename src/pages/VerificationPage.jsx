import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const VerificationPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('customer_profile');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  const [googleVerified, setGoogleVerified] = useState(!!profile.google_id);
  const [whatsappVerified, setWhatsappVerified] = useState(!!profile.whatsapp_verified_at);
  const [whatsappNumber, setWhatsappNumber] = useState(profile.whatsapp_number || '');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [debugOtp, setDebugOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // References for OTP inputs
  const otpInputsRef = useRef([]);

  // Tailwind already loaded in main.jsx

  const handleGoogleVerify = async () => {
    setError('');
    setSuccess('');
    const mockEmail = window.prompt(
      'Enter Google email or token to verify (e.g. mock_yourname@gmail.com for simulated mode):',
      profile.email || 'mock_customer@gmail.com'
    );
    if (!mockEmail) return;

    setLoading(true);
    try {
      const tokenVal = mockEmail.includes('@') && !mockEmail.startsWith('mock_') 
        ? `mock_${mockEmail}` 
        : mockEmail;

      const response = await apiClient.post('/api/v1/auth/verify/google', {
        id_token: tokenVal,
      });

      if (response.data.success) {
        const updatedCustomer = response.data.data;
        // Update local state & localStorage
        setGoogleVerified(true);
        const newProfile = { ...profile, ...updatedCustomer };
        setProfile(newProfile);
        localStorage.setItem('customer_profile', JSON.stringify(newProfile));
        setSuccess('Gmail account verified successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsappOtp = async () => {
    setError('');
    setSuccess('');
    if (!whatsappNumber.trim()) {
      setError('Please enter a valid WhatsApp number.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/verify/whatsapp/send', {
        whatsapp_number: whatsappNumber.trim(),
      });

      if (response.data.success) {
        setOtpSent(true);
        // Show OTP on frontend for testing in development/mock mode
        if (response.data.data?.otp) {
          setDebugOtp(response.data.data.otp);
        }
        setSuccess('WhatsApp verification code sent successfully.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send WhatsApp code.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/[^0-9]/.test(value) && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const verifyWhatsappOtp = async () => {
    setError('');
    setSuccess('');
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/auth/verify/whatsapp/verify', {
        otp: otpValue,
        whatsapp_number: whatsappNumber.trim(),
      });

      if (response.data.success) {
        const updatedCustomer = response.data.data;
        setWhatsappVerified(true);
        setOtpSent(false);
        setOtp(['', '', '', '', '', '']);
        setDebugOtp('');
        const newProfile = { ...profile, ...updatedCustomer };
        setProfile(newProfile);
        localStorage.setItem('customer_profile', JSON.stringify(newProfile));
        setSuccess('WhatsApp number verified successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'WhatsApp verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndContinue = () => {
    navigate('/dashboard', { replace: true });
  };

  const isEitherVerified = googleVerified || whatsappVerified;

  // Split name for visual display
  const nameParts = (profile.name || '').split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className="p-4 md:p-8">
      {/* BEGIN: MainContainer */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100" data-purpose="form-wrapper">
        
        {/* BEGIN: Sidebar */}
        <aside className="w-full md:w-80 bg-brand-navy text-white p-8 flex flex-col" data-purpose="sidebar">
          {/* Verified Badge Section */}
          <div className="flex flex-col items-center mb-10" data-purpose="verification-badge">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-2 border-brand-green mb-4">
              <div className="bg-brand-green p-4 rounded-full">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-center leading-tight">VERIFIED <br /> CUSTOMER</h2>
            <p className="text-xs text-gray-400 mt-4 text-center">
              Thank you for choosing <span className="text-brand-green font-semibold">FixlyHandy!</span>
            </p>
          </div>

          {/* Stepper Navigation */}
          <nav className="flex-grow space-y-6" data-purpose="stepper-navigation">
            {/* Step 1 */}
            <div className="relative flex items-start group stepper-line">
              <div className="z-10 flex items-center justify-center w-6 h-6 rounded-full bg-brand-green text-xs font-bold text-white shrink-0">1</div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-white">Personal Information</p>
                <p className="text-xs text-gray-400">Basic details</p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="relative flex items-start group stepper-line">
              <div className="z-10 flex items-center justify-center w-6 h-6 rounded-full bg-brand-green text-xs font-bold text-white shrink-0">2</div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-white">Contact Information</p>
                <p className="text-xs text-gray-400">How to reach you</p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="relative flex items-start group stepper-line">
              <div className="z-10 flex items-center justify-center w-6 h-6 rounded-full bg-brand-green text-xs font-bold text-white shrink-0">3</div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-white">Service Address</p>
                <p className="text-xs text-gray-400">Where we serve you</p>
              </div>
            </div>
            {/* Step 4 (Active / Verification) */}
            <div className="relative flex items-start group stepper-line">
              <div className={`z-10 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white shrink-0 ${isEitherVerified ? 'bg-brand-green' : 'bg-yellow-600 animate-pulse'}`}>4</div>
              <div className="ml-4">
                <p className={`text-sm font-semibold ${isEitherVerified ? 'text-brand-green' : 'text-white'}`}>
                  {isEitherVerified ? 'Verified ✓' : 'Verification'}
                </p>
                <p className="text-xs text-gray-400">Identity verification</p>
              </div>
            </div>
            {/* Step 5 */}
            <div className="relative flex items-start group stepper-line">
              <div className="z-10 flex items-center justify-center w-6 h-6 rounded-full bg-gray-700 text-xs font-bold text-gray-300 shrink-0">5</div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-300">Preferences</p>
                <p className="text-xs text-gray-500">Your service preferences</p>
              </div>
            </div>
            {/* Step 6 */}
            <div className="relative flex items-start group stepper-line-last">
              <div className="z-10 flex items-center justify-center w-6 h-6 rounded-full bg-gray-700 text-xs font-bold text-gray-300 shrink-0">6</div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-gray-300">Review &amp; Submit</p>
                <p className="text-xs text-gray-500">Confirm your details</p>
              </div>
            </div>
          </nav>

          {/* Sidebar Bottom Info */}
          <div className="mt-12 pt-8 border-t border-gray-700" data-purpose="sidebar-footer">
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl mb-6">
              <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <div className="text-[10px] text-gray-300 leading-tight">
                <p className="font-bold text-white mb-1">Your data is protected</p>
                <p>We use industry-standard encryption to keep your information safe.</p>
              </div>
            </div>
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span className="text-gray-300 font-medium">Need Help?</span>
              </div>
              <p className="text-brand-green font-semibold">support@fixlyhandy.com</p>
              <p className="text-white">(972) 555-0199</p>
              <p className="text-gray-500">Mon - Fri, 8AM - 6PM CST</p>
            </div>
          </div>
        </aside>
        {/* END: Sidebar */}

        {/* BEGIN: MainContent */}
        <main class="flex-grow p-8 md:p-12 overflow-y-auto" data-purpose="main-content">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4" data-purpose="top-header">
            <img alt="FixlyHandy Logo" className="h-16 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDztWVbU51S9bb4U_AxN4Lzjvvl5695_YQl0ETZJtQ1CRngx15k0IVB2Cf2Qawtz23TYjz9sT5vlmsniY9lFABywFV4jSs4D7RXBpQPZYC5FUJgCEHtPl8n5ggis9bYtFRohODuHnU57CEUwOBBbzR0Nj9o65xBhaVATFMtcixuKhOS6-VI0YqnFupprNAaAnSz0Mrz_fJwejPLLZDIlAL46R7lClIjUBpyc5-VZSCS8PKzqpMRXbOf-CWvf8Oaf-DXPLCfV-xN0IM" />
            <div className="flex items-center space-x-3 text-right">
              <div className="text-right">
                <h1 className="text-lg font-bold text-brand-green leading-none">VERIFIED CUSTOMER FORM</h1>
                <p className="text-[10px] text-gray-500 mt-1">Your information is secure and confidential. <span className="inline-block">🔒</span></p>
              </div>
              <div className="text-brand-green">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-10" data-purpose="progress-container">
            <div className="flex justify-between items-center mb-2">
              <div className="w-full bg-gray-100 rounded-full h-2 mr-4">
                <div className="bg-brand-green h-2 rounded-full" style={{ width: isEitherVerified ? '66.66%' : '50%' }}></div>
              </div>
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Step 4 of 6</span>
            </div>
          </div>

          {/* Banners for Alert/Success */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-xl">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-brand-green text-green-700 text-sm rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold">Success</p>
                <p>{success}</p>
              </div>
            </div>
          )}

          {/* Verification Options Section (Replacing the Email Verification Section) */}
          <section className="mb-12 border-b pb-10" data-purpose="verification-methods">
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Identity Verification</h3>
            <p className="text-sm text-gray-500 mb-8">Please choose at least one method below to verify your identity. Once verified, you will be able to access your dashboard and log in with this method.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Option 1 - Gmail Verification */}
              <div className="border border-gray-100 rounded-2xl p-6 bg-slate-50/50 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-500">Method 1</span>
                    {googleVerified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified ✓
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">Google OAuth</h4>
                  <p className="text-xs text-gray-500 mb-6">Instantly verify using your Gmail account. Secure and passwordless.</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {googleVerified ? (
                    <div className="flex items-center gap-2 text-brand-green font-bold text-sm">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Google Verified
                    </div>
                  ) : (
                    <button
                      onClick={handleGoogleVerify}
                      disabled={loading}
                      className="flex items-center gap-3 px-6 py-3 border-2 border-red-400 rounded-xl hover:bg-red-50 transition-colors text-sm font-semibold"
                    >
                      <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google icon" />
                      <span className="font-bold text-gray-700">Verify with Gmail</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Option 2 - WhatsApp Verification */}
              <div className="border border-gray-100 rounded-2xl p-6 bg-slate-50/50 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-green-500">Method 2</span>
                    {whatsappVerified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified ✓
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">WhatsApp OTP</h4>
                  <p className="text-xs text-gray-500 mb-6">Verify using a 6-digit OTP code sent directly to your WhatsApp number.</p>
                </div>

                <div className="space-y-4">
                  {whatsappVerified ? (
                    <div className="flex items-center gap-2 text-brand-green font-bold text-sm">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Verified Phone: {profile.whatsapp_number}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="+1 WhatsApp Number"
                          className="flex-grow px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none text-sm"
                          disabled={otpSent || loading}
                        />
                        <button
                          onClick={sendWhatsappOtp}
                          disabled={loading || !whatsappNumber.trim() || otpSent}
                          className="px-5 py-2.5 bg-brand-green hover:bg-green-700 text-white font-bold rounded-xl transition-all text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Send OTP
                        </button>
                      </div>

                      {/* Debug OTP Banner in dev mode */}
                      {debugOtp && (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl text-xs">
                          <p className="font-semibold">Dev/Mock Mode OTP: <span className="text-sm font-bold text-gray-900 tracking-widest">{debugOtp}</span></p>
                        </div>
                      )}

                      {otpSent && (
                        <div className="space-y-3 pt-2">
                          <p className="text-xs text-gray-500">Enter the 6-digit OTP code sent to your WhatsApp number:</p>
                          <div className="flex space-x-2" data-purpose="otp-inputs">
                            {otp.map((val, idx) => (
                              <input
                                key={idx}
                                ref={(el) => (otpInputsRef.current[idx] = el)}
                                className="w-10 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green outline-none"
                                maxLength={1}
                                type="text"
                                value={val}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                disabled={loading}
                              />
                            ))}
                          </div>
                          <button
                            onClick={verifyWhatsappOtp}
                            disabled={loading}
                            className="w-full py-2 bg-brand-navy hover:bg-slate-800 text-white font-bold rounded-xl transition-all text-sm"
                          >
                            Verify &amp; Link WhatsApp
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>

          {/* Form Section: Personal Info (Prefilled with customer details for premium experience) */}
          <section className="mb-12" data-purpose="personal-info-form">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                <svg className="w-6 h-6 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
                <p className="text-sm text-gray-500">Please review your basic information linked to this account.</p>
              </div>
            </div>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-gray-700">First Name</label>
                  <input className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 outline-none text-gray-600" value={firstName} readOnly type="text" />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-gray-700">Last Name</label>
                  <input className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 outline-none text-gray-600" value={lastName} readOnly type="text" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-gray-700">Email Address</label>
                <div className="relative">
                  <input className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 outline-none text-gray-600" value={profile.email || ''} readOnly type="email" />
                  <div className="absolute right-4 top-3.5 text-brand-green">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </form>
          </section>

          {/* Terms & Actions */}
          <div className="space-y-8" data-purpose="form-actions">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input checked readOnly className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer" type="checkbox" />
              <span className="text-sm text-gray-600">I agree to the <a className="text-brand-green font-bold hover:underline" href="#">Terms of Service</a> and <a className="text-brand-green font-bold hover:underline" href="#">Privacy Policy</a>.</span>
            </label>
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 gap-4">
              <button 
                onClick={() => navigate('/login')} 
                className="w-full md:w-auto px-10 py-3.5 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all"
              >
                Log Out / Cancel
              </button>
              
              <button 
                onClick={handleSaveAndContinue}
                disabled={!isEitherVerified || loading}
                className={`w-full md:w-auto px-12 py-3.5 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all ${
                  isEitherVerified && !loading
                    ? 'bg-brand-green hover:bg-green-700 shadow-green-200 cursor-pointer' 
                    : 'bg-gray-300 cursor-not-allowed shadow-none'
                }`}
              >
                <span>Save &amp; Continue</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
                </svg>
              </button>
            </div>
          </div>

        </main>
        {/* END: MainContent */}

      </div>
      {/* END: MainContainer */}

      {/* BEGIN: Footer */}
      <footer className="max-w-6xl mx-auto mt-8 px-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs" data-purpose="page-footer">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <img alt="FixlyHandy Small Logo" className="h-6 grayscale opacity-70" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe2k9hNFP8GxppZpQBR5D_w4vZCy8TBzJmrnRx2MR5sVk27o4kzsotLEM7sDZVWLGwl3mz5jiRQ2UEy7hSN9j0OXEgFQ54yu7EAmKoMJrv2G8YHLpaHjYn0gf8JEJYbELO8GgLrNmkW-GT6pY5pnnmF5h3rp8OZNFSQxZfVZdDbVMpAikwcTqQR-f7KMIz7RIPIPZHVOtA0xrIQImuSIy__mYfnS0EnxfSJ_ehNRNsG7qe73Bm_XDl52jzM0wsR4ZWLj_be44vzMY" />
          <p>© 2026 <span className="font-bold">FixlyHandy.</span> All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            <span className="font-medium">Trusted Service</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            <span className="font-medium">Verified Professionals</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            <span className="font-medium">Customer Focused</span>
          </div>
        </div>
      </footer>
      {/* END: Footer */}
    </div>
  );
};

export default VerificationPage;
