import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "faculty" | "student";
  is_active: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  profile_image?: string;
}

type AppRole = "admin" | "faculty" | "student";

interface AuthContextType {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for stored token and user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Fetch user data when token changes
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setRole(null);
        return;
      }

      try {
        const response = await api.get("/user");
        const userData = response.data.user;
        setUser(userData);
        setRole(userData.role);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.error("Error fetching user:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setRole(null);
      }
    };

    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/login", { email, password });
      console.log("Login response:", response.data);
      
      const { user, token } = response.data;
      
      if (!user || !token) {
        console.error("Missing user or token in response", response.data);
        return { error: "Invalid server response" };
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setUser(user);
      setRole(user.role || null);
      
      return { error: null };
    } catch (err: any) {
      console.error("Login error:", err);
      return { 
        error: err.response?.data?.message || err.response?.data?.errors?.email?.[0] || "Login failed" 
      };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userRole = "student") => {
    try {
      const response = await api.post("/register", {
        name: fullName,
        email,
        password,
        password_confirmation: password,
        role: userRole,
      });
      
      const { user, token } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setUser(user);
      setRole(user.role);
      
      return { error: null };
    } catch (err: any) {
      console.error("Signup error:", err);
      return { 
        error: err.response?.data?.message || "Registration failed" 
      };
    }
  };

  const signOut = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setRole(null);
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
