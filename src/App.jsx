import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import SupervisorHome from './pages/SupervisorHome';
import SpotApprovals from './pages/SpotApprovals';
import ScanVerify from './pages/ScanVerify';
import EmergencyPass from './pages/EmergencyPass';
import GuardRoster from './pages/GuardRoster';
import OverstayAlerts from './pages/OverstayAlerts';
import VisitorsInside from './pages/VisitorsInside';
import GateLogs from './pages/GateLogs';
import IncidentReport from './pages/IncidentReport';
import Settings from './pages/Settings';

setupIonicReact();

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/home" component={SupervisorHome} />
            <ProtectedRoute exact path="/spot-approvals" component={SpotApprovals} />
            <ProtectedRoute exact path="/scan-verify" component={ScanVerify} />
            <ProtectedRoute exact path="/emergency-pass" component={EmergencyPass} />
            <ProtectedRoute exact path="/guard-roster" component={GuardRoster} />
            <ProtectedRoute exact path="/overstay-alerts" component={OverstayAlerts} />
            <ProtectedRoute exact path="/visitors-inside" component={VisitorsInside} />
            <ProtectedRoute exact path="/gate-logs" component={GateLogs} />
            <ProtectedRoute exact path="/incident-report" component={IncidentReport} />
            <ProtectedRoute exact path="/settings" component={Settings} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
}
