import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonBadge,
} from '@ionic/react';
import {
  shieldCheckmark,
  qrCodeOutline,
  personAddOutline,
  peopleOutline,
  timeOutline,
  warningOutline,
  carOutline,
  menuOutline,
  phonePortraitOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { getSpotRegistrationsQueue, getOverstayAlerts, getGatewiseGuards, getVisitorsInsideCampus } from '../services/api';

export default function SupervisorHome({ history }) {
  const { user, selectedGate, setSelectedGate } = useAuth();
  const [pendingSpotCount, setPendingSpotCount] = useState(0);
  const [overstayCount, setOverstayCount] = useState(0);
  const [onDutyCount, setOnDutyCount] = useState(0);
  const [insideCount, setInsideCount] = useState(0);

  const supervisorName = user?.name || 'Suresh Supervisor';
  const gateDisplay = (selectedGate || 'NORTH_GATE').replace('_', ' ');

  useEffect(() => {
    loadDashboardStats();
  }, [selectedGate]);

  const loadDashboardStats = async () => {
    try {
      const [spotRes, overstayRes, guardsRes, insideRes] = await Promise.all([
        getSpotRegistrationsQueue(),
        getOverstayAlerts(),
        getGatewiseGuards(),
        getVisitorsInsideCampus(),
      ]);

      if (spotRes?.spot_requests) {
        const pending = spotRes.spot_requests.filter(
          (r) => r.status === 'PENDING_SUPERVISOR' || r.status === 'PENDING_SPOT_APPROVAL' || (r.status && r.status.startsWith('PENDING'))
        ).length;
        setPendingSpotCount(pending);
      }
      if (overstayRes?.overstays) {
        setOverstayCount(overstayRes.overstays.length);
      }
      if (guardsRes?.guards) {
        setOnDutyCount(guardsRes.guards.length);
      }
      if (insideRes?.visitors) {
        setInsideCount(insideRes.visitors.length);
      }
    } catch (e) {
      console.warn('Dashboard stats fallback');
    }
  };

  const navigate = (path) => {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
    history.push(path);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <IonIcon icon={shieldCheckmark} style={{ fontSize: '26px', color: '#f59e0b' }} />
              <div>
                <IonTitle style={{ padding: 0, fontSize: '1.05rem', fontWeight: 'bold' }}>
                  {gateDisplay}
                </IonTitle>
                <span style={{ fontSize: '0.68rem', color: '#fde68a', display: 'block', lineHeight: 1 }}>
                  Security Supervisor Portal
                </span>
              </div>
            </div>
            <IonButton fill="clear" style={{ color: '#ffffff' }} onClick={() => navigate('/settings')}>
              <IonIcon icon={menuOutline} style={{ fontSize: '24px' }} />
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        
        {/* Supervisor Profile & Gate Oversight Card (Matching Guard Device card) */}
        <IonCard style={{ borderRadius: '14px', margin: '0 0 1rem 0', boxShadow: '0 4px 14px rgba(0,0,0,0.08)', background: '#ffffff' }}>
          <IonCardContent className="ion-padding" style={{ padding: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IonIcon icon={phonePortraitOutline} style={{ fontSize: '22px', color: '#800000' }} />
                <div>
                  <strong style={{ fontSize: '0.94rem', color: '#1e293b' }}>{supervisorName}</strong>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>
                    Role: <strong style={{ color: '#800000' }}>SECURITY SUPERVISOR</strong> • Gate: <strong>{gateDisplay}</strong>
                  </span>
                </div>
              </div>
              <IonBadge color="success" style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}>ACTIVE</IonBadge>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.76rem', color: '#475569' }}>
              <div>
                Pending Spot: <strong style={{ color: pendingSpotCount > 0 ? '#dc2626' : '#16a34a' }}>{pendingSpotCount}</strong>
              </div>
              <div>
                Guards on Duty: <strong style={{ color: '#1d4ed8' }}>{onDutyCount}</strong>
              </div>
              <div>
                Overstays: <strong style={{ color: overstayCount > 0 ? '#dc2626' : '#64748b' }}>{overstayCount}</strong>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* 4 Prominent Category Tiles matching Guard App */}
        <div style={{ marginBottom: '1.2rem' }}>
          <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.85rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Supervisor Actions & Oversight
          </h4>

          <IonGrid className="ion-no-padding">
            <IonRow style={{ margin: '-0.3rem' }}>
              {/* Tile 1: WALK-IN SPOT APPROVALS (Deep Red #800000) */}
              <IonCol size="6" style={{ padding: '0.3rem' }}>
                <div 
                  className="asram-tile-red"
                  onClick={() => navigate('/spot-approvals')}
                  style={{
                    height: '115px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', textAlign: 'center', padding: '0.8rem', position: 'relative'
                  }}
                >
                  <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '32px', marginBottom: '0.3rem' }} />
                  <strong style={{ fontSize: '0.85rem', letterSpacing: '0.4px', lineHeight: '1.2' }}>
                    SPOT APPROVALS
                  </strong>
                  {pendingSpotCount > 0 && (
                    <span style={{ fontSize: '0.7rem', marginTop: '0.3rem', background: '#ffffff', color: '#800000', padding: '0.1rem 0.5rem', borderRadius: '10px', fontWeight: 'bold' }}>
                      {pendingSpotCount} Pending
                    </span>
                  )}
                </div>
              </IonCol>

              {/* Tile 2: SCAN & VERIFY PASS (Royal Blue #1D4ED8) */}
              <IonCol size="6" style={{ padding: '0.3rem' }}>
                <div 
                  className="asram-tile-blue"
                  onClick={() => navigate('/scan-verify')}
                  style={{
                    height: '115px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', textAlign: 'center', padding: '0.8rem'
                  }}
                >
                  <IonIcon icon={qrCodeOutline} style={{ fontSize: '32px', marginBottom: '0.3rem' }} />
                  <strong style={{ fontSize: '0.85rem', letterSpacing: '0.4px', lineHeight: '1.2' }}>
                    SCAN & VERIFY
                  </strong>
                  <span style={{ fontSize: '0.7rem', marginTop: '0.3rem', opacity: 0.85 }}>
                    Gate Verification
                  </span>
                </div>
              </IonCol>

              {/* Tile 3: GUARD DUTY ROSTER (Golden Orange #F59E0B) */}
              <IonCol size="6" style={{ padding: '0.3rem' }}>
                <div 
                  className="asram-tile-orange"
                  onClick={() => navigate('/guard-roster')}
                  style={{
                    height: '115px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', textAlign: 'center', padding: '0.8rem'
                  }}
                >
                  <IonIcon icon={peopleOutline} style={{ fontSize: '32px', marginBottom: '0.3rem' }} />
                  <strong style={{ fontSize: '0.85rem', letterSpacing: '0.4px', lineHeight: '1.2' }}>
                    GUARD ROSTER
                  </strong>
                  <span style={{ fontSize: '0.7rem', marginTop: '0.3rem', background: 'rgba(255,255,255,0.25)', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                    {onDutyCount} On-Duty
                  </span>
                </div>
              </IonCol>

              {/* Tile 4: OVERSTAY ALERTS (Burnt Amber #B45309) */}
              <IonCol size="6" style={{ padding: '0.3rem' }}>
                <div 
                  className="asram-tile-amber"
                  onClick={() => navigate('/overstay-alerts')}
                  style={{
                    height: '115px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', textAlign: 'center', padding: '0.8rem'
                  }}
                >
                  <IonIcon icon={alertCircleOutline} style={{ fontSize: '32px', marginBottom: '0.3rem' }} />
                  <strong style={{ fontSize: '0.85rem', letterSpacing: '0.4px', lineHeight: '1.2' }}>
                    OVERSTAY ALERTS
                  </strong>
                  <span style={{ fontSize: '0.7rem', marginTop: '0.3rem', background: 'rgba(255,255,255,0.25)', padding: '0.1rem 0.5rem', borderRadius: '10px' }}>
                    {overstayCount} Alerts
                  </span>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* 6 Quick Action Tiles matching Guard App */}
        <div>
          <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '0.85rem', color: '#475569', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Quick Security Controls
          </h4>

          <IonGrid className="ion-no-padding">
            <IonRow style={{ margin: '-0.3rem' }}>
              <IonCol size="4" style={{ padding: '0.3rem' }}>
                <IonCard onClick={() => navigate('/spot-approvals')} style={{ margin: 0, textAlign: 'center', padding: '0.8rem 0.4rem', borderRadius: '12px', background: '#ffffff' }}>
                  <IonIcon icon={timeOutline} color="warning" style={{ fontSize: '28px' }} />
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '0.3rem', color: '#1e293b' }}>
                    Validation Queue
                  </span>
                </IonCard>
              </IonCol>

              <IonCol size="4" style={{ padding: '0.3rem' }}>
                <IonCard onClick={() => navigate('/emergency-pass')} style={{ margin: 0, textAlign: 'center', padding: '0.8rem 0.4rem', borderRadius: '12px', background: '#ffffff' }}>
                  <IonIcon icon={personAddOutline} color="danger" style={{ fontSize: '28px' }} />
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '0.3rem', color: '#1e293b' }}>
                    Emergency Pass
                  </span>
                </IonCard>
              </IonCol>

              <IonCol size="4" style={{ padding: '0.3rem' }}>
                <IonCard onClick={() => navigate('/scan-verify')} style={{ margin: 0, textAlign: 'center', padding: '0.8rem 0.4rem', borderRadius: '12px', background: '#ffffff' }}>
                  <IonIcon icon={qrCodeOutline} color="primary" style={{ fontSize: '28px' }} />
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '0.3rem', color: '#1e293b' }}>
                    Scan QR
                  </span>
                </IonCard>
              </IonCol>

              <IonCol size="4" style={{ padding: '0.3rem' }}>
                <IonCard onClick={() => navigate('/visitors-inside')} style={{ margin: 0, textAlign: 'center', padding: '0.8rem 0.4rem', borderRadius: '12px', background: '#ffffff' }}>
                  <IonIcon icon={peopleOutline} color="tertiary" style={{ fontSize: '28px' }} />
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '0.3rem', color: '#1e293b' }}>
                    Visitors Inside
                  </span>
                </IonCard>
              </IonCol>

              <IonCol size="4" style={{ padding: '0.3rem' }}>
                <IonCard onClick={() => navigate('/gate-logs')} style={{ margin: 0, textAlign: 'center', padding: '0.8rem 0.4rem', borderRadius: '12px', background: '#ffffff' }}>
                  <IonIcon icon={timeOutline} color="medium" style={{ fontSize: '28px' }} />
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '0.3rem', color: '#1e293b' }}>
                    Gate Logs
                  </span>
                </IonCard>
              </IonCol>

              <IonCol size="4" style={{ padding: '0.3rem' }}>
                <IonCard onClick={() => navigate('/incident-report')} style={{ margin: 0, textAlign: 'center', padding: '0.8rem 0.4rem', borderRadius: '12px', background: '#ffffff' }}>
                  <IonIcon icon={warningOutline} color="danger" style={{ fontSize: '28px' }} />
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 'bold', marginTop: '0.3rem', color: '#1e293b' }}>
                    Incident Report
                  </span>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

      </IonContent>
    </IonPage>
  );
}
