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
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonToast,
} from '@ionic/react';
import { createEmergencyPass } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EmergencyPass({ history }) {
  const { user, selectedGate } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    visitor_category: 'GENERAL',
    visit_type: 'TOUR',
    purpose: 'Emergency Entry by Supervisor',
    vehicle_no: '',
    adult_men_count: 1,
    adult_women_count: 0,
    children_count: 0
  });
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [createdPass, setCreatedPass] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      setToastMsg('Name and mobile phone are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await createEmergencyPass(formData);
      if (res?.success) {
        setCreatedPass(res.registration);
        setToastMsg('Emergency pass issued successfully!');
      } else {
        setToastMsg(res?.message || 'Failed to issue pass.');
      }
    } catch (err) {
      setToastMsg('Failed to create emergency pass.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Issue Emergency Pass</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        
        {createdPass ? (
          <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '14px', borderLeft: '6px solid #16a34a' }}>
            <IonCardContent className="ion-padding" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✓</div>
              <h3 style={{ margin: 0, color: '#15803d', fontWeight: 'bold' }}>Pass Issued Successfully!</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Immediate gate ingress permitted.</p>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', margin: '1rem 0', border: '1px dashed #cbd5e1' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>PASSCODE</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#800000' }}>
                  {createdPass.pass_code}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1e293b', marginTop: '0.4rem' }}>
                  {createdPass.full_name || formData.full_name} ({createdPass.phone || formData.phone})
                </div>
              </div>

              <IonButton 
                expand="block" 
                style={{ '--background': '#800000', fontWeight: 'bold' }}
                onClick={() => { setCreatedPass(null); history.push('/home'); }}
              >
                Return to Dashboard
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '14px' }}>
            <IonCardContent className="ion-padding">
              <form onSubmit={handleSubmit}>
                <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem' }}>
                  <IonLabel position="stacked">Visitor Full Name *</IonLabel>
                  <IonInput
                    required
                    value={formData.full_name}
                    onIonChange={(e) => setFormData({ ...formData, full_name: e.detail.value })}
                  />
                </IonItem>

                <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem' }}>
                  <IonLabel position="stacked">Mobile Phone *</IonLabel>
                  <IonInput
                    type="tel"
                    required
                    value={formData.phone}
                    onIonChange={(e) => setFormData({ ...formData, phone: e.detail.value })}
                  />
                </IonItem>

                <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem' }}>
                  <IonLabel position="stacked">Vehicle Number (Optional)</IonLabel>
                  <IonInput
                    value={formData.vehicle_no}
                    onIonChange={(e) => setFormData({ ...formData, vehicle_no: e.detail.value })}
                  />
                </IonItem>

                <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem' }}>
                  <IonLabel position="stacked">Category</IonLabel>
                  <IonSelect
                    value={formData.visitor_category}
                    onIonChange={(e) => setFormData({ ...formData, visitor_category: e.detail.value })}
                  >
                    <IonSelectOption value="GENERAL">General Devotee</IonSelectOption>
                    <IonSelectOption value="VIP">VIP</IonSelectOption>
                    <IonSelectOption value="VENDOR">Vendor / Contractor</IonSelectOption>
                    <IonSelectOption value="DELIVERY">Delivery</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '1.2rem' }}>
                  <IonLabel position="stacked">Purpose</IonLabel>
                  <IonInput
                    value={formData.purpose}
                    onIonChange={(e) => setFormData({ ...formData, purpose: e.detail.value })}
                  />
                </IonItem>

                <IonButton 
                  expand="block" 
                  type="submit" 
                  disabled={loading}
                  style={{ '--background': '#800000', fontWeight: 'bold', height: '48px' }}
                >
                  {loading ? 'Issuing Pass...' : '⚡ ISSUE & DIRECTLY APPROVE PASS'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        )}

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2500} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
}
