import { Bell, Menu, LogOut, ShieldCheck, User } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  adminId: string | null;
  setAdminId: (id: string | null) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  setSidebarOpen, 
  adminId, 
  setAdminId 
}) => {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin_logged_in');
      localStorage.removeItem('admin_id');
      setAdminId(null);
      window.location.reload();
    }
  };

  return (
    <header className="glass-effect sticky top-0 z-40 animate-slide-up">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden px-4 text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="ml-4 lg:ml-0 flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-gradient-green rounded-xl shadow">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">
                  AITIMAAD.PK Admin
                </h1>
                <p className="text-xs sm:text-sm text-primary-600 hidden sm:block">
                  Verification Management Dashboard
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              className="p-2 rounded-xl text-primary-600 hover:text-primary-800 hover:bg-primary-50 relative"
              title="Notifications"
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-gradient-green rounded-full"></span>
            </button>
            
            {adminId && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary-50 rounded-xl">
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-green rounded-lg">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-primary-800">Admin</p>
                    <p className="text-xs text-primary-600">Super Admin</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};