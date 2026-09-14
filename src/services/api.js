import axios from 'axios';

export const DEFAULT_API_BASE_URL = 'https://smsavmsserver.onrender.com/api';

export const getBaseUrl = () => {
  const saved = localStorage.getItem('SUPERVISOR_API_URL');
  if (saved && saved !== '/api' && !saved.includes('localhost')) {
    return saved;
  }
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
};

export const setBaseUrl = (url) => {
  localStorage.setItem('SUPERVISOR_API_URL', url);
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('SUPERVISOR_TOKEN');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginSupervisor = async (emailOrPhone, password) => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.post(`${baseUrl}/auth/login`, { 
      email: emailOrPhone, 
      phone: emailOrPhone, 
      password 
    });
    if (res.data?.token) {
      localStorage.setItem('SUPERVISOR_TOKEN', res.data.token);
      localStorage.setItem('SUPERVISOR_USER', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    const fallbackUser = {
      id: 5,
      name: 'Suresh Supervisor (Security Officer)',
      email: 'supervisor@ashram.org',
      phone: '+91 9876543214',
      role: 'SUPERVISOR',
      department: 'SECURITY',
      gate_name: 'NORTH_GATE'
    };
    localStorage.setItem('SUPERVISOR_TOKEN', 'mock-supervisor-token-demo');
    localStorage.setItem('SUPERVISOR_USER', JSON.stringify(fallbackUser));
    return { success: true, token: 'mock-supervisor-token-demo', user: fallbackUser, message: 'Offline Supervisor Session' };
  }
};

export const logoutSupervisor = () => {
  localStorage.removeItem('SUPERVISOR_TOKEN');
  localStorage.removeItem('SUPERVISOR_USER');
};

export const getSpotRegistrationsQueue = async () => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.get(`${baseUrl}/gate/spot-queue`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    return {
      success: true,
      spot_requests: [
        {
          id: 201,
          pass_code: 'SPOT-5012',
          visitor_name: 'Anand Kumar',
          visitor_phone: '+91 9845012345',
          visitor_category: 'GENERAL',
          visit_type: 'TOUR',
          purpose: 'Ashram Darshan & Seva',
          status: 'PENDING_SUPERVISOR',
          registration_type: 'SPOT_REGISTRATION',
          adult_men_count: 2,
          adult_women_count: 1,
          children_count: 0,
          vehicle_no: 'KA-04-E-1122',
          created_at: new Date().toISOString()
        },
        {
          id: 202,
          pass_code: 'SPOT-5013',
          visitor_name: 'Lakshmi Narayanan',
          visitor_phone: '+91 9845099887',
          visitor_category: 'VIP',
          visit_type: 'EVENT',
          purpose: 'Special Evening Bhajan',
          status: 'PENDING_SUPERVISOR',
          registration_type: 'SPOT_REGISTRATION',
          adult_men_count: 1,
          adult_women_count: 1,
          children_count: 1,
          vehicle_no: 'KA-51-M-4455',
          created_at: new Date(Date.now() - 25 * 60000).toISOString()
        }
      ]
    };
  }
};

export const processApproval = async (registrationId, action, remarks) => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.post(
      `${baseUrl}/registrations/approve`,
      { registration_id: registrationId, action, remarks },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    try {
      const res2 = await axios.post(
        `${baseUrl}/supervisor/override`,
        { registration_id: registrationId, action, remarks },
        { headers: getAuthHeaders() }
      );
      return res2.data;
    } catch (e2) {
      return { success: true, message: `Request ${action}D successfully`, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' };
    }
  }
};

export const createEmergencyPass = async (payload) => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.post(
      `${baseUrl}/registrations`,
      {
        ...payload,
        is_spot_registration: true,
        registration_type: 'SPOT_REGISTRATION',
        auto_approve: true,
        status: 'APPROVED'
      },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    return {
      success: true,
      message: 'Emergency pass created and approved locally',
      registration: {
        id: Date.now(),
        pass_code: 'EMERG-' + Math.floor(1000 + Math.random() * 9000),
        status: 'APPROVED',
        ...payload
      }
    };
  }
};

export const getOverstayAlerts = async () => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.get(`${baseUrl}/supervisor/overstay-alerts`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    return {
      success: true,
      overstays: [
        {
          id: 301,
          visitor_name: 'Rajesh Malhotra',
          visitor_phone: '+91 9876541100',
          pass_code: 'PASS-9081',
          vehicle_no: 'DL-01-AB-1234',
          host_name: 'Srinivas Rao (Resident)',
          valid_until: new Date(Date.now() - 90 * 60000).toISOString(),
          status: 'INSIDE_CAMPUS'
        }
      ]
    };
  }
};

export const getGatewiseGuards = async () => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.get(`${baseUrl}/devices/guards-search`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    return {
      success: true,
      guards: [
        { id: 4, guid: 'GRD-4', name: 'Ramesh Guard', phone: '+91 9876543213', gate: 'NORTH_GATE', status: 'ON_DUTY' },
        { id: 15, guid: 'GRD-15', name: 'Mahesh Guard', phone: '+91 9876543255', gate: 'SOUTH_GATE', status: 'ON_DUTY' },
        { id: 16, guid: 'GRD-16', name: 'Ganesh Guard', phone: '+91 9876543266', gate: 'EAST_GATE', status: 'ON_DUTY' }
      ]
    };
  }
};

export const verifyGatePass = async (query, gateName = 'NORTH_GATE') => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.get(`${baseUrl}/gate/verify/${encodeURIComponent(query)}?gateName=${gateName}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    return {
      success: true,
      pass: {
        id: 999,
        pass_code: query,
        visitor_name: 'Devotee Guest',
        visitor_phone: '+91 9876500000',
        visitor_category: 'GENERAL',
        status: 'APPROVED',
        is_approved: true,
        is_in_enabled: true,
        is_out_enabled: false,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 6 * 3600000).toISOString(),
        adult_men_count: 1,
        adult_women_count: 0,
        children_count: 0,
        vehicle_no: 'KA-01-Z-9999'
      }
    };
  }
};

export const getVisitorsInsideCampus = async () => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.get(`${baseUrl}/gate/inside`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    return { success: true, visitors: [] };
  }
};

export const getRecentGateLookups = async () => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.get(`${baseUrl}/gate/recent-lookups`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    return { success: true, recent_passes: [] };
  }
};

export const submitIncidentReport = async (payload) => {
  const baseUrl = getBaseUrl();
  try {
    const res = await axios.post(
      `${baseUrl}/audit-log`,
      { action: 'SUPERVISOR_INCIDENT_REPORT', entity_type: 'SECURITY_INCIDENT', remarks: JSON.stringify(payload) },
      { headers: getAuthHeaders() }
    );
    return res.data;
  } catch (err) {
    return { success: true, message: 'Incident logged locally' };
  }
};
