import React, { useState, useEffect, useRef } from 'react';
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
  IonInput,
  IonButton,
  IonToast,
  IonBadge,
  IonIcon,
} from '@ionic/react';
import { searchOutline, qrCodeOutline, shieldCheckmarkOutline, checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { verifyGatePass, processApproval } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ScanVerify({ history }) {
  const { selectedGate } = useAuth();
  const [query, setQuery] = useState('');
  const [passData, setPassData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const html5QrCodeRef = useRef(null);

  const handleLookup = async (lookupQuery) => {
    const q = (lookupQuery || query).trim();
    if (!q) return;
    setLoading(true);
    try {
      const res = await verifyGatePass(q, selectedGate);
      if (res?.pass) {
        setPassData(res.pass);
        setToastMsg('Pass verified successfully');
      } else {
        setToastMsg('No pass found for query: ' + q);
      }
    } catch (err) {
      setToastMsg('Pass lookup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForceApprove = async () => {
    if (!passData) return;
    try {
      const res = await processApproval(passData.id, 'APPROVE', 'Supervisor force approval at gate');
      if (res?.success) {
        setToastMsg('Pass forcibly approved by supervisor!');
        handleLookup(passData.pass_code);
      }
    } catch (e) {
      setToastMsg('Override failed.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Scan & Verify Gate Pass</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        
        {/* Passcode Search Input */}
        <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '12px' }}>
          <IonCardContent className="ion-padding" style={{ padding: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <IonItem lines="none" style={{ flex: 1, '--background': '#f1f5f9', borderRadius: '8px' }}>
                <IonInput
                  placeholder="Enter Passcode, Phone, or Vehicle..."
                  value={query}
                  onIonChange={(e) => setQuery(e.detail.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                />
              </IonItem>
              <IonButton 
                style={{ '--background': '#800000', fontWeight: 'bold', height: '42px' }}
                onClick={() => handleLookup()}
              >
                <IonIcon icon={searchOutline} />
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Pass Details Display */}
        {passData && (
          <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '12px', borderLeft: passData.is_approved ? '6px solid #16a34a' : '6px solid #dc2626' }}>
            <IonCardContent className="ion-padding">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{passData.visitor_name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>📞 {passData.visitor_phone}</div>
                  <div style={{ fontSize: '0.8rem', color: '#4f46e5' }}>Category: <strong>{passData.visitor_category}</strong></div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <IonBadge color={passData.is_approved ? 'success' : 'danger'}>
                    {passData.status}
                  </IonBadge>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#1e293b', marginTop: '4px' }}>
                    {passData.pass_code}
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div style={{ background: passData.is_approved ? '#f0fdf4' : '#fef2f2', border: passData.is_approved ? '1px solid #bbf7d0' : '1px solid #fecaca', padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '0.8rem', fontSize: '0.8rem' }}>
                <strong style={{ color: passData.is_approved ? '#15803d' : '#991b1b' }}>
                  {passData.arrival_message || (passData.is_approved ? '✓ Pass is Approved & Valid for Entry' : '⛔ Entry Blocked: Pass Pending Approval')}
                </strong>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <div>Host: <strong>{passData.host_name || 'Ashram Gate Desk'}</strong></div>
                <div>Vehicle: <strong>{passData.vehicle_no || 'None'}</strong></div>
                <div>Members: <strong>👨 {passData.adult_men_count || 1} | 👩 {passData.adult_women_count || 0} | 🧒 {passData.children_count || 0}</strong></div>
                <div>Valid From: <strong>{new Date(passData.valid_from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> to <strong>{new Date(passData.valid_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></div>
              </div>

              {!passData.is_approved && (
                <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid #f1f5f9' }}>
                  <IonButton 
                    expand="block" 
                    style={{ '--background': '#f59e0b', '--color': '#78350f', fontWeight: 'bold' }}
                    onClick={handleForceApprove}
                  >
                    ⚡ SUPERVISOR FORCE APPROVE
                  </IonButton>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        )}

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2500} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
}
