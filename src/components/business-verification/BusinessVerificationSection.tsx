import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BusinessVerification } from '@/lib/types';
import { BusinessVerificationTable } from './BusinessVerificationTable';
import { BusinessVerificationModal } from './BusinessVerificationModal';

interface BusinessVerificationSectionProps {
  adminId: string;
}

export const BusinessVerificationSection: React.FC<BusinessVerificationSectionProps> = ({ adminId }) => {
  const [businessVerifications, setBusinessVerifications] = useState<BusinessVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessVerification | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBusinessVerifications();
  }, []);

  const fetchBusinessVerifications = async () => {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinessVerifications(data || []);
    } catch (error) {
      console.error('Error fetching business verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyBusiness = async (verificationId: string) => {
    if (!confirm('Are you sure you want to verify this business?')) return;
    
    try {
      const verification = businessVerifications.find(v => v.id === verificationId);
      if (!verification) throw new Error('Verification not found');

      // Update verification_requests table
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (verificationError) throw verificationError;

      // Find the existing business by email
      const { data: existingBusiness, error: findError } = await supabase
        .from('businesses')
        .select('id')
        .eq('email', verification.business_email)
        .maybeSingle();

      if (findError) {
        console.error('Error finding business:', findError);
      }

      // Update the existing business verification status if found
      if (existingBusiness) {
        const { error: businessError } = await supabase
          .from('businesses')
          .update({
            is_verified: true,
            verification_status: 'verified',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBusiness.id);

        if (businessError) {
          console.error('Error updating business verification status:', businessError);
          // Continue even if business update fails
        }
      } else {
        console.warn('No business found with email:', verification.business_email);
        // You might want to create the business here if it doesn't exist
        // But based on your requirement, we're only updating existing ones
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_verified: true })
        .eq('user_id', verification.user_id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      alert('Business verified successfully!');
      fetchBusinessVerifications();
    } catch (error) {
      console.error('Error verifying business:', error);
      alert('Error verifying business');
    }
  };

  const rejectBusiness = async (verificationId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const verification = businessVerifications.find(v => v.id === verificationId);
      if (!verification) throw new Error('Verification not found');

      // Update verification_requests table
      const { error } = await supabase
        .from('verification_requests')
        .update({
          status: 'rejected',
          admin_notes: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (error) throw error;

      // Find and update the existing business verification status
      const { data: existingBusiness } = await supabase
        .from('businesses')
        .select('id')
        .eq('email', verification.business_email)
        .maybeSingle();

      if (existingBusiness) {
        await supabase
          .from('businesses')
          .update({
            is_verified: false,
            verification_status: 'rejected',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingBusiness.id);
      }

      alert('Business verification rejected successfully!');
      fetchBusinessVerifications();
    } catch (error) {
      console.error('Error rejecting business verification:', error);
      alert('Error rejecting business verification');
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
        <h2 className="text-2xl font-bold text-gray-900">Business Verifications</h2>
        <p className="text-gray-600">Manage business verification requests</p>
      </div>

      <BusinessVerificationTable
        verifications={businessVerifications}
        onViewDetails={(business) => {
          setSelectedBusiness(business);
          setShowModal(true);
        }}
        onVerify={verifyBusiness}
        onReject={rejectBusiness}
        onViewRejectionReason={handleViewRejectionReason}
      />

      {showModal && selectedBusiness && (
        <BusinessVerificationModal
          business={selectedBusiness}
          onClose={() => setShowModal(false)}
          onVerify={verifyBusiness}
          onReject={rejectBusiness}
        />
      )}
    </div>
  );
};