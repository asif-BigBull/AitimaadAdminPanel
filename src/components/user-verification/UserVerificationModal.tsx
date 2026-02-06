import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../common/StatusBadge';
import { UserVerification } from '@/lib/types';

interface UserVerificationModalProps {
  verification: UserVerification;
  onClose: () => void;
  onApprove: (verificationId: string, userId: string) => Promise<void>;
  onReject: (verificationId: string) => Promise<void>;
}

export const UserVerificationModal: React.FC<UserVerificationModalProps> = ({
  verification,
  onClose,
  onApprove,
  onReject,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">Verification Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <p className="mt-1 text-sm text-gray-900">{verification.user_id}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Document Type</label>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {verification.document_type?.replace('_', ' ') || 'N/A'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1">
              <StatusBadge status={verification.status} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Submitted</label>
            <p className="mt-1 text-sm text-gray-900">
              {verification.submitted_at ? 
                format(new Date(verification.submitted_at), 'PPpp') : 'N/A'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Document Images</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Front Image</p>
              <img
                src={verification.front_image_url || '/placeholder-image.jpg'}
                alt="Front of document"
                className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Back Image</p>
              <img
                src={verification.back_image_url || '/placeholder-image.jpg'}
                alt="Back of document"
                className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                }}
              />
            </div>
          </div>
        </div>

        {verification.rejection_reason && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
            <p className="mt-1 text-sm text-red-600 bg-red-50 p-3 rounded">
              {verification.rejection_reason}
            </p>
          </div>
        )}

        {verification.status === 'pending' && (
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => onApprove(verification.id, verification.user_id)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approve
            </button>
            <button
              onClick={() => onReject(verification.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};