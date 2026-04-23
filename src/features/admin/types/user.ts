export type UserRole = "USER" | "ADMINISTRATOR";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type CustomerType = "GUEST" | "PROFILE";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  type: CustomerType;
  email: string;
  role: UserRole | null;
  status: UserStatus | null;
  points: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFilter {
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  createdFrom?: string;
  createdTo?: string;
  minPoints?: number;
  maxPoints?: number;
  page?: number;
  size?: number;
}

export interface UserPatch {
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface Profile {
  id: string;
  user: User;
  points: number;
  createdAt: string;
  updatedAt: string;
}
