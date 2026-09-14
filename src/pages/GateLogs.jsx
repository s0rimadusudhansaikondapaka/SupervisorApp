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
} from '@ionic/react';
import { getRecentGateLookups } from '../services/api';

export default function GateLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getRecentGateLookups().then((res) => {
      if (res?.recent_passes) setLogs(res.recent_passes);
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Gate Movement Logs</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.88rem', color: '#475569', fontWeight: 'bold' }}>
          Gate Activity & Movement Audit ({logs.length})
        </h4>

        {logs.map((log) => (
          <IonCard key={log.id} className="card-wireframe" style={{ background: '#ffffff', borderRadius: '10px' }}>
            <IonCardContent className="ion-padding" style={{ padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: '0.9rem', color: '#1e293b' }}>{log.visitor_name}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pass: {log.pass_code}</div>
                </div>
                <IonBadge color={log.status === 'INSIDE_CAMPUS' ? 'success' : 'medium'}>
                  {log.status}
                </IonBadge>
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
}
