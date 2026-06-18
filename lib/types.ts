export type UserRole = 'WY' | 'YYH';
export type Visibility = 'private' | 'public';
export type GuestStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type Profile = {
  id: string;
  role: UserRole;
  display_name: string;
  avatar_url: string | null;
};

export type AppSettings = {
  id: string;
  couple_name: string;
  site_title: string;
  start_date: string;
  wy_display_name: string;
  yyh_display_name: string;
  allow_guest_request: boolean;
};

export type LoveRecord = {
  id: string;
  title: string;
  content: string;
  date: string;
  author_role: UserRole;
  mood: string | null;
  tags: string[] | null;
  is_favorite: boolean;
  visibility: Visibility;
};

export type AlbumPhoto = {
  id: string;
  image_url: string;
  storage_path: string | null;
  caption: string | null;
  date: string;
  author_role: UserRole;
  category: string;
  visibility: Visibility;
};

export type Anniversary = {
  id: string;
  title: string;
  date: string;
  type: string;
  repeat: 'none' | 'monthly' | 'yearly';
  note: string | null;
  visibility: Visibility;
};

export type Wish = {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'planning' | 'done';
  target_date: string | null;
  creator_role: UserRole;
  completed_date: string | null;
  completed_note: string | null;
  visibility: Visibility;
};

export type MessageNote = {
  id: string;
  content: string;
  author_role: UserRole;
  date: string;
  theme: 'pink' | 'purple' | 'cream';
  is_pinned: boolean;
  visibility: Visibility;
};

export type GuestRequest = {
  id: string;
  guest_name: string;
  reason: string;
  status: GuestStatus;
  access_token: string | null;
  token_expires_at: string | null;
  approved_by_role: UserRole | null;
  approved_at: string | null;
  rejected_by_role: UserRole | null;
  rejected_at: string | null;
  created_at: string;
};
