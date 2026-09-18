// Dynamic base URL with environment variable fallback and runtime override support
let currentBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const getBaseUrl = () => currentBaseUrl;
export const setBaseUrl = (url) => {
  if (url) {
    currentBaseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('supervisor_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const loginSupervisor = async (credentials) => {
  const response = await fetch(`${getBaseUrl()}/auth/supervisor-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed');
  }
  return response.json();
};

export const logoutSupervisor = async () => {
  localStorage.removeItem('supervisor_token');
  localStorage.removeItem('supervisor_user');
};

// Queue & Verification APIs
export const getSpotRegistrationsQueue = async () => {
  const res = await fetch(`${getBaseUrl()}/supervisor/spot-registrations`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch spot registrations queue');
  return res.json();
};

export const approveSpotRegistration = async (id, payload = {}) => {
  const res = await fetch(`${getBaseUrl()}/supervisor/spot-registrations/${id}/approve`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to approve registration');
  return res.json();
};

export const rejectSpotRegistration = async (id, reason) => {
  const res = await fetch(`${getBaseUrl()}/supervisor/spot-registrations/${id}/reject`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });
  if (!res.ok) throw new Error('Failed to reject registration');
  return res.json();
};

export const getOverstayAlerts = async () => {
  const res = await fetch(`${getBaseUrl()}/supervisor/overstay-alerts`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch overstay alerts');
  return res.json();
};

export const getGatewiseGuards = async () => {
  const res = await fetch(`${getBaseUrl()}/supervisor/guards`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch guard roster');
  return res.json();
};

export const getVisitorsInsideCampus = async () => {
  const res = await fetch(`${getBaseUrl()}/supervisor/visitors-inside`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch visitors inside campus');
  return res.json();
};

export const verifyPassByQr = async (passCode) => {
  const res = await fetch(`${getBaseUrl()}/supervisor/verify-pass`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ passCode })
  });
  if (!res.ok) throw new Error('Failed to verify pass');
  return res.json();
};

export const getGateLogs = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${getBaseUrl()}/supervisor/logs?${query}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
};

export const reportIncident = async (incidentData) => {
  const res = await fetch(`${getBaseUrl()}/supervisor/incident`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(incidentData)
  });
  if (!res.ok) throw new Error('Failed to report incident');
  return res.json();
};

export const issueEmergencyPass = async (passData) => {
  const res = await fetch(`${getBaseUrl()}/supervisor/emergency-pass`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(passData)
  });
  if (!res.ok) throw new Error('Failed to issue emergency pass');
  return res.json();
};
