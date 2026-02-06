import { Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../common/StatusBadge';
import { UserVerification } from '@/lib/types';

interface UserVerificationTableProps {
  verifications: UserVerification[];
  onViewDetails: (verification: UserVerification) => void;
  onApprove: (verificationId: string, userId: string) => void;
  onReject: (verificationId: string) => void;
  onViewRejectionReason: (reason: string) => void;
}

export const UserVerificationTable: React.FC<UserVerificationTableProps> = ({
  verifications,
  onViewDetails,
  onApprove,
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
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Type
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
            {verifications.map((verification) => (
              <tr key={verification.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {verification.user_id.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 capitalize">
                    {verification.document_type?.replace('_', ' ') || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {verification.submitted_at ? format(new Date(verification.submitted_at), 'dd MMM yyyy') : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={verification.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onViewDetails(verification)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  {verification.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(verification.id, verification.user_id)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Approve"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onReject(verification.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  {verification.status === 'rejected' && (
                    <button
                      onClick={() => onViewRejectionReason(verification.rejection_reason || 'No reason provided')}
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