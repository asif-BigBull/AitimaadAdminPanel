import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  BarChart3,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/contexts/AuthContext';

// Define TypeScript interfaces for better type safety
interface Stat {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend: 'up' | 'down';
}

interface Activity {
  id: string | number;
  user: string;
  action: string;
  time: string;
  type: string;
}

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  approvedUsers: number;
  approvedBusinesses: number;
  growthRate: number;
}

const DashboardSection = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    approvedUsers: 0,
    approvedBusinesses: 0,
    growthRate: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  // const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    const cleanup = setupRealtimeSubscription();
    
    // Cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all businesses from the 'businesses' table
      const { data: allBusinesses, error: businessesError, count: businessesCount } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: false });

      if (businessesError) {
        console.error('Error fetching businesses:', businessesError);
        return;
      }

      // Calculate total businesses from the businesses table
      const totalBusinesses = businessesCount || (allBusinesses ? allBusinesses.length : 0);
      
      // Fetch all users with their user_type and is_verified status
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, user_type, is_verified');

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
      }

      // Calculate counts based on user_type and is_verified
      const users = allUsers || [];
      
      // Total users (all types)
      const totalUsers = users.length;
      
      // Filter businesses from profiles (for verification status)
      const businessUsers = users.filter(user => user.user_type === 'business');
      
      // Approved businesses (user_type === 'business' AND is_verified === true)
      const approvedBusinesses = businessUsers.filter(user => user.is_verified === true).length;
      
      // Filter customers (user_type === 'customer')
      const customerUsers = users.filter(user => user.user_type === 'customer');
      
      // Approved customers (user_type === 'customer' AND is_verified === true)
      const approvedUsers = customerUsers.filter(user => user.is_verified === true).length;

      // Fetch recent activities (last 5) - Update activity tracking for verified users
      const { data: recentUserVerifications } = await supabase
        .from('profiles')
        .select('id, created_at, user_type, is_verified, full_name, email')
        .order('created_at', { ascending: false })
        .limit(5);

      // Format recent activities from user verification status changes
      const activities: Activity[] = (recentUserVerifications || [])
        .map(user => ({
          id: user.id,
          user: user.full_name || user.email || `User ID: ${user.id.substring(0, 8)}...`,
          action: `${user.user_type === 'business' ? 'Business' : 'Customer'} ${user.is_verified ? 'verified' : 'pending verification'}`,
          time: formatTimeAgo(user.created_at),
          type: user.is_verified ? 'success' : 'info'
        }));

      // Calculate growth rate (percentage of approved users vs total users)
      const totalApproved = approvedUsers + approvedBusinesses;
      const growthRate = totalUsers > 0 ? 
        parseFloat(((totalApproved / totalUsers) * 100).toFixed(1)) : 0;

      setStats({
        totalUsers,
        totalBusinesses,
        approvedUsers,
        approvedBusinesses,
        growthRate
      });

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Subscribe to profiles table changes for real-time updates
    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'profiles' }, 
        () => fetchDashboardData()
      )
      .subscribe();

    // Subscribe to businesses table changes for real-time updates
    const businessesSubscription = supabase
      .channel('businesses-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'businesses' }, 
        () => fetchDashboardData()
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      profilesSubscription.unsubscribe();
      businessesSubscription.unsubscribe();
    };
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const dashboardStats: Stat[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%', // You can calculate this from historical data if available
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      trend: 'up'
    },
    {
      title: 'Total Businesses',
      value: stats.totalBusinesses.toLocaleString(),
      change: '+8%',
      icon: Building2,
      color: 'from-purple-500 to-purple-600',
      trend: 'up'
    },
    {
      title: 'Verified Businesses',
      value: stats.approvedBusinesses.toLocaleString(),
      change: `${calculatePercentageChange(stats.approvedBusinesses, stats.totalBusinesses)}%`,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      trend: 'up'
    },
    {
      title: 'Verified Users',
      value: stats.approvedUsers.toLocaleString(),
      change: `${calculatePercentageChange(stats.approvedUsers, stats.totalUsers - stats.totalBusinesses)}%`,
      icon: ShieldCheck,
      color: 'from-yellow-500 to-yellow-600',
      trend: stats.approvedUsers > 0 ? 'up' : 'down'
    }
  ];

  // Helper function to calculate percentage change
  function calculatePercentageChange(current: number, previous: number): string {
    if (previous === 0) return current > 0 ? '+100' : '0';
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
            <p className="text-white/90">Here's what's happening with your platform today.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-medium">
                Last login: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 animate-slide-up" 
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.trend === 'up' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-gray-600 text-sm mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Verification Analytics</h3>
              <p className="text-gray-600 text-sm">Real-time performance</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">
                {stats.growthRate > 0 ? `+${stats.growthRate.toFixed(1)}%` : `${stats.growthRate.toFixed(1)}%`} approval rate
              </span>
            </div>
          </div>
          
          {/* Simplified Chart with Real Data */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Business Verification Rate</div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" 
                    style={{ 
                      width: `${stats.totalBusinesses > 0 ? 
                        Math.min((stats.approvedBusinesses / stats.totalBusinesses * 100), 100) : 0}%`,
                      maxWidth: '100%'
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {stats.totalBusinesses > 0 ? 
                    `${((stats.approvedBusinesses / stats.totalBusinesses) * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">User Verification Rate</div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" 
                    style={{ 
                      width: `${(stats.totalUsers - stats.totalBusinesses) > 0 ? 
                        Math.min((stats.approvedUsers / (stats.totalUsers - stats.totalBusinesses) * 100), 100) : 0}%`,
                      maxWidth: '100%'
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {(stats.totalUsers - stats.totalBusinesses) > 0 ? 
                    `${((stats.approvedUsers / (stats.totalUsers - stats.totalBusinesses)) * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Overall Verification Rate</div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" 
                    style={{ 
                      width: `${Math.min(stats.growthRate, 100)}%`,
                      maxWidth: '100%'
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {stats.growthRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button 
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl font-medium text-sm transition-colors duration-300 flex items-center gap-2"
                onClick={fetchDashboardData}
              >
                <BarChart3 className="h-4 w-4" />
                Refresh Data
              </button>
              <div className="text-xs text-gray-500">
                Updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
              <p className="text-gray-600 text-sm">Latest verification activities</p>
            </div>
            <FileText className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                    activity.type === 'success' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                     <Clock className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No recent activities
              </div>
            )}
          </div>
          
          <button 
            className="w-full mt-6 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-3 rounded-xl font-medium text-sm transition-colors duration-300"
            onClick={fetchDashboardData}
          >
            Refresh Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;