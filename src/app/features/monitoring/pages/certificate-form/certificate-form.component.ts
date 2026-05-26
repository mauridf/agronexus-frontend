import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { MonitoringService } from '../../../../core/services/monitoring.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-certificate-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header"><button mat-icon-button routerLink="/monitoring/certificates"><mat-icon>arrow_back</mat-icon></button><div><h1 class="page-title"><mat-icon>add_circle</mat-icon> Novo Certificado</h1></div></div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card form-card">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Fazenda</mat-label><mat-select formControlName="farmId">@for (f of farms; track f.id) { <mat-option [value]="f.id">{{ f.name }}</mat-option> }</mat-select></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Tipo</mat-label><input matInput formControlName="tipo" placeholder="Ex: Orgânico, FairTrade" maxlength="100"/></mat-form-field>
        <div class="form-grid">
          <mat-form-field appearance="outline"><mat-label>Data Emissão</mat-label><input matInput type="date" formControlName="dataEmissao"/></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Data Validade</mat-label><input matInput type="date" formControlName="dataValidade"/></mat-form-field>
        </div>
        <div class="form-actions"><button mat-button type="button" routerLink="/monitoring/certificates">Cancelar</button><button mat-raised-button color="primary" type="submit" [disabled]="isSaving || form.invalid">@if (!isSaving) { <mat-icon>save</mat-icon> <span>Cadastrar</span> }</button></div>
      </form>
    </div>
  `,
  styles: [`.page-container { max-width: 700px; margin: 0 auto; } .page-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; } .page-title { font-size: 1.5rem; font-weight: 700; color: #1B5E20; margin: 0; } .form-card { display: flex; flex-direction: column; gap: 1rem; } .full-width { width: 100%; } .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; } .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 1rem; }`]
})
export class CertificateFormComponent implements OnInit {
  form: FormGroup; farms: Farm[] = []; isSaving = false;
  constructor(private fb: FormBuilder, private monitoring: MonitoringService, private farmService: FarmService, private producerService: ProducerService, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({ farmId: ['', Validators.required], tipo: ['', [Validators.required, Validators.maxLength(100)]], dataEmissao: ['', Validators.required], dataValidade: ['', Validators.required] });
  }
  ngOnInit(): void { const user = this.authService.getCurrentUser(); if (!user) return; const load = (p: any[]) => { const all: Farm[] = []; let c = 0; p.forEach(pp => this.farmService.getFarmsByProducer(pp.id).subscribe({ next: (f) => { all.push(...f); c++; if (c === p.length) this.farms = all; }, error: () => { c++; } })); }; if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load }); else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) }); }
  onSubmit(): void { if (this.form.invalid) return; this.isSaving = true; this.monitoring.createCertificate(this.form.value).subscribe({ next: () => { this.isSaving = false; this.router.navigate(['/monitoring/certificates']); }, error: () => this.isSaving = false }); }
}