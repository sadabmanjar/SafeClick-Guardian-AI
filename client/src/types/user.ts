/** User profile stored in the `profiles` Supabase table */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'citizen' | 'admin' | 'police' | 'super_admin';
  created_at: string;
}
