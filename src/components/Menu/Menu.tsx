"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  BriefcaseIcon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
  ChevronDownIcon,
  BellIcon,
  MessageSquareIcon,
  ClipboardListIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface UserData {
  id: string;
  role: "RECRUITER" | "DEVELOPER" | "ADMINISTRATOR";
  email: string;
  firstName: string;
  lastName: string;
  company?: {
    id: string;
  };
}

interface SimpleUser {
  role: "RECRUITER" | "DEVELOPER" | "ADMINISTRATOR";
}

export const Menu = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<SimpleUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("@UserDetails");
    const storedUser = localStorage.getItem("@User");
    
    if (storedUserDetails) {
      setUserData(JSON.parse(storedUserDetails));
    }
    
    if (storedUser) {
      setUserRole(JSON.parse(storedUser));
    }
  }, []);

  const getMenuItems = (role: string) => {
    switch (role) {
      case "ADMINISTRATOR":
        return [
          { label: "Vagas", path: `/admin/jobs/${userData?.company?.id}`, icon: <BriefcaseIcon className="w-5 h-5" /> },
          { label: "Recrutadores", path: `/admin/recruiters/${userData?.company?.id}`, icon: <UsersIcon className="w-5 h-5" /> },
        ];
      case "DEVELOPER":
        return [
          { label: "Início", path: "/home", icon: <HomeIcon className="w-5 h-5" /> },
          { label: "Candidaturas", path: "/applications", icon: <ClipboardListIcon className="w-5 h-5" /> },
        ];
      case "RECRUITER":
        return [
          { label: "Minhas Vagas", path: "/jobs/announces", icon: <BriefcaseIcon className="w-5 h-5" /> },
        ];
      default:
        return [];
    }
  };

  const items = getMenuItems(userRole?.role || "");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/findev-medium-logo.svg" width={100} height={40} alt="Findev Logo" />
            </Link>
          </div>

          {/* Center - Main Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-6">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side - Icons and Profile */}
          <div className="flex items-center space-x-6">
            <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <MessageSquareIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <BellIcon className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-primary/10">
                    {userData?.firstName?.charAt(0)}
                    {userData?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {userData?.firstName} {userData?.lastName}
                  {!userData?.firstName && "Administrador"}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {userData?.firstName} {userData?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{userData?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 mr-3 text-gray-500" />
                      <span>Perfil</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <SettingsIcon className="w-4 h-4 mr-3 text-gray-500" />
                      <span>Configurações</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOutIcon className="w-4 h-4 mr-3 text-gray-500" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};