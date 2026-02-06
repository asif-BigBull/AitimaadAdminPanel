import {
  X,
  Building,
  UserCircle,
  Mail,
  Phone,
  FileText,
  MapPin,
  Globe,
  Clock,
  ShieldCheck,
  Calendar,
  XCircle
} from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';
import { StatusBadge } from '../common/StatusBadge';
import { BusinessVerification } from '@/lib/types';

interface BusinessVerificationModalProps {
  business: BusinessVerification;
  onClose: () => void;
  onVerify: (verificationId: string) => Promise<void>;
  onReject: (verificationId: string) => Promise<void>;
}

export const BusinessVerificationModal: React.FC<BusinessVerificationModalProps> = ({
  business,
  onClose,
  onVerify,
  onReject,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">Business Verification Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-2">
            <Building className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <p className="mt-1 text-sm text-gray-900">{business.business_name || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <UserCircle className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <p className="mt-1 text-sm text-gray-900">{business.user_id}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{business.business_email || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{business.business_phone || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <p className="mt-1 text-sm text-gray-900">{business.business_category || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <p className="mt-1 text-sm text-gray-900">{business.business_city || 'N/A'}</p>
            </div>
          </div>

          <div className="md:col-span-2 flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{business.business_address || 'N/A'}</p>
            </div>
          </div>

          <div className="md:col-span-2 flex items-start gap-2">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900">{business.business_description || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <p className="mt-1 text-sm text-gray-900">{business.business_website || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Contact</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">
                {business.preferred_contact?.replace('_', ' ') || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Best Time to Call</label>
              <p className="mt-1 text-sm text-gray-900">{business.best_time_to_call || 'N/A'}</p>
            </div>
          </div>

          <div className="md:col-span-2 flex items-start gap-2">
            <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Additional Info</label>
              <p className="mt-1 text-sm text-gray-900">{business.additional_info || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <ShieldCheck className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <StatusBadge status={business.status} />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <label className="block text-sm font-medium text-gray-700">Submitted</label>
              <p className="mt-1 text-sm text-gray-900">
                {business.submitted_at ? 
                  format(new Date(business.submitted_at), 'PPpp') : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          {business.status === 'pending' && (
            <>
              <button
                onClick={() => onVerify(business.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Business
              </button>
              <button
                onClick={() => onReject(business.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Reject Business
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};