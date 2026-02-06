'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { LoginComponent } from '@/components/common/LoginComponent';
import { UserVerificationSection } from '@/components/user-verification/UserVerificationSection';
import { BusinessVerificationSection } from '@/components/business-verification/BusinessVerificationSection';
import DashboardSection from '@/components/dashboard/DashboardSection';
import { SectionType } from '@/lib/types';

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedAdminId = localStorage.getItem('admin_id');
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    
    if (isLoggedIn === 'true' && storedAdminId) {
      setAdminId(storedAdminId);
    }
  }, []);

  if (isClient && !adminId) {
    return <LoginComponent setAdminId={setAdminId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen} adminId={null} setAdminId={function (id: string | null): void {
          throw new Error('Function not implemented.');
        } }      />
      
      <div className="lg:pl-72">
      
        
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {activeSection === 'dashboard' ? (
              <DashboardSection />
            ) : activeSection === 'user' ? (
              <UserVerificationSection adminId={adminId || 'admin'} />
            ) : activeSection === 'business' ? (
              <BusinessVerificationSection adminId={adminId || 'admin'} />
            ) : (
              <div className="dashboard-card">
                <h2 className="text-2xl font-bold text-primary-800 mb-2">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
                <p className="text-primary-600">This section is coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}