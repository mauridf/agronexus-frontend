import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  Contract, ContractRequest,
  OperationalCost, CostRequest,
  Machine, MachineRequest,
  Employee, EmployeeRequest, DismissEmployeeRequest
} from '../models/operations.model';

@Injectable({
  providedIn: 'root'
})
export class OperationsService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  // ==========================================
  // CONTRATOS
  // ==========================================

  getContracts(farmId: string): Observable<Contract[]> {
    return this.get<Contract[]>(`/operations/contracts/farm/${farmId}`);
  }

  createContract(contract: ContractRequest): Observable<Contract> {
    return this.post<Contract>('/operations/contracts', contract);
  }

  // ==========================================
  // CUSTOS OPERACIONAIS
  // ==========================================

  getCosts(farmId: string): Observable<OperationalCost[]> {
    return this.get<OperationalCost[]>(`/operations/costs/farm/${farmId}`);
  }

  createCost(cost: CostRequest): Observable<OperationalCost> {
    return this.post<OperationalCost>('/operations/costs', cost);
  }

  // ==========================================
  // MÁQUINAS
  // ==========================================

  getMachines(farmId: string): Observable<Machine[]> {
    return this.get<Machine[]>(`/operations/machines/farm/${farmId}`);
  }

  createMachine(machine: MachineRequest): Observable<Machine> {
    return this.post<Machine>('/operations/machines', machine);
  }

  // ==========================================
  // FUNCIONÁRIOS
  // ==========================================

  getEmployees(farmId: string): Observable<Employee[]> {
    return this.get<Employee[]>(`/operations/employees/farm/${farmId}`);
  }

  createEmployee(employee: EmployeeRequest): Observable<Employee> {
    return this.post<Employee>('/operations/employees', employee);
  }

  dismissEmployee(employeeId: string, data: DismissEmployeeRequest): Observable<Employee> {
    return this.post<Employee>(`/operations/employees/${employeeId}/dismiss`, data);
  }
}