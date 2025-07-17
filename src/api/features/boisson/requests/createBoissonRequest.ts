export interface CreateBoissonRequest {
  nom: string
  description: string
  prix: number
  volume: number
  unite: string
  seuil: number
  isActive?: boolean
}
