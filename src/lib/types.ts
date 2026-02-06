export type UserVerification = {
  id: string;
  user_id: string;
  document_type: string;
  front_image_url: string;
  back_image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  created_at: string;
};

export type BusinessVerification = {
  id: string;
  user_id: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_category: string;
  business_address: string;
  business_city: string;
  business_description: string;
  business_website: string;
  preferred_contact: string;
  best_time_to_call: string;
  additional_info: string;
  status: 'pending' | 'verified' | 'rejected';
  admin_notes: string | null;
  contacted_at: string | null;
  contacted_by: string | null;
  submitted_at: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Business = {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  is_verified: boolean;
  verification_status: string;
  our_rating: number;
  our_reviews_count: number;
  created_at: string;
  updated_at: string;
  profile_url: string;
};

// Add to existing types
export type SectionType = 'dashboard' | 'user' | 'business' | 'analytics' | 'settings';