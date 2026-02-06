import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserVerification } from '@/lib/types';
import { UserVerificationTable } from './UserVerificationTable';
import { UserVerificationModal } from './UserVerificationModal';

interface UserVerificationSectionProps {
  adminId: string;
}

export const UserVerificationSection: React.FC<UserVerificationSectionProps> = ({ adminId }) => {
  const [verifications, setVerifications] = useState<UserVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<UserVerification | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveVerification = async (verificationId: string, userId: string) => {
    if (!confirm('Are you sure you want to approve this verification?')) return;
    
    try {
      const { error: verificationError } = await supabase
        .from('verifications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId
        })
        .eq('id', verificationId);

      if (verificationError) throw verificationError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('user_id', userId);

      if (profileError) throw profileError;

      alert('Verification approved successfully!');
      fetchVerifications();
    } catch (error) {
      console.error('Error approving verification:', error);
      alert('Error approving verification');
    }
  };

  const rejectVerification = async (verificationId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const { error } = await supabase
        .from('verifications')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminId
        })
        .eq('id', verificationId);

      if (error) throw error;

      alert('Verification rejected successfully!');
      fetchVerifications();
    } catch (error) {
      console.error('Error rejecting verification:', error);
      alert('Error rejecting verification');
    }
  };

  const handleViewRejectionReason = (reason: string) => {
    alert(`Rejection Reason: ${reason}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Verifications</h2>
        <p className="text-gray-600">Manage user identity verification requests</p>
      </div>

      <UserVerificationTable
        verifications={verifications}
        onViewDetails={(verification) => {
          setSelectedVerification(verification);
          setShowModal(true);
        }}
        onApprove={approveVerification}
        onReject={rejectVerification}
        onViewRejectionReason={handleViewRejectionReason}
      />

      {showModal && selectedVerification && (
        <UserVerificationModal
          verification={selectedVerification}
          onClose={() => setShowModal(false)}
          onApprove={approveVerification}
          onReject={rejectVerification}
        />
      )}
    </div>
  );
};