import { api } from '../../../api';
import type {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest, Utilisateur
} from './../models/utilisateurModel.ts';

export class UtilisateurService {
  private static readonly BASE_PATH = '/utilisateurs';

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(`${this.BASE_PATH}/login`, credentials);
    return response.data;
  }

  static async getAllUsers(): Promise<Utilisateur[]> {
    const response = await api.get<Utilisateur[]>(this.BASE_PATH);
    console.log(response.data)
    return response.data;
  }

  static async createUser(userData: CreateUserRequest): Promise<Utilisateur> {
    const response = await api.post<Utilisateur>(`${this.BASE_PATH}/register`, userData);
    return response.data;
  }

  static async deleteUser(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }

  static async changePassword(id: number, passwordData: PasswordChangeRequest): Promise<void> {
    await api.patch(`${this.BASE_PATH}/change-password?id=${id}`, passwordData);
  }

  static async changeStatus(id: number, isActive: boolean): Promise<void> {
    await api.patch(`${this.BASE_PATH}/${id}/status`, { isActive });
  }
}
