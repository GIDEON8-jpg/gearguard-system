import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'driver';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginDemo: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('auth-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your API
    if (email === 'admin@fleetguard.co.zw' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        name: 'Tendai Mukamuri',
        email: 'admin@fleetguard.co.zw',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('auth-user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - in real app, this would call your API
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'manager'
    };
    setUser(newUser);
    localStorage.setItem('auth-user', JSON.stringify(newUser));
    return true;
  };

  const loginDemo = () => {
    const demoUser: User = {
      id: 'demo',
      name: 'Demo User',
      email: 'demo@fleetguard.co.zw',
      role: 'admin'
    };
    setUser(demoUser);
    localStorage.setItem('auth-user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      loginDemo,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}