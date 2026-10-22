import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
  IonIcon,
  IonModal,
} from '@ionic/react';
import { shieldCheckmark, keyOutline, personOutline, closeOutline, mailOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { forgotPassword, resetPassword } from '../services/api';

export default function Login({ history }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('supervisor@ashram.org');
  const [password, setPassword] = useState('ashram123');
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotTab, setForgotTab] = useState('request'); // 'request' | 'reset'
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotResetToken, setForgotResetToken] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotResetUrl, setForgotResetUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (res?.success) {
        history.replace('/home');
      } else {
        setToastMsg(res?.message || 'Login failed. Invalid supervisor credentials.');
      }
    } catch (err) {
      setToastMsg('Login failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResetLink = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');
    setForgotResetUrl('');

    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your email, phone, or username.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await forgotPassword(forgotIdentifier.trim());
      if (res?.success) {
        setForgotMsg(res.message || 'Password reset link sent to your email.');
        if (res.reset_url) setForgotResetUrl(res.reset_url);
      } else {
        setForgotError(res?.message || 'Failed to send reset link.');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetWithToken = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');

    if (!forgotResetToken.trim()) {
      setForgotError('Reset token is required.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await resetPassword(forgotResetToken.trim(), forgotNewPassword);
      if (res?.success) {
        setForgotMsg('Password reset successful! You can now log in.');
        setTimeout(() => {
          setShowForgotModal(false);
          setForgotMsg('');
          setPassword(forgotNewPassword);
          setToastMsg('Password changed! Ready to log in.');
        }, 1500);
      } else {
        setForgotError(res?.message || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Server error resetting password.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleQuickFill = (roleName) => {
    if (roleName === 'SUPERVISOR') {
      setIdentifier('supervisor@ashram.org');
      setPassword('ashram123');
    } else if (roleName === 'SECURITY_HEAD') {
      setIdentifier('head@ashram.org');
      setPassword('ashram123');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonTitle style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Ashram Security Supervisor
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <div style={{ maxWidth: '420px', margin: '2rem auto 0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', background: '#800000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.8rem auto', boxShadow: '0 4px 14px rgba(128,0,0,0.3)' }}>
              <IonIcon icon={shieldCheckmark} style={{ fontSize: '36px', color: '#f59e0b' }} />
            </div>
            <h2 style={{ margin: 0, fontWeight: 'bold', color: '#1e293b', fontSize: '1.3rem' }}>
              Supervisor Portal
            </h2>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Gate Security Oversight & Spot Approvals
            </p>
          </div>

          <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '14px' }}>
            <IonCardContent className="ion-padding">
              <form onSubmit={handleLogin}>
                <IonItem lines="inset" style={{ marginBottom: '1rem', '--background': '#f8fafc', borderRadius: '8px' }}>
                  <IonIcon icon={personOutline} slot="start" style={{ color: '#800000' }} />
                  <IonLabel position="stacked" style={{ color: '#475569' }}>Username / Email / Mobile</IonLabel>
                  <IonInput
                    type="text"
                    value={identifier}
                    onIonChange={(e) => setIdentifier(e.detail.value)}
                    required
                  />
                </IonItem>

                <IonItem lines="inset" style={{ marginBottom: '0.4rem', '--background': '#f8fafc', borderRadius: '8px' }}>
                  <IonIcon icon={keyOutline} slot="start" style={{ color: '#800000' }} />
                  <IonLabel position="stacked" style={{ color: '#475569' }}>Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value)}
                    required
                  />
                </IonItem>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem', paddingRight: '0.2rem' }}>
                  <button
                    type="button"
                    onClick={() => { setShowForgotModal(true); setForgotError(''); setForgotMsg(''); setForgotResetUrl(''); }}
                    style={{ background: 'none', border: 'none', color: '#800000', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <IonButton 
                  expand="block" 
                  type="submit" 
                  disabled={loading}
                  style={{ '--background': '#800000', fontWeight: 'bold', height: '48px', fontSize: '0.95rem' }}
                >
                  {loading ? 'Authenticating...' : 'LOG IN AS SUPERVISOR'}
                </IonButton>
              </form>

              <div style={{ marginTop: '1.2rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>
                  Quick Demo Accounts:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <IonButton size="small" fill="outline" style={{ '--color': '#800000', '--border-color': '#800000', fontSize: '0.72rem' }} onClick={() => handleQuickFill('SUPERVISOR')}>
                    Supervisor Suresh
                  </IonButton>
                  <IonButton size="small" fill="outline" style={{ '--color': '#b45309', '--border-color': '#b45309', fontSize: '0.72rem' }} onClick={() => handleQuickFill('SECURITY_HEAD')}>
                    Major Rajesh (Head)
                  </IonButton>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

        </div>

        {/* Forgot Password / Reset Password Modal */}
        <IonModal
          isOpen={showForgotModal}
          onDidDismiss={() => setShowForgotModal(false)}
          style={{ '--max-width': '420px', '--height': 'auto', '--border-radius': '16px' }}
        >
          <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IonIcon icon={keyOutline} style={{ color: '#800000' }} /> Password Recovery
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
              >
                <IonIcon icon={closeOutline} style={{ fontSize: '22px' }} />
              </button>
            </div>

            {/* Sub-tab selection */}
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => { setForgotTab('request'); setForgotError(''); setForgotMsg(''); }}
                style={{
                  flex: 1,
                  padding: '0.45rem',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: forgotTab === 'request' ? '#800000' : '#f1f5f9',
                  color: forgotTab === 'request' ? '#ffffff' : '#64748b',
                }}
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => { setForgotTab('reset'); setForgotError(''); setForgotMsg(''); }}
                style={{
                  flex: 1,
                  padding: '0.45rem',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: forgotTab === 'reset' ? '#800000' : '#f1f5f9',
                  color: forgotTab === 'reset' ? '#ffffff' : '#64748b',
                }}
              >
                Enter Reset Token
              </button>
            </div>

            {forgotError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.55rem 0.8rem', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '0.9rem' }}>
                {forgotError}
              </div>
            )}

            {forgotMsg && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '0.55rem 0.8rem', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '0.9rem' }}>
                {forgotMsg}
              </div>
            )}

            {forgotTab === 'request' ? (
              <form onSubmit={handleRequestResetLink}>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.8rem 0', lineHeight: 1.4 }}>
                  Enter your registered Email address, Phone, or Username to receive a reset link.
                </p>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>
                  <IonLabel position="stacked" style={{ color: '#475569' }}>Email, Phone, or Username</IonLabel>
                  <IonInput
                    type="text"
                    value={forgotIdentifier}
                    onIonChange={(e) => setForgotIdentifier(e.detail.value)}
                    placeholder="e.g. supervisor@ashram.org"
                    required
                  />
                </IonItem>

                <IonButton expand="block" type="submit" disabled={forgotLoading} style={{ '--background': '#800000', fontWeight: 'bold' }}>
                  {forgotLoading ? 'Sending...' : 'SEND RESET LINK'}
                </IonButton>

                {forgotResetUrl && (
                  <div style={{ marginTop: '0.9rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.7rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#92400e' }}>Direct Link:</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(forgotResetUrl);
                          setCopiedLink(true);
                          setTimeout(() => setCopiedLink(false), 2000);
                        }}
                        style={{ background: copiedLink ? '#166534' : '#800000', color: '#ffffff', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                      >
                        {copiedLink ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                    <a href={forgotResetUrl} style={{ fontSize: '0.75rem', color: '#800000', wordBreak: 'break-all' }}>
                      Open Reset Password Page
                    </a>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleResetWithToken}>
                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem' }}>
                  <IonLabel position="stacked" style={{ color: '#475569' }}>Reset Token</IonLabel>
                  <IonInput
                    type="text"
                    value={forgotResetToken}
                    onIonChange={(e) => setForgotResetToken(e.detail.value)}
                    placeholder="Paste 64-char token"
                    required
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem' }}>
                  <IonLabel position="stacked" style={{ color: '#475569' }}>New Password (min 6 chars)</IonLabel>
                  <IonInput
                    type="password"
                    value={forgotNewPassword}
                    onIonChange={(e) => setForgotNewPassword(e.detail.value)}
                    required
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '1.2rem' }}>
                  <IonLabel position="stacked" style={{ color: '#475569' }}>Confirm New Password</IonLabel>
                  <IonInput
                    type="password"
                    value={forgotConfirmPassword}
                    onIonChange={(e) => setForgotConfirmPassword(e.detail.value)}
                    required
                  />
                </IonItem>

                <IonButton expand="block" type="submit" disabled={forgotLoading} style={{ '--background': '#800000', fontWeight: 'bold' }}>
                  {forgotLoading ? 'Updating...' : 'SAVE NEW PASSWORD'}
                </IonButton>
              </form>
            )}
          </div>
        </IonModal>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
}
