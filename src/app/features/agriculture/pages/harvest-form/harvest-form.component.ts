import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AgricultureService } from '../../../../core/services/agriculture.service';
import { HarvestRequest } from '../../../../core/models/agriculture.model';

@Component({
  selector: 'app-harvest-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <button mat-icon-button routerLink="/agriculture/planted" matTooltip="Voltar">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <div>
          <h1 class="page-title">
            <mat-icon>check_circle</mat-icon>
            Registrar Colheita
          </h1>
          <p class="page-subtitle">Informe os dados da colheita realizada</p>
        </div>
      </div>

      @if (errorMessage) {
        <div class="error-alert">
          <mat-icon>error_outline</mat-icon>
          <span>{{ errorMessage }}</span>
        </div>
      }

      <form [formGroup]="harvestForm" (ngSubmit)="onSubmit()" class="form-card card">
        <mat-form-field appearance="outline">
          <mat-label>Data da Colheita</mat-label>
          <input matInput type="date" formControlName="dataColheitaReal"/>
          <mat-icon matPrefix>today</mat-icon>
          @if (harvestForm.get('dataColheitaReal')?.invalid && harvestForm.get('dataColheitaReal')?.touched) {
            <mat-error>Data da colheita é obrigatória</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Produtividade Obtida (sc/ha)</mat-label>
          <input matInput type="number" formControlName="produtividadeObtidaSacasHa" placeholder="0.00" min="0" step="0.01"/>
          <span matSuffix>sc/ha</span>
          <mat-icon matPrefix>trending_up</mat-icon>
          @if (harvestForm.get('produtividadeObtidaSacasHa')?.invalid && harvestForm.get('produtividadeObtidaSacasHa')?.touched) {
            <mat-error>Produtividade é obrigatória (mín. 0)</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Receita Total (R$)</mat-label>
          <input matInput type="number" formControlName="receitaTotal" placeholder="0.00" min="0" step="0.01"/>
          <span matPrefix>R$</span>
          <mat-icon matPrefix>attach_money</mat-icon>
          @if (harvestForm.get('receitaTotal')?.invalid && harvestForm.get('receitaTotal')?.touched) {
            <mat-error>Receita total é obrigatória (mín. 0)</mat-error>
          }
        </mat-form-field>

        <div class="form-actions">
          <button mat-button type="button" routerLink="/agriculture/planted" [disabled]="isSaving">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="isSaving || harvestForm.invalid">
            @if (!isSaving) { <mat-icon>check</mat-icon> <span>Confirmar Colheita</span> }
            @if (isSaving) { <mat-spinner diameter="20"></mat-spinner> <span>Salvando...</span> }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page-container { max-width: 700px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1B5E20; display: flex; align-items: center; gap: 0.5rem; margin: 0; }
    .page-subtitle { color: #666; font-size: 0.9rem; margin: 0; }
    .error-alert { display: flex; align-items: center; gap: 0.5rem; background: #FFEBEE; color: #D32F2F; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #D32F2F; }
    .form-card { display: flex; flex-direction: column; gap: 1rem; }
    .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; }
    mat-form-field { width: 100%; }
  `]
})
export class HarvestFormComponent implements OnInit {
  harvestForm: FormGroup;
  plantedId: string = '';
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agricultureService: AgricultureService
  ) {
    this.harvestForm = this.fb.group({
      dataColheitaReal: ['', Validators.required],
      produtividadeObtidaSacasHa: ['', [Validators.required, Validators.min(0)]],
      receitaTotal: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.plantedId = this.route.snapshot.paramMap.get('id') || '';
  }

  onSubmit(): void {
    if (this.harvestForm.invalid || !this.plantedId) return;

    this.isSaving = true;
    const data: HarvestRequest = this.harvestForm.value;

    this.agricultureService.harvestCulture(this.plantedId, data).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/agriculture/planted']);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || 'Erro ao registrar colheita.';
      }
    });
  }
}