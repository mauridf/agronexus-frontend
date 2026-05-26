import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  Culture,
  CultureRequest,
  PlantedCulture,
  PlantCultureRequest,
  HarvestRequest
} from '../models/agriculture.model';

@Injectable({
  providedIn: 'root'
})
export class AgricultureService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  // ==========================================
  // CATÁLOGO DE CULTURAS
  // ==========================================

  /** Listar todas as culturas do catálogo */
  getCultures(): Observable<Culture[]> {
    return this.get<Culture[]>('/agriculture/cultures');
  }

  /** Obter cultura por ID */
  getCultureById(id: string): Observable<Culture> {
    return this.get<Culture>(`/agriculture/cultures/${id}`);
  }

  /** Criar nova cultura no catálogo */
  createCulture(culture: CultureRequest): Observable<Culture> {
    return this.post<Culture>('/agriculture/cultures', culture);
  }

  // ==========================================
  // CULTURAS PLANTADAS
  // ==========================================

  /** Listar culturas plantadas de uma fazenda */
  getPlantedCultures(farmId: string): Observable<PlantedCulture[]> {
    return this.get<PlantedCulture[]>(`/agriculture/planted/farm/${farmId}`);
  }

  /** Plantar uma cultura na fazenda */
  plantCulture(data: PlantCultureRequest): Observable<PlantedCulture> {
    return this.post<PlantedCulture>('/agriculture/planted', data);
  }

  /** Registrar colheita */
  harvestCulture(plantedId: string, data: HarvestRequest): Observable<PlantedCulture> {
    return this.post<PlantedCulture>(`/agriculture/planted/${plantedId}/harvest`, data);
  }
}