import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { OperationsService } from '../../../../core/services/operations.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Employee } from '../../../../core/models/operations.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  farms: Farm[] = [];
  selectedFarmId: string = '';
  isLoading = true;

  constructor(
    private ops: OperationsService, private farmService: FarmService,
    private producerService: ProducerService, private authService: AuthService
  ) {}

  ngOnInit(): void { this.loadFarms(); }

  loadFarms(): void {
    const user = this.authService.getCurrentUser(); if (!user) return;
    const load = (producers: any[]) => { const all: Farm[] = []; if (!producers.length) { this.farms = []; this.isLoading = false; return; } let c = 0; producers.forEach(p => this.farmService.getFarmsByProducer(p.id).subscribe({ next: (f) => { all.push(...f); c++; if (c === producers.length) { this.farms = all; if (all.length) { this.selectedFarmId = all[0].id; this.loadEmployees(); } else this.isLoading = false; } }, error: () => { c++; } })); };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }

  onFarmChange(): void { if (this.selectedFarmId) this.loadEmployees(); }

  loadEmployees(): void {
    this.isLoading = true;
    this.ops.getEmployees(this.selectedFarmId).subscribe({ next: (d) => { this.employees = d; this.isLoading = false; }, error: () => this.isLoading = false });
  }

  dismissEmployee(emp: Employee): void {
    if (!emp.empregado) return;
    const hoje = new Date().toISOString().split('T')[0];
    if (confirm(`Demitir "${emp.name}"?`)) {
      this.ops.dismissEmployee(emp.id, { dataDemissao: hoje }).subscribe({
        next: () => { emp.empregado = false; emp.dataDemissao = hoje; },
        error: () => alert('Erro ao demitir funcionário.')
      });
    }
  }
}