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
import { getVisitorsInsideCampus } from '../services/api';

export default function VisitorsInside() {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    getVisitorsInsideCampus().then((res) => {
      if (res?.visitors) setVisitors(res.visitors);
    });
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Visitors Inside Campus</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.88rem', color: '#475569', fontWeight: 'bold' }}>
          Current Campus Occupancy ({visitors.length} Active Passes)
        </h4>

        {visitors.length === 0 ? (
          <IonCard className="card-wireframe" style={{ background: '#ffffff', textAlign: 'center' }}>
            <IonCardContent className="ion-padding" style={{ color: '#64748b' }}>
              No visitors currently recorded inside campus.
            </IonCardContent>
          </IonCard>
        ) : (
          visitors.map((v) => (
            <IonCard key={v.id} className="card-wireframe" style={{ background: '#ffffff', borderRadius: '12px', borderLeft: '5px solid #16a34a' }}>
              <IonCardContent className="ion-padding" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{v.visitor_name}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>📞 {v.visitor_phone}</div>
                    <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '2px' }}>
                      Host: {v.host_name || 'Ashram Host'} • Entry: {v.entry_time ? new Date(v.entry_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                    </div>
                    {v.vehicle_no && (
                      <div style={{ fontSize: '0.74rem', color: '#b45309' }}>
                        Vehicle: {v.vehicle_no}
                      </div>
                    )}
                  </div>
                  <IonBadge color="success">INSIDE</IonBadge>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </IonContent>
    </IonPage>
  );
}
