import { UserCheck, Briefcase, Home, LogOut, User, Settings, BarChart3 } from 'lucide-react';
import React from 'react';
import { MobileMenuDialog } from './MobileMenuDialog';
import { SectionType } from '@/lib/types';

interface SidebarProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  adminId: string | null;
  setAdminId: (id: string | null) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  adminId, 
  setAdminId, 
  activeSection,
  setActiveSection,
  isOpen,
  setIsOpen
}) => {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_id');
      setAdminId(null);
      window.location.reload();
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      icon: Home,
      section: 'dashboard' as SectionType,
      badge: null
    },
    {
      name: 'User Verification',
      icon: UserCheck,
      section: 'user' as const,
      badge: ''
    },
    {
      name: 'Business Verification',
      icon: Briefcase,
      section: 'business' as const
      // badge: '8'
    },
    // { 
    //   name: 'Analytics', 
    //   icon: BarChart3, 
    //   section: 'analytics' as SectionType,
    //   badge: null
    // },
    // { 
    //   name: 'Settings', 
    //   icon: Settings, 
    //   section: 'settings' as SectionType,
    //   badge: null
    // },
  ];

  return (
    <>
      <MobileMenuDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex-shrink-0 flex items-center justify-center px-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-green rounded-xl shadow">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
              AITIMAAD.PK
            </h2>
          </div>
        </div>
        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveSection(item.section);
                setIsOpen(false);
              }}
              className={`sidebar-item w-full ${activeSection === item.section
                  ? 'bg-gradient-green text-white shadow-lg'
                  : 'text-primary-700 hover:bg-primary-50'
                }`}
            >
              <item.icon
                className={`${activeSection === item.section ? 'text-white' : 'text-primary-500'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                aria-hidden="true"
              />
              <span className="flex-1 text-left">{item.name}</span>
              {item.badge && (
                <span className={`${activeSection === item.section
                    ? 'bg-white/20 text-white'
                    : 'bg-primary-100 text-primary-700'
                  } text-xs font-medium px-2 py-1 rounded-full`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        
        {/* Logout Button in Mobile Menu */}
        <div className="mt-auto px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </MobileMenuDialog>

      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-primary-100 bg-gradient-to-b from-white to-primary-50">
          <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto">
            <div className="flex items-center justify-center px-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-green rounded-2xl shadow-lg">
                  <Home className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
                    AITIMAAD
                  </h2>
                  <p className="text-xs text-primary-600 mt-1">Admin Dashboard</p>
                </div>
              </div>
            </div>

          

            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.section)}
                  className={`sidebar-item w-full ${activeSection === item.section
                      ? 'bg-gradient-green text-white shadow-lg'
                      : 'text-primary-700 hover:bg-primary-50'
                    }`}
                >
                  <item.icon
                    className={`${activeSection === item.section ? 'text-white' : 'text-primary-500'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className={`${activeSection === item.section
                        ? 'bg-white/20 text-white'
                        : 'bg-primary-100 text-primary-700'
                      } text-xs font-medium px-2 py-1 rounded-full`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Logout Button at Bottom of Desktop Sidebar */}
          <div className="flex-shrink-0 p-4 border-t border-primary-100">
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg mx-4"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>

          </div>
        </div>
      </div>
    </>
  );
};