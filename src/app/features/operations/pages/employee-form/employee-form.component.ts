import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { OperationsService } from '../../../../core/services/operations.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header"><button mat-icon-button routerLink="/operations/employees"><mat-icon>arrow_back</mat-icon></button><div><h1 class="page-title"><mat-icon>person_add</mat-icon> Novo Funcionário</h1></div></div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card form-card">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Fazenda</mat-label><mat-select formControlName="farmId">@for (f of farms; track f.id) { <mat-option [value]="f.id">{{ f.name }}</mat-option> }</mat-select></mat-form-field>
        <div class="form-grid">
          <mat-form-field appearance="outline" class="full-width"><mat-label>Nome</mat-label><input matInput formControlName="name" maxlength="200"/></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>CPF</mat-label><input matInput formControlName="cpf" mask="000.000.000-00"/></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Função</mat-label><input matInput formControlName="funcao"/></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Salário (R$)</mat-label><input matInput type="number" formControlName="salario" min="0" step="0.01"/><span matPrefix>R$</span></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Data Admissão</mat-label><input matInput type="date" formControlName="dataAdmissao"/></mat-form-field>
        </div>
        <div class="form-actions"><button mat-button type="button" routerLink="/operations/employees">Cancelar</button><button mat-raised-button color="primary" type="submit" [disabled]="isSaving || form.invalid">@if (!isSaving) { <mat-icon>save</mat-icon> <span>Cadastrar</span> }</button></div>
      </form>
    </div>
  `,
  styles: [`.page-container { max-width: 800px; margin: 0 auto; } .page-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; } .page-title { font-size: 1.5rem; font-weight: 700; color: #1B5E20; margin: 0; } .form-card { display: flex; flex-direction: column; gap: 1rem; } .full-width { width: 100%; } .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; }`]
})
export class EmployeeFormComponent implements OnInit {
  form: FormGroup; farms: Farm[] = []; isSaving = false;
  constructor(private fb: FormBuilder, private ops: OperationsService, private farmService: FarmService, private producerService: ProducerService, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({ farmId: ['', Validators.required], name: ['', [Validators.required, Validators.maxLength(200)]], cpf: [''], funcao: [''], salario: ['', Validators.min(0)], dataAdmissao: [''] });
  }
  ngOnInit(): void { const user = this.authService.getCurrentUser(); if (!user) return; const load = (p: any[]) => { const all: Farm[] = []; let c = 0; p.forEach(pp => this.farmService.getFarmsByProducer(pp.id).subscribe({ next: (f) => { all.push(...f); c++; if (c === p.length) this.farms = all; }, error: () => { c++; } })); }; if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load }); else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) }); }
  onSubmit(): void { if (this.form.invalid) return; this.isSaving = true; this.ops.createEmployee(this.form.value).subscribe({ next: () => { this.isSaving = false; this.router.navigate(['/operations/employees']); }, error: () => this.isSaving = false }); }
}