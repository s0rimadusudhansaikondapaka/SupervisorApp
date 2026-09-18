// src/services/api.js
import axios from 'axios';

let BASE_URL = localStorage.getItem('supervisor_api_url') || 'https://v-pass-backend.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBaseUrl = () => BASE_URL;

export const setBaseUrl = (url) => {
  BASE_URL = url.replace(/\/+$/, '');
  localStorage.setItem('supervisor_api_url', BASE_URL);
  api.defaults.baseURL = BASE_URL;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supervisor_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const loginSupervisor = async (username, password) => {
  const res = await api.post('/api/auth/supervisor/login', { username, password });
  return res.data;
};

export const logoutSupervisor = async () => {
  localStorage.removeItem('supervisor_token');
  localStorage.removeItem('supervisor_user');
};

// Spot registrations queue & approvals
export const getSpotRegistrationsQueue = async () => {
  const res = await api.get('/api/supervisor/spot-queue');
  return res.data;
};

export const processApproval = async (id, status, reason = '') => {
  const res = await api.post(`/api/supervisor/spot-queue/${id}/action`, { status, reason });
  return res.data;
};

export const approveSpotPass = async (id, notes) => {
  const res = await api.post(`/api/supervisor/spot-queue/${id}/approve`, { notes });
  return res.data;
};

export const rejectSpotPass = async (id, reason) => {
  const res = await api.post(`/api/supervisor/spot-queue/${id}/reject`, { reason });
  return res.data;
};

// Overstay alerts
export const getOverstayAlerts = async () => {
  const res = await api.get('/api/supervisor/overstay-alerts');
  return res.data;
};

export const resolveAlert = async (alertId, resolutionNotes) => {
  const res = await api.post(`/api/supervisor/overstay-alerts/${alertId}/resolve`, { resolutionNotes });
  return res.data;
};

// Guards & Roster
export const getGatewiseGuards = async () => {
  const res = await api.get('/api/supervisor/gate-guards');
  return res.data;
};

export const getGuards = async () => {
  const res = await api.get('/api/supervisor/guards');
  return res.data;
};

// Visitors
export const getVisitorsInsideCampus = async () => {
  const res = await api.get('/api/supervisor/visitors-inside');
  return res.data;
};

export const getVisitorsInside = async () => {
  const res = await api.get('/api/supervisor/visitors-inside');
  return res.data;
};

// Emergency Passes
export const createEmergencyPass = async (passData) => {
  const res = await api.post('/api/supervisor/emergency-pass', passData);
  return res.data;
};

// Incident Reports
export const submitIncidentReport = async (reportData) => {
  const res = await api.post('/api/supervisor/incident-report', reportData);
  return res.data;
};

// Gate Logs
export const getGateLogs = async (params) => {
  const res = await api.get('/api/supervisor/gate-logs', { params });
  return res.data;
};

export default api;
