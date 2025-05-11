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
  SearchIcon,
  BellIcon,
  MessageSquareIcon,
  ClipboardListIcon,
} from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Menu = () => {
  const { userData, setIsLogged } = useUserContext();
  const [userStoragedData, setUserStoragedData] = useState<{
    role: string;
  } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("@User");
    if (storedUser) {
      setUserStoragedData(JSON.parse(storedUser));
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

  const items = getMenuItems(userStoragedData?.role || "");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <img src="/findev-medium-logo.svg" width={100} height={40} />
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <SearchIcon className="absolute left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64"
              />
            </div>
          </div>

          {/* Center - Main Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side - Icons and Profile */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
              <MessageSquareIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 rounded-full hover:bg-gray-100">
              <BellIcon className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {userData?.firstName?.charAt(0)}
                    {userData?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDownIcon className="w-4 h-4 text-gray-600" />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium">
                      {userData?.firstName} {userData?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>Perfil</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <SettingsIcon className="w-4 h-4 mr-2" />
                    <span>Configurações</span>
                  </Link>
                  <button
                    onClick={() => {
                      navigate("/");
                      setIsLogged(false);
                      localStorage.clear();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};