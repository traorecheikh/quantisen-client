// User role enum


// User model
import type {UserRole} from "../../../enums/userRole.ts";

export interface User {
  id: number;
  firstName: string;
    lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
}

// Create user request
export interface CreateUserRequest {
  email: string;
  motDePasse: string;
  role: UserRole;
}

// Login request
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

// Login response
export interface LoginResponse {
  token: string;
  user: User;
}

// Password change request
export interface PasswordChangeRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}
