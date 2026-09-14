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
  IonButton,
  IonBadge,
  IonToast,
  IonModal,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { getSpotRegistrationsQueue, processApproval } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SpotApprovals({ history }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [toastMsg, setToastMsg] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('APPROVE');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getSpotRegistrationsQueue();
      if (res?.spot_requests) {
        setRequests(res.spot_requests);
      }
    } catch (e) {
      console.warn('Failed to load spot queue');
    }
  };

  const openActionModal = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    setRemarks(action === 'APPROVE' ? 'Approved on-spot by Guard Supervisor' : 'Rejected by Guard Supervisor');
    setShowModal(true);
  };

  const submitAction = async () => {
    if (!selectedItem) return;
    try {
      const res = await processApproval(selectedItem.id, actionType, remarks);
      if (res?.success) {
        setToastMsg(`Spot visitor #${selectedItem.pass_code} ${actionType}D successfully!`);
        setShowModal(false);
        fetchRequests();
      } else {
        setToastMsg(res?.message || 'Action failed.');
      }
    } catch (err) {
      setToastMsg('Failed to process approval.');
    }
  };

  const filtered = requests.filter((r) => {
    if (activeTab === 'PENDING') {
      return r.status === 'PENDING_SUPERVISOR' || r.status === 'PENDING_SPOT_APPROVAL' || (r.status && r.status.startsWith('PENDING'));
    }
    if (activeTab === 'APPROVED') {
      return r.status === 'APPROVED' || r.status === 'INSIDE_CAMPUS';
    }
    if (activeTab === 'REJECTED') {
      return r.status === 'REJECTED';
    }
    return true;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Spot Approvals Queue</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        
        {/* Segment Tabs */}
        <IonSegment 
          value={activeTab} 
          onIonChange={(e) => setActiveTab(e.detail.value)}
          style={{ marginBottom: '1rem', background: '#ffffff', borderRadius: '10px' }}
        >
          <IonSegmentButton value="PENDING">
            <IonLabel>Pending ({requests.filter(r => r.status && r.status.includes('PENDING')).length})</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="APPROVED">
            <IonLabel>Approved</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="ALL">
            <IonLabel>All</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {filtered.length === 0 ? (
          <IonCard className="card-wireframe" style={{ background: '#ffffff' }}>
            <IonCardContent className="ion-padding" style={{ textAlign: 'center', color: '#64748b' }}>
              No spot registration requests in this tab.
            </IonCardContent>
          </IonCard>
        ) : (
          filtered.map((item) => {
            const isPending = item.status === 'PENDING_SUPERVISOR' || item.status === 'PENDING_SPOT_APPROVAL' || (item.status && item.status.startsWith('PENDING'));
            return (
              <IonCard 
                key={item.id} 
                className="card-wireframe" 
                style={{ 
                  background: '#ffffff', 
                  borderLeft: isPending ? '5px solid #800000' : item.status === 'APPROVED' ? '5px solid #16a34a' : '5px solid #dc2626' 
                }}
              >
                <IonCardContent className="ion-padding" style={{ padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: '#1e293b' }}>{item.visitor_name}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📞 {item.visitor_phone}</div>
                      <div style={{ fontSize: '0.78rem', color: '#4f46e5', marginTop: '2px' }}>
                        Category: <strong>{item.visitor_category || 'GENERAL'}</strong> • Type: <strong>{item.registration_type === 'SPOT_REGISTRATION' ? '🚶 Walk-In' : '✉️ Invited'}</strong>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#334155', marginTop: '2px' }}>
                        Purpose: <strong>{item.purpose || 'Ashram Visit'}</strong>
                      </div>
                      {item.vehicle_no && (
                        <div style={{ fontSize: '0.74rem', color: '#b45309', marginTop: '2px' }}>
                          🚗 Vehicle: <strong>{item.vehicle_no}</strong>
                        </div>
                      )}
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                        Guests: 👨 {item.adult_men_count || 1} Men | 👩 {item.adult_women_count || 0} Women | 🧒 {item.children_count || 0} Children
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <IonBadge color={isPending ? 'warning' : item.status === 'APPROVED' ? 'success' : 'danger'}>
                        {isPending ? 'SUPERVISOR APPROVAL' : item.status}
                      </IonBadge>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                        Pass: <strong>{item.pass_code}</strong>
                      </div>
                    </div>
                  </div>

                  {isPending && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid #f1f5f9' }}>
                      <IonButton 
                        size="small" 
                        style={{ flex: 1, '--background': '#16a34a', fontWeight: 'bold' }}
                        onClick={() => openActionModal(item, 'APPROVE')}
                      >
                        ✓ APPROVE PASS
                      </IonButton>
                      <IonButton 
                        size="small" 
                        style={{ flex: 1, '--background': '#dc2626', fontWeight: 'bold' }}
                        onClick={() => openActionModal(item, 'REJECT')}
                      >
                        ✕ REJECT
                      </IonButton>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            );
          })
        )}

        {/* Action Confirmation Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
              <IonTitle style={{ fontWeight: 'bold' }}>
                {actionType === 'APPROVE' ? 'Approve Spot Pass' : 'Reject Spot Pass'}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)} style={{ color: '#ffffff' }}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
            <div style={{ maxWidth: '420px', margin: '0 auto' }}>
              <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '12px' }}>
                <IonCardContent className="ion-padding">
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
                    Visitor: <strong>{selectedItem?.visitor_name}</strong>
                  </h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Pass: <strong>{selectedItem?.pass_code}</strong> • Phone: {selectedItem?.visitor_phone}
                  </p>

                  <IonItem lines="none" style={{ '--background': '#f1f5f9', borderRadius: '8px', marginBottom: '1rem' }}>
                    <IonLabel position="stacked" style={{ color: '#334155', fontWeight: 'bold' }}>
                      Supervisor Remarks
                    </IonLabel>
                    <IonTextarea
                      rows={3}
                      value={remarks}
                      onIonChange={(e) => setRemarks(e.detail.value)}
                    />
                  </IonItem>

                  <IonButton
                    expand="block"
                    style={{
                      '--background': actionType === 'APPROVE' ? '#16a34a' : '#dc2626',
                      fontWeight: 'bold',
                      height: '46px'
                    }}
                    onClick={submitAction}
                  >
                    Confirm {actionType}
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </div>
          </IonContent>
        </IonModal>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2500} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
}
