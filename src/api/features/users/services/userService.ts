import api from '../../../api.ts';
import type { User, RegisterUserRequest, LoginRequest, ChangePasswordRequest } from '../models/userModel.ts';

export const userService = {
  login(data: LoginRequest) {
    return api.post('/utilisateurs/login', data);
  },
  register(data: RegisterUserRequest) {
    return api.post('/utilisateurs/register', data);
  },
  getAll() {
    return api.get<User[]>('/utilisateurs');
  },
  delete(id: number) {
    return api.delete(`/utilisateurs/${id}`);
  },
  changePassword(id: number, data: ChangePasswordRequest) {
    return api.patch(`/utilisateurs/change-password?id=${id}`, data);
  },
};

