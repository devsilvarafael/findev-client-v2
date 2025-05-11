"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

interface UserDetails {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  role: SimpleUserType["role"];
  createdAt: string;
  updatedAt: string;
  [key: string]: string | number | boolean | null;
}

type SimpleUserType = {
  id: string;
  role: "RECRUITER" | "DEVELOPER" | "ADMINISTRATOR";
  email: string;
};

type UserContextType = {
  simpleUserJson: SimpleUserType | null;
  userData: UserDetails | null;
  isLoadingUserData: boolean;
  isInitialized: boolean;
  refetchUserData: () => void;
  setIsLogged: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
  isAuthorized: (allowedRoles: SimpleUserType["role"][]) => boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [simpleUserJson, setSimpleUserJson] = useState<SimpleUserType | null>(() => {
    const storedUser = localStorage.getItem("@User");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [isLogged, setIsLogged] = useState(() => {
    return !!localStorage.getItem("authToken");
  });

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setSimpleUserJson(null);
    setIsLogged(false);
    setIsInitialized(false);
  };

  const isAuthorized = (allowedRoles: SimpleUserType["role"][]) => {
    if (!simpleUserJson) return false;
    return allowedRoles.includes(simpleUserJson.role);
  };

  const getUserRoleEndpoint = (role: string) => {
    switch (role) {
      case "RECRUITER":
        return "/recruiters";
      case "DEVELOPER":
        return "/developers";
      case "ADMINISTRATOR":
        return "/admin";
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  };

  const {
    data: userData = null,
    isLoading: isLoadingUserData,
    isFetching,
    refetch: refetchUserData,
  } = useQuery<UserDetails, Error>({
    queryKey: ["userInfo", simpleUserJson?.id],
    queryFn: async () => {
      if (!simpleUserJson) {
        setIsInitialized(false);
        throw new Error("No user data");
      }

      const userRoleEndpoint = getUserRoleEndpoint(simpleUserJson.role);
      const response = await api.get(`${userRoleEndpoint}/${simpleUserJson.id}`);
      const userData = response.data as UserDetails;
      localStorage.setItem("@UserDetails", JSON.stringify(userData));
      setIsInitialized(true);
      return userData;
    },
    enabled: !!simpleUserJson && isLogged,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
    retry: 1,
    onError: (error) => {
      console.error("Error fetching user data:", error);
      if ((error as { response?: { status: number } })?.response?.status === 401) {
        logout();
      }
      setIsInitialized(false);
    }
  });

console.log(isFetching, isLoadingUserData)
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("@User");
    
    if (!authToken) {
      logout();
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as SimpleUserType;
        setSimpleUserJson(parsedUser);
        setIsLogged(true);
        
        // Redirect recruiter to job announcements page
        if (parsedUser.role === "RECRUITER" && window.location.pathname === "/home") {
          window.location.replace("/jobs/announces");
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        logout();
      }
    }
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [isLogged]);

  // Reset initialization when user changes
  useEffect(() => {
    if (!simpleUserJson) {
      setIsInitialized(false);
    }
  }, [simpleUserJson]);

  if (!isInitialized && isLogged) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        simpleUserJson,
        userData,
        isLoadingUserData,
        isInitialized,
        refetchUserData,
        setIsLogged,
        logout,
        isAuthorized,
      }}
    >
      {!isLoadingUserData && children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
