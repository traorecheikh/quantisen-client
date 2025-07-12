import { api } from '../../../api';
import type {
  User,
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest
} from './../models/userModel';

export class UserService {
  private static readonly BASE_PATH = '/utilisateurs';

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(`${this.BASE_PATH}/login`, credentials);
    return response.data;
  }

  static async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>(this.BASE_PATH);
    console.log(response.data)
    return response.data;
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>(`${this.BASE_PATH}/register`, userData);
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
