import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Producer, ProducerRequest } from '../models/producer.model';

@Injectable({
  providedIn: 'root'
})
export class ProducerService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  /** Listar todos os produtores */
  getProducers(page: number = 1, pageSize: number = 20): Observable<Producer[]> {
    return this.get<Producer[]>('/producers', { page, pageSize });
  }

  /** Obter produtor por ID */
  getProducerById(id: string): Observable<Producer> {
    return this.get<Producer>(`/producers/${id}`);
  }

  /** Criar novo produtor */
  createProducer(producer: ProducerRequest): Observable<Producer> {
    return this.post<Producer>('/producers', producer);
  }

  /** Atualizar produtor existente */
  updateProducer(id: string, producer: ProducerRequest): Observable<Producer> {
    return this.put<Producer>(`/producers/${id}`, producer);
  }

  /** Desativar produtor (soft delete) */
  deleteProducer(id: string): Observable<void> {
    return this.delete<void>(`/producers/${id}`);
  }
}