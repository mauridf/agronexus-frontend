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
  selector: 'app-cost-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-icon-button routerLink="/operations/costs"><mat-icon>arrow_back</mat-icon></button>
        <div><h1 class="page-title"><mat-icon>add_circle</mat-icon> Novo Custo</h1></div>
      </div>
      @if (errorMessage) { <div class="error-alert"><mat-icon>error_outline</mat-icon><span>{{ errorMessage }}</span></div> }
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card form-card">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fazenda</mat-label><mat-select formControlName="farmId">@for (f of farms; track f.id) { <mat-option [value]="f.id">{{ f.name }}</mat-option> }</mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Descrição</mat-label><input matInput formControlName="descricao" maxlength="255"/></mat-form-field>
        <div class="form-grid">
          <mat-form-field appearance="outline"><mat-label>Valor (R$)</mat-label><input matInput type="number" formControlName="valor" min="0" step="0.01"/><span matPrefix>R$</span></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Data</mat-label><input matInput type="date" formControlName="data"/></mat-form-field>
        </div>
        <div class="form-actions">
          <button mat-button type="button" routerLink="/operations/costs">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="isSaving || form.invalid">
            @if (!isSaving) { <mat-icon>save</mat-icon> <span>Cadastrar</span> } @else { <mat-spinner diameter="20"></mat-spinner> }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { max-width: 700px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1B5E20; display: flex; align-items: center; gap: 0.5rem; margin: 0; }
    .error-alert { display: flex; align-items: center; gap: 0.5rem; background: #FFEBEE; color: #D32F2F; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #D32F2F; }
    .form-card { display: flex; flex-direction: column; gap: 1rem; }
    .full-width { width: 100%; }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; }
  `]
})
export class CostFormComponent implements OnInit {
  form: FormGroup; farms: Farm[] = []; isSaving = false; errorMessage = '';
  constructor(
    private fb: FormBuilder, private ops: OperationsService,
    private farmService: FarmService, private producerService: ProducerService,
    private authService: AuthService, private router: Router
  ) {
    this.form = this.fb.group({
      farmId: ['', Validators.required], descricao: ['', [Validators.required, Validators.maxLength(255)]],
      valor: ['', [Validators.required, Validators.min(0.01)]], data: ['', Validators.required]
    });
  }
  ngOnInit(): void { this.loadFarms(); }
  loadFarms(): void {
    const user = this.authService.getCurrentUser(); if (!user) return;
    const load = (producers: any[]) => { const all: Farm[] = []; let c = 0; producers.forEach(p => this.farmService.getFarmsByProducer(p.id).subscribe({ next: (f) => { all.push(...f); c++; if (c === producers.length) this.farms = all; }, error: () => { c++; } })); };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }
  onSubmit(): void {
    if (this.form.invalid) { Object.keys(this.form.controls).forEach(k => this.form.get(k)?.markAsTouched()); return; }
    this.isSaving = true;
    this.ops.createCost(this.form.value).subscribe({ next: () => { this.isSaving = false; this.router.navigate(['/operations/costs']); }, error: (e) => { this.isSaving = false; this.errorMessage = e.message; } });
  }
}