import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Input, InputRequest, InputPurchase, PurchaseRequest, InputStock } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  // ==========================================
  // CATÁLOGO DE INSUMOS
  // ==========================================

  /** Listar todos os insumos */
  getInputs(): Observable<Input[]> {
    return this.get<Input[]>('/inventory/inputs');
  }

  /** Criar novo insumo */
  createInput(input: InputRequest): Observable<Input> {
    return this.post<Input>('/inventory/inputs', input);
  }

  // ==========================================
  // COMPRAS DE INSUMOS
  // ==========================================

  /** Registrar compra de insumo */
  createPurchase(purchase: PurchaseRequest): Observable<InputPurchase> {
    return this.post<InputPurchase>('/inventory/purchases', purchase);
  }

  // ==========================================
  // ESTOQUE
  // ==========================================

  /** Ver estoque da fazenda */
  getStock(farmId: string): Observable<InputStock[]> {
    return this.get<InputStock[]>(`/inventory/stock/farm/${farmId}`);
  }
}