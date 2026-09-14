import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User, type UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User;
  login: (username: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  switchMasterRole: (newRole?: 'seller' | 'officer') => void;
  isAuthenticated: boolean;
}

// Default initial user: Master ID in Seller Mode (allowing instant testing or full login page testing)
const DEFAULT_USER: User = {
  username: 'master.admin',
  userId: 'SELLER-GJ-8841',
  user_id: 'SELLER-GJ-8841',
  role: 'seller',
  organization: 'ABC Industries Pvt. Ltd.',
  designation: 'Primary Bidder & Compliance Head (Master Privilege)',
  isMaster: true,
  is_master: true,
  token: 'gem_token_master_initial'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('gem_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load saved auth user:", e);
    }
    return DEFAULT_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.setItem('gem_auth_user', JSON.stringify(user));
    } catch (e) {
      console.warn("Failed to save auth user:", e);
    }
  }, [user]);

  const login = async (username: string, password: string, role: UserRole): Promise<User> => {
    const authenticatedUser = await api.login(username, password, role);
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    return authenticatedUser;
  };

  const logout = () => {
    const guestUser: User = {
      username: 'guest',
      userId: 'GUEST-USER',
      user_id: 'GUEST-USER',
      role: 'seller',
      organization: 'Public Guest Session',
      isMaster: false,
      token: ''
    };
    setUser(guestUser);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('gem_auth_user');
    } catch (e) {
      console.warn("Failed to clear auth storage:", e);
    }
  };

  const switchMasterRole = (newRole?: 'seller' | 'officer') => {
    if (!user.isMaster) {
      console.warn("Role switching is only permitted for Master ID accounts.");
      return;
    }

    const targetRole = newRole || (user.role === 'seller' ? 'officer' : 'seller');
    if (targetRole === 'officer') {
      const officerUser: User = {
        ...user,
        role: 'officer',
        userId: 'GOV-OFF-9012',
        user_id: 'GOV-OFF-9012',
        username: 'master.officer',
        organization: 'Government Procurement Directorate (Ministry of Finance)',
        designation: 'Chief Procurement Officer & Legal Scrutiny Authority (GFR 2017 Rule 144)'
      };
      setUser(officerUser);
    } else {
      const sellerUser: User = {
        ...user,
        role: 'seller',
        userId: 'SELLER-GJ-8841',
        user_id: 'SELLER-GJ-8841',
        username: 'master.seller',
        organization: 'ABC Industries Pvt. Ltd.',
        designation: 'Primary Bidder & Compliance Head (MSME Micro)'
      };
      setUser(sellerUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchMasterRole, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
