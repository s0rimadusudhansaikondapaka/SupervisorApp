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
  IonIcon,
} from '@ionic/react';
import { shieldOutline, personCircleOutline, checkmarkCircle } from 'ionicons/icons';
import { getGatewiseGuards } from '../services/api';

export default function GuardRoster() {
  const [guards, setGuards] = useState([]);

  useEffect(() => {
    loadGuards();
  }, []);

  const loadGuards = async () => {
    try {
      const res = await getGatewiseGuards();
      if (res?.guards) {
        setGuards(res.guards);
      }
    } catch (e) {}
  };

  const gates = ['NORTH_GATE', 'SOUTH_GATE', 'EAST_GATE', 'WEST_GATE'];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Guard Duty Roster</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '0.88rem', color: '#475569', fontWeight: 'bold' }}>
          Active Gates Duty Deployment ({guards.length} Guards)
        </h4>

        {gates.map((gate) => {
          const gateGuards = guards.filter((g) => (g.gate || 'NORTH_GATE') === gate);
          return (
            <IonCard key={gate} className="card-wireframe" style={{ background: '#ffffff', borderRadius: '12px', marginBottom: '0.8rem' }}>
              <IonCardContent className="ion-padding" style={{ padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.92rem', color: '#1e293b' }}>{gate.replace('_', ' ')}</strong>
                  <IonBadge color={gateGuards.length > 0 ? 'success' : 'medium'}>
                    {gateGuards.length} Guards
                  </IonBadge>
                </div>

                {gateGuards.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {gateGuards.map((g) => (
                      <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#334155' }}>
                        <IonIcon icon={checkmarkCircle} style={{ color: '#16a34a' }} />
                        <span><strong>{g.name}</strong> ({g.phone || g.guid})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>No guards assigned to this gate</span>
                )}
              </IonCardContent>
            </IonCard>
          );
        })}
      </IonContent>
    </IonPage>
  );
}
