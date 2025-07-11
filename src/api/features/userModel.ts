type UserRole = 'GERANT' | 'EMPLOYE' | 'LIVREUR';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface RegisterUserRequest {
  email: string;
  motDePasse: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  email: string;
  token: string;
}

export interface ChangePasswordRequest {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

