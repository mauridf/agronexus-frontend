import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  Alert, AlertRequest,
  Certificate, CertificateRequest,
  Climate, ClimateRequest
} from '../models/monitoring.model';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  // ==========================================
  // ALERTAS
  // ==========================================

  getAlerts(farmId: string): Observable<Alert[]> {
    return this.get<Alert[]>(`/monitoring/alerts/farm/${farmId}`);
  }

  createAlert(alert: AlertRequest): Observable<Alert> {
    return this.post<Alert>('/monitoring/alerts', alert);
  }

  resolveAlert(alertId: string): Observable<Alert> {
    return this.patch<Alert>(`/monitoring/alerts/${alertId}/resolve`, {});
  }

  // ==========================================
  // CERTIFICADOS
  // ==========================================

  getCertificates(farmId: string): Observable<Certificate[]> {
    return this.get<Certificate[]>(`/monitoring/certificates/farm/${farmId}`);
  }

  createCertificate(cert: CertificateRequest): Observable<Certificate> {
    return this.post<Certificate>('/monitoring/certificates', cert);
  }

  // ==========================================
  // CLIMA
  // ==========================================

  getClimateRecords(farmId: string): Observable<Climate[]> {
    return this.get<Climate[]>(`/monitoring/climate/farm/${farmId}`);
  }

  createClimateRecord(climate: ClimateRequest): Observable<Climate> {
    return this.post<Climate>('/monitoring/climate', climate);
  }
}