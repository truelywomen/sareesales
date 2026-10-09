import React, { createContext, useContext, useState, useEffect } from 'react';
import { VENDOR_PASSWORD } from '../config/authConfig';
import { getVendorProfile, setVendorProfile, clearVendorProfile } from '../utils/storage';
import { VendorProfile } from '../types';

interface VendorAuthContextType {
  vendor: VendorProfile | null;
  isAuthenticated: boolean;
  login: (email: string, username: string, password: string) => boolean;
  logout: () => void;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

export const VendorAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendor, setVendor] = useState<VendorProfile | null>(() => {
    const cached = getVendorProfile();
    return cached ? { ...cached, isLoggedIn: true } : null;
  });

  useEffect(() => {
    const cached = getVendorProfile();
    if (cached) {
      setVendor({ ...cached, isLoggedIn: true });
    }
  }, []);

  const login = (email: string, username: string, password: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    if (password === VENDOR_PASSWORD && trimmedEmail && trimmedUsername) {
      const profile: VendorProfile = {
        email: trimmedEmail,
        username: trimmedUsername,
        isLoggedIn: true
      };
      setVendorProfile(profile);
      setVendor(profile);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearVendorProfile();
    setVendor(null);
  };

  return (
    <VendorAuthContext.Provider
      value={{
        vendor,
        isAuthenticated: !!vendor?.isLoggedIn,
        login,
        logout
      }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
};
