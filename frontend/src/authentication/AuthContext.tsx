import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthService } from '../authentication/AuthService'; // Adjust the import path as necessary
import { JWTUtils } from '../authentication/JWTUtils'; // Adjust the import path as necessary

// Define the shape of the context state
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Implement the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = JWTUtils.getToken(); // Get the token from storage
        if (token && JWTUtils.isValidToken(token)) { // Check if the token is valid
          const currentUser = await AuthService.getCurrentUser(); // Fetch current user
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Failed to fetch current user:', err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const { user: loggedInUser, token } = await AuthService.login(username, password);
      JWTUtils.setToken(token); // Save the token
      setUser(loggedInUser);
    } catch (err) {
      console.error('Login failed:', err.message);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await AuthService.logout();
      JWTUtils.removeToken(); // Remove the token
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err.message);
      throw err;
    }
  };

  const isAuthenticated = user !== null;

  // Provide the context value to children components
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
