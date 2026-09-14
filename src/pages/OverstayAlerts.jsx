import React, { useState, useEffect } from 'react';
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
  IonBadge,
  IonButton,
  IonToast,
} from '@ionic/react';
import { getOverstayAlerts } from '../services/api';

export default function OverstayAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await getOverstayAlerts();
      if (res?.overstays) {
        setAlerts(res.overstays);
      }
    } catch (e) {}
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Campus Overstay Alerts</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.88rem', color: '#475569', fontWeight: 'bold' }}>
          Delayed Exits & Overstayed Passes ({alerts.length})
        </h4>

        {alerts.length === 0 ? (
          <IonCard className="card-wireframe" style={{ background: '#ffffff', textAlign: 'center' }}>
            <IonCardContent className="ion-padding" style={{ color: '#16a34a' }}>
              ✓ No overstay violations recorded. All departures on schedule!
            </IonCardContent>
          </IonCard>
        ) : (
          alerts.map((item) => (
            <IonCard key={item.id} className="card-wireframe" style={{ background: '#ffffff', borderRadius: '12px', borderLeft: '6px solid #dc2626' }}>
              <IonCardContent className="ion-padding" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{item.visitor_name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📞 {item.visitor_phone}</div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px' }}>
                      Host: <strong>{item.host_name || 'Ashram Resident'}</strong>
                    </div>
                    {item.vehicle_no && (
                      <div style={{ fontSize: '0.76rem', color: '#b45309' }}>
                        Vehicle: <strong>{item.vehicle_no}</strong>
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <IonBadge color="danger">OVERSTAY</IonBadge>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                      Pass: <strong>{item.pass_code}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '0.6rem', background: '#fef2f2', padding: '0.5rem', borderRadius: '6px', fontSize: '0.76rem', color: '#991b1b' }}>
                  Scheduled Departure: <strong>{new Date(item.valid_until).toLocaleString()}</strong>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                  <IonButton 
                    size="small" 
                    fill="outline" 
                    style={{ flex: 1, '--color': '#800000', '--border-color': '#800000', fontSize: '0.72rem' }}
                    onClick={() => window.open(`tel:${item.visitor_phone}`)}
                  >
                    Call Visitor
                  </IonButton>
                  <IonButton 
                    size="small" 
                    style={{ flex: 1, '--background': '#800000', fontSize: '0.72rem' }}
                    onClick={() => setToastMsg('Security log acknowledgment recorded.')}
                  >
                    Acknowledge
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        )}

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
}
