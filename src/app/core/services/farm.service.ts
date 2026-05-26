import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Farm, FarmRequest } from '../models/farm.model';

@Injectable({
  providedIn: 'root'
})
export class FarmService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  /** Listar fazendas de um produtor */
  getFarmsByProducer(producerId: string): Observable<Farm[]> {
    return this.get<Farm[]>(`/farms/producer/${producerId}`);
  }

  /** Obter fazenda por ID */
  getFarmById(id: string): Observable<Farm> {
    return this.get<Farm>(`/farms/${id}`);
  }

  /** Criar nova fazenda */
  createFarm(farm: FarmRequest): Observable<Farm> {
    return this.post<Farm>('/farms', farm);
  }

  /** Atualizar fazenda */
  updateFarm(id: string, farm: FarmRequest): Observable<Farm> {
    return this.put<Farm>(`/farms/${id}`, farm);
  }

  /** Desativar fazenda (soft delete) */
  deleteFarm(id: string): Observable<void> {
    return this.delete<void>(`/farms/${id}`);
  }
}