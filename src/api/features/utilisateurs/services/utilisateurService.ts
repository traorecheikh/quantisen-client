import { cachedGet, cachedPost, cachedDelete } from '../../../api'
import { CACHE_TTL } from '../../../../utils/cache'
import { api } from '../../../api'
import type {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
  Utilisateur,
} from './../models/utilisateurModel.ts'

export class UtilisateurService {
  private static readonly BASE_PATH = '/utilisateurs'

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(`${this.BASE_PATH}/login`, credentials)
    console.log(response)
    return response.data
  }

  static async getAllUsers(): Promise<Utilisateur[]> {
    return await cachedGet<Utilisateur[]>(this.BASE_PATH, { ttl: CACHE_TTL.USERS })
  }

  static async createUser(userData: CreateUserRequest): Promise<Utilisateur> {
    return await cachedPost<Utilisateur>(
      `${this.BASE_PATH}/register`,
      userData,
      ['users', 'dashboard'] // Invalidate related caches
    )
  }

  static async deleteUser(id: number): Promise<void> {
    return await cachedDelete<void>(
      `${this.BASE_PATH}/${id}`,
      ['users', 'dashboard'] // Invalidate related caches
    )
  }

  static async changePassword(id: number, passwordData: PasswordChangeRequest): Promise<void> {
    await api.patch(`${this.BASE_PATH}/change-password?id=${id}`, passwordData)
  }

  static async changeStatus(id: number, isActive: boolean): Promise<void> {
    await api.patch(`${this.BASE_PATH}/${id}/status`, { isActive })
    const { cacheManager } = await import('../../../api')
    const keys = cacheManager.getStats().keys
    keys.forEach((key) => {
      if (key.includes('users') || key.includes('dashboard')) {
        cacheManager.delete(key)
      }
    })
  }
}
