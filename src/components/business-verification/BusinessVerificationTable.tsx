import { Eye, ShieldCheck, XCircle, AlertCircle } from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../common/StatusBadge';
import { BusinessVerification } from '@/lib/types';

interface BusinessVerificationTableProps {
  verifications: BusinessVerification[];
  onViewDetails: (verification: BusinessVerification) => void;
  onVerify: (verificationId: string) => void;
  onReject: (verificationId: string) => void;
  onViewRejectionReason: (reason: string) => void;
}

export const BusinessVerificationTable: React.FC<BusinessVerificationTableProps> = ({
  verifications,
  onViewDetails,
  onVerify,
  onReject,
  onViewRejectionReason,
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {verifications.map((business) => (
              <tr key={business.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{business.business_name || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{business.business_category || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{business.business_email || 'N/A'}</div>
                  <div className="text-sm text-gray-500">{business.business_phone || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {business.submitted_at ? format(new Date(business.submitted_at), 'dd MMM yyyy') : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={business.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onViewDetails(business)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {business.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onVerify(business.id)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Verify Business"
                      >
                        <ShieldCheck className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onReject(business.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Reject Business"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {business.status === 'rejected' && business.admin_notes && (
                    <button
                      onClick={() => onViewRejectionReason(business.admin_notes!)}
                      className="text-gray-600 hover:text-gray-900 p-1"
                      title="View Rejection Reason"
                    >
                      <AlertCircle className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};