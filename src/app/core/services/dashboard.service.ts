import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  ProducerDashboard,
  FinancialDashboard,
  FarmDashboard,
  AdminDashboard,
  QuickStats
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  /** Dashboard do produtor */
  getProducerDashboard(producerId: string): Observable<ProducerDashboard> {
    return this.get<ProducerDashboard>(`/dashboard/producer/${producerId}`);
  }

  /** Dashboard financeiro */
  getFinancialDashboard(producerId: string): Observable<FinancialDashboard> {
    return this.get<FinancialDashboard>(`/dashboard/financial/${producerId}`);
  }

  /** Dashboard da fazenda */
  getFarmDashboard(farmId: string): Observable<FarmDashboard> {
    return this.get<FarmDashboard>(`/dashboard/farm/${farmId}`);
  }

  /** Dashboard do admin */
  getAdminDashboard(): Observable<AdminDashboard> {
    return this.get<AdminDashboard>('/dashboard/admin');
  }

  /** Quick stats (versão leve) */
  getQuickStats(producerId: string): Observable<QuickStats> {
    return this.get<QuickStats>(`/dashboard/quick/${producerId}`);
  }
}