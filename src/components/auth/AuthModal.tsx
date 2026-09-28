import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building,
  HardHat,
  CheckCircle,
  ArrowRight,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Factory,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  mode: 'signin' | 'signup' | null;
  onClose: () => void;
  onSwitchMode: (mode: 'signin' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSwitchMode }) => {
  const { registerUser, signIn, authConfigured } = useApp();

  // Signup choice: 'select' | 'buyer' | 'seller'
  const [signupRole, setSignupRole] = useState<'select' | 'buyer' | 'seller'>('select');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!mode) {
      setSignupRole('select');
      setRegName('');
      setRegCompany('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setRegPasswordConfirm('');
      setLoginEmail('');
      setLoginPassword('');
      setSubmitError('');
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, onClose]);

  if (!mode) return null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regCompany.trim() || !regEmail.trim() || !regPhone.trim() || regPassword.length < 8) {
      return;
    }
    if (regPassword !== regPasswordConfirm) {
      setSubmitError('Passwords do not match.');
      return;
    }
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const success = await registerUser({
        role: signupRole === 'seller' ? 'seller' : 'buyer',
        name: regName.trim(),
        companyName: regCompany.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword
      });
      if (success) onClose();
    } catch {
      setSubmitError('Account creation failed. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const success = await signIn(loginEmail.trim(), loginPassword);
      if (success) onClose();
    } catch {
      setSubmitError('Sign in failed. Check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign in and sign up"
          title="Close"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#12304A] via-[#163E61] to-[#1E5A85] text-white p-6 rounded-t-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F28C28]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#F28C28] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3 text-white" />
              ART Industrial Procurement Network
            </div>
            <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {mode === 'signup' ? 'Create Your Account' : 'Sign In to ART Industrial'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              {mode === 'signup'
                ? 'Join Bangladesh’s premier B2B industrial supply and quotation platform.'
                : 'Access your RFQ bids, quotations, procurement orders, and verified catalog.'}
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SIGN UP FLOW: Show "As a Seller" or "As a Buyer (Bidder)"     */}
        {/* ============================================================== */}
        {mode === 'signup' && (
          <div className="p-6 space-y-6">
            {!authConfigured && (
              <div className="border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-950">
                Registration is unavailable until the Supabase project is configured for this deployment.
              </div>
            )}
            {signupRole === 'select' ? (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-[#1E5A85] uppercase tracking-wider">
                    Step 1 of 2: Select Your Account Type
                  </span>
                  <p className="text-sm font-bold text-[#12304A]">
                    How will you be using the ART Industrial Platform?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  {/* OPTION 1: AS A BUYER */}
                  <div
                    onClick={() => setSignupRole('buyer')}
                    className="group border-2 border-slate-200 hover:border-[#1E5A85] bg-white hover:bg-slate-50/80 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-[#12304A]/10 text-[#12304A] group-hover:bg-[#12304A] group-hover:text-white flex items-center justify-center transition-colors">
                        <Factory className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="inline-block bg-blue-100 text-[#12304A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                          Procurement Buyer
                        </span>
                        <h3 className="font-bold text-base text-[#12304A] group-hover:text-[#1E5A85]">
                          As a Buyer
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          For factories, mills & corporate procurement officers looking to purchase spares.
                        </p>
                      </div>

                      <ul className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Post RFQs from Cart or Catalog</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Receive competing bids from suppliers</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Accept, Decline, or Counter Offer</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full py-2.5 px-3 bg-[#12304A] group-hover:bg-[#1E5A85] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Select Buyer Account</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F28C28]" />
                    </button>
                  </div>

                  {/* OPTION 2: AS A SELLER (BIDDER) */}
                  <div
                    onClick={() => setSignupRole('seller')}
                    className="group border-2 border-slate-200 hover:border-[#F28C28] bg-white hover:bg-slate-50/80 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-lg bg-[#F28C28]/10 text-[#F28C28] group-hover:bg-[#F28C28] group-hover:text-white flex items-center justify-center transition-colors">
                        <HardHat className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1">
                          Supplier / Bidder
                        </span>
                        <h3 className="font-bold text-base text-[#12304A] group-hover:text-[#F28C28]">
                          As a Seller (Bidder)
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          For authorized suppliers, stockists & vendors supplying components to factories.
                        </p>
                      </div>

                      <ul className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Access incoming factory RFQs in real-time</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Submit competitive pricing & lead-times</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Receive Buyer Counter Offers & Dispatch POs</span>
                        </li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full py-2.5 px-3 bg-[#F28C28] group-hover:bg-[#d9771b] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Select Seller / Bidder Account</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              /* Step 2: Quick Information Form for Chosen Role */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Creating Account:</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      signupRole === 'seller' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}>
                      {signupRole === 'seller' ? 'Seller / Bidder' : 'Buyer / Customer'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSignupRole('select')}
                    className="text-xs text-[#1E5A85] hover:underline font-semibold"
                  >
                    Change Role ←
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {signupRole === 'seller' ? 'Authorized Vendor / Company Name *' : 'Factory / Company Legal Name *'}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={regCompany}
                        onChange={e => setRegCompany(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E5A85] font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Contact Person Name *</label>
                      <div className="relative">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={e => setRegName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E5A85] font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Phone / Mobile *</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          required
                          value={regPhone}
                          onChange={e => setRegPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E5A85] font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Corporate Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={e => setRegEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E5A85] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="block font-bold text-slate-700 mb-1">Password (at least 8 characters) *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        id="signup-password"
                        type="password"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        value={regPassword}
                        onChange={e => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E5A85] font-medium"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="signup-password-confirm" className="block font-bold text-slate-700 mb-1">Confirm password *</label>
                    <input
                      id="signup-password-confirm"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={regPasswordConfirm}
                      onChange={e => setRegPasswordConfirm(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#1E5A85] font-medium"
                    />
                  </div>
                </div>

                {submitError && <p role="alert" className="text-xs font-medium text-rose-700">{submitError}</p>}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!authConfigured || isSubmitting}
                    className={`w-full py-3 px-4 font-bold text-xs uppercase tracking-wider text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed ${
                      signupRole === 'seller' ? 'bg-[#F28C28] hover:bg-[#d9771b]' : 'bg-[#12304A] hover:bg-[#1E5A85]'
                    }`}
                  >
                    <span>{isSubmitting ? 'Creating Account…' : `Create ${signupRole === 'seller' ? 'Seller' : 'Buyer'} Account`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            <div className="text-center pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={() => onSwitchMode('signin')}
                className="text-xs font-bold text-[#1E5A85] hover:underline"
              >
                Sign In here
              </button>
            </div>
          </div>
        )}

        {mode === 'signin' && (
          <div className="p-6 space-y-5">
            {!authConfigured && (
              <div className="border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-950">
                Sign-in is unavailable until the Supabase project is configured for this deployment.
              </div>
            )}
            <form onSubmit={handleSignIn} className="space-y-4 text-sm">
              <div>
                <label htmlFor="signin-email" className="block font-semibold text-slate-700 mb-1.5">Work email</label>
                <input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-sm outline-none focus:border-[#1E5A85] focus:ring-2 focus:ring-[#1E5A85]/15"
                />
              </div>
              {submitError && <p role="alert" className="text-xs font-medium text-rose-700">{submitError}</p>}
              <div>
                <label htmlFor="signin-password" className="block font-semibold text-slate-700 mb-1.5">Password</label>
                <input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-sm outline-none focus:border-[#1E5A85] focus:ring-2 focus:ring-[#1E5A85]/15"
                />
              </div>
              <button
                type="submit"
                disabled={!authConfigured || isSubmitting}
                className="w-full py-3 bg-[#12304A] hover:bg-[#1E5A85] disabled:bg-slate-400 text-white font-bold text-sm rounded-sm transition-colors"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
            <div className="text-center pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">New to ART Industrial? </span>
              <button
                type="button"
                onClick={() => onSwitchMode('signup')}
                className="text-sm font-bold text-[#1E5A85] hover:underline"
              >
                Create an account
              </button>
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
};
