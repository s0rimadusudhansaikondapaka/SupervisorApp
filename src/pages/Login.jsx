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
} from '@ionic/react';
import { shieldCheckmark, keyOutline, personOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';

export default function Login({ history }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('supervisor@ashram.org');
  const [password, setPassword] = useState('ashram123');
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(false);

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

                <IonItem lines="inset" style={{ marginBottom: '1.5rem', '--background': '#f8fafc', borderRadius: '8px' }}>
                  <IonIcon icon={keyOutline} slot="start" style={{ color: '#800000' }} />
                  <IonLabel position="stacked" style={{ color: '#475569' }}>Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value)}
                    required
                  />
                </IonItem>

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

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={3000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
}
