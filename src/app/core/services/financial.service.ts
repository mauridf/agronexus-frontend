import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { ProductionSale, SaleRequest } from '../models/financial.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  /** Listar vendas de uma fazenda */
  getSales(farmId: string): Observable<ProductionSale[]> {
    return this.get<ProductionSale[]>(`/financial/sales/farm/${farmId}`);
  }

  /** Registrar nova venda */
  createSale(sale: SaleRequest): Observable<ProductionSale> {
    return this.post<ProductionSale>('/financial/sales', sale);
  }
}