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
  IonTextarea,
  IonButton,
  IonToast,
} from '@ionic/react';
import { submitIncidentReport } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function IncidentReport({ history }) {
  const { selectedGate, user } = useAuth();
  const [incidentType, setIncidentType] = useState('UNAUTHORIZED_ENTRY');
  const [severity, setSeverity] = useState('MEDIUM');
  const [details, setDetails] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitIncidentReport({
        incident_type: incidentType,
        severity,
        details,
        gate_name: selectedGate,
        supervisor_id: user?.id,
        timestamp: new Date().toISOString()
      });
      setToastMsg('Supervisor incident report submitted successfully.');
      setTimeout(() => history.push('/home'), 1500);
    } catch (e) {
      setToastMsg('Failed to log report.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': '#800000', '--color': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" style={{ color: '#ffffff' }} />
          </IonButtons>
          <IonTitle style={{ fontWeight: 'bold' }}>Supervisor Incident Log</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonCard className="card-wireframe" style={{ background: '#ffffff', borderRadius: '14px' }}>
          <IonCardContent className="ion-padding">
            <form onSubmit={handleSubmit}>
              <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <IonLabel position="stacked">Incident Classification</IonLabel>
                <IonSelect value={incidentType} onIonChange={(e) => setIncidentType(e.detail.value)}>
                  <IonSelectOption value="UNAUTHORIZED_ENTRY">Unauthorized Entry Attempt</IonSelectOption>
                  <IonSelectOption value="PASS_MISMATCH">Pass / ID Mismatch</IonSelectOption>
                  <IonSelectOption value="VEHICLE_OVERSTAY">Vehicle Overstay / Parking Violation</IonSelectOption>
                  <IonSelectOption value="DISORDERLY_CONDUCT">Disorderly Conduct</IonSelectOption>
                  <IonSelectOption value="OTHER">Other Security Note</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '0.8rem' }}>
                <IonLabel position="stacked">Severity Level</IonLabel>
                <IonSelect value={severity} onIonChange={(e) => setSeverity(e.detail.value)}>
                  <IonSelectOption value="LOW">Low</IonSelectOption>
                  <IonSelectOption value="MEDIUM">Medium</IonSelectOption>
                  <IonSelectOption value="HIGH">High (Alert Security Head)</IonSelectOption>
                  <IonSelectOption value="CRITICAL">Critical Emergency</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem lines="none" style={{ '--background': '#f8fafc', borderRadius: '8px', marginBottom: '1.2rem' }}>
                <IonLabel position="stacked">Incident Details & Action Taken *</IonLabel>
                <IonTextarea
                  rows={4}
                  required
                  value={details}
                  onIonChange={(e) => setDetails(e.detail.value)}
                  placeholder="Describe incident, visitor details, vehicles, and resolution..."
                />
              </IonItem>

              <IonButton 
                expand="block" 
                type="submit" 
                style={{ '--background': '#800000', fontWeight: 'bold', height: '48px' }}
              >
                SUBMIT INCIDENT REPORT
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2500} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
}
