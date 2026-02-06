import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import React from 'react';

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return { 
        color: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border border-yellow-200', 
        icon: Clock 
      };
    case 'approved':
    case 'verified':
      return { 
        color: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200', 
        icon: CheckCircle 
      };
    case 'rejected':
      return { 
        color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200', 
        icon: XCircle 
      };
    default:
      return { 
        color: 'bg-gradient-to-r from-primary-100 to-primary-50 text-primary-800 border border-primary-200', 
        icon: AlertCircle 
      };
  }
};

interface StatusBadgeProps {
  status: string | null | undefined;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusValue = status || 'pending';
  const config = getStatusConfig(statusValue);
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.color}`}>
      <Icon className="h-4 w-4 mr-2" />
      {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
    </span>
  );
};