import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonToast,
  IonIcon,
} from '@ionic/react';
import { logOutOutline, serverOutline, shieldOutline, personOutline, keyOutline, lockClosedOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_API_BASE_URL, changePassword } from '../services/api';

export default function Settings({ history }) {
  const { user, selectedGate, setSelectedGate, apiUrl, setApiUrl, logout } = useAuth();
  const [customUrl, setCustomUrl] = useState(apiUrl);
  const [toastMsg, setToastMsg] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassLoading, setChangePassLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setToastMsg('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setToastMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setToastMsg('New passwords do not match.');
      return;
    }

    setChangePassLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res?.success) {
        setToastMsg('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setToastMsg(res?.message || 'Failed to update password.');
      }
    } catch (err) {
      setToastMsg(err.response?.data?.message || 'Server error changing password.');
    } finally {
      setChangePassLoading(false);
    }
  };

  const handleSaveApi = () => {
    setApiUrl(customUrl);
    setToastMsg('Backend API endpoint saved successfully!');
  };

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Supervisor Settings</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        
        {/* Supervisor Profile Card */}
        <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '14px', marginBottom: '1rem' }}>
          <IonCardContent className="ion-padding">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <IonIcon icon={personOutline} style={{ fontSize: '24px', color: '#800000' }} />
              <div>
                <strong style={{ fontSize: '1rem', color: '#1e293b' }}>{user?.name || 'Suresh Supervisor'}</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
                  {user?.role || 'SUPERVISOR'} • {user?.email || 'supervisor@ashram.org'}
                </span>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Gate Selection */}
        <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '14px', marginBottom: '1rem' }}>
          <IonCardContent className="ion-padding">
            <h4 style={{ margin: '0 0 0.6rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Active Gate Oversight
            </h4>
            <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px' }}>
              <IonLabel position="stacked">Assigned Gate</IonLabel>
              <IonSelect value={selectedGate} onIonChange={(e) => setSelectedGate(e.detail.value)}>
                <IonSelectOption value="NORTH_GATE">North Gate (Main Gate)</IonSelectOption>
                <IonSelectOption value="SOUTH_GATE">South Gate</IonSelectOption>
                <IonSelectOption value="EAST_GATE">East Gate</IonSelectOption>
                <IonSelectOption value="WEST_GATE">West Gate</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* Change Password Card */}
        <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '14px', marginBottom: '1rem' }}>
          <IonCardContent className="ion-padding">
            <h4 style={{ margin: '0 0 0.8rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <IonIcon icon={keyOutline} style={{ color: '#800000' }} /> Change Password
            </h4>
            <form onSubmit={handleChangePassword}>
              <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.6rem' }}>
                <IonLabel position="stacked">Current Password *</IonLabel>
                <IonInput
                  type="password"
                  value={currentPassword}
                  onIonChange={(e) => setCurrentPassword(e.detail.value)}
                  placeholder="Enter current password"
                  required
                />
              </IonItem>

              <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.6rem' }}>
                <IonLabel position="stacked">New Password (min 6 chars) *</IonLabel>
                <IonInput
                  type="password"
                  value={newPassword}
                  onIonChange={(e) => setNewPassword(e.detail.value)}
                  placeholder="Enter new password"
                  required
                />
              </IonItem>

              <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '1rem' }}>
                <IonLabel position="stacked">Confirm New Password *</IonLabel>
                <IonInput
                  type="password"
                  value={confirmPassword}
                  onIonChange={(e) => setConfirmPassword(e.detail.value)}
                  placeholder="Confirm new password"
                  required
                />
              </IonItem>

              <IonButton
                expand="block"
                type="submit"
                disabled={changePassLoading}
                style={{ '--background': '#800000', fontWeight: 'bold' }}
              >
                {changePassLoading ? 'Updating Password...' : 'UPDATE PASSWORD'}
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>

        {/* Backend API Configuration */}
        <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '14px', marginBottom: '1.5rem' }}>
          <IonCardContent className="ion-padding">
            <h4 style={{ margin: '0 0 0.6rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Backend Server Endpoint
            </h4>
            <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.6rem' }}>
              <IonLabel position="stacked">API URL</IonLabel>
              <IonInput value={customUrl} onIonChange={(e) => setCustomUrl(e.detail.value)} />
            </IonItem>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <IonButton 
                size="small" 
                fill="outline" 
                style={{ flex: 1, '--color': '#800000', '--border-color': '#800000', fontSize: '0.72rem' }}
                onClick={() => setCustomUrl(DEFAULT_API_BASE_URL)}
              >
                Reset Cloud URL
              </IonButton>
              <IonButton 
                size="small" 
                style={{ flex: 1, '--background': '#800000', fontWeight: 'bold', fontSize: '0.72rem' }}
                onClick={handleSaveApi}
              >
                Save Endpoint
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Logout Button */}
        <IonButton 
          expand="block" 
          color="danger" 
          style={{ fontWeight: 'bold', height: '46px' }}
          onClick={handleLogout}
        >
          <IonIcon icon={logOutOutline} slot="start" /> LOG OUT SUPERVISOR
        </IonButton>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
}
