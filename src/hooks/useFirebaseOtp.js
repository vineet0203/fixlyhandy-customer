import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useState, useEffect, useRef } from 'react';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let auth;

const getFirebaseAuth = () => {
  if (!firebaseConfig.apiKey) {
    throw new Error('Phone verification is not configured for this app.');
  }

  if (!auth) {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  }

  return auth;
};

export function useFirebaseOtp() {
  const [phoneSent, setPhoneSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneTimer, setPhoneTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);

  const recaptchaVerifierRef = useRef(null);
  const confirmationResultRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Format phone number to +91 format (India)
  const formatPhoneNumber = (phone) => {
    if (!phone) throw new Error('Invalid phone number format.');
    const cleaned = phone.replace(/\D/g, '').replace(/^0+/, '');
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    throw new Error('Invalid phone number format.');
  };

  // Resend Timer countdown
  useEffect(() => {
    if (phoneTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setPhoneTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [phoneTimer]);

  // Clean up reCAPTCHA verifier on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {
          // ignore cleanup errors
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const initRecaptcha = () => {
    if (recaptchaVerifierRef.current) return;

    try {
      recaptchaVerifierRef.current = new RecaptchaVerifier(getFirebaseAuth(), 'recaptcha-container-otp', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setPhoneError('reCAPTCHA expired. Please try again.');
        }
      });
    } catch (err) {
      setPhoneError('Failed to initialize security verification.');
      console.error(err);
    }
  };

  const handleFirebaseError = (error) => {
    const code = error?.code || '';
    if (code.includes('too-many-requests')) {
      return 'Too many attempts. Try again later.';
    }
    if (code.includes('invalid-phone-number')) {
      return 'Invalid phone number format.';
    }
    if (code.includes('invalid-verification-code')) {
      return 'Invalid OTP. Please try again.';
    }
    if (code.includes('code-expired')) {
      return 'OTP expired. Request a new one.';
    }
    return error.message || 'An error occurred. Please try again.';
  };

  const sendOtp = async (phoneNumber) => {
    setSending(true);
    setPhoneError('');
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      initRecaptcha();

      const appVerifier = recaptchaVerifierRef.current;
      const confirmationResult = await signInWithPhoneNumber(getFirebaseAuth(), formattedPhone, appVerifier);
      confirmationResultRef.current = confirmationResult;
      setPhoneSent(true);
      setPhoneTimer(45);
      alert('Verification code sent successfully.');
    } catch (err) {
      setPhoneError(handleFirebaseError(err));
      // reset reCAPTCHA on error so it can be re-rendered/re-solved
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (e) {}
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendPhoneOtp = async (phoneNumber) => {
    await sendOtp(phoneNumber);
  };

  const handleResendPhoneOtp = async (phoneNumber) => {
    if (phoneTimer > 0) return;
    await sendOtp(phoneNumber);
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      setPhoneError('Please enter a 6-digit code.');
      return;
    }
    if (!confirmationResultRef.current) {
      setPhoneError('No OTP request found. Please request a new code.');
      return;
    }

    setVerifying(true);
    setPhoneError('');
    try {
      const result = await confirmationResultRef.current.confirm(phoneOtp);
      if (result.user) {
        setPhoneVerified(true);
        alert('Mobile number verified successfully.');
      }
    } catch (err) {
      setPhoneError(handleFirebaseError(err));
    } finally {
      setVerifying(false);
    }
  };

  return {
    phoneSent,
    phoneOtp,
    phoneVerified,
    phoneError,
    phoneTimer,
    verifying,
    sending,
    setPhoneOtp,
    handleSendPhoneOtp,
    handleVerifyPhoneOtp,
    handleResendPhoneOtp,
  };
}
