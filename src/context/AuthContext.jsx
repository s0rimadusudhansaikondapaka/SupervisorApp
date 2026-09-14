import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginSupervisor, logoutSupervisor, getBaseUrl, setBaseUrl } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('SUPERVISOR_USER');
    return saved ? JSON.parse(saved) : {
      id: 5,
      name: 'Suresh Supervisor',
      role: 'SUPERVISOR',
      phone: '+91 9876543214',
      email: 'supervisor@ashram.org',
      gate_name: 'NORTH_GATE'
    };
  });

  const [selectedGate, setSelectedGate] = useState(() => {
    return localStorage.getItem('SUPERVISOR_SELECTED_GATE') || 'NORTH_GATE';
  });

  const [apiUrl, setApiUrlState] = useState(getBaseUrl());

  const handleSetGate = (gate) => {
    setSelectedGate(gate);
    localStorage.setItem('SUPERVISOR_SELECTED_GATE', gate);
  };

  const handleSetApiUrl = (url) => {
    setBaseUrl(url);
    setApiUrlState(url);
  };

  const handleLogin = async (identifier, password) => {
    const res = await loginSupervisor(identifier, password);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const handleLogout = () => {
    logoutSupervisor();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedGate,
        setSelectedGate: handleSetGate,
        apiUrl,
        setApiUrl: handleSetApiUrl,
        login: handleLogin,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
