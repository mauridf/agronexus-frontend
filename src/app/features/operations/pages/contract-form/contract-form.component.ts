import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { OperationsService } from '../../../../core/services/operations.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ContractRequest } from '../../../../core/models/operations.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit {
  form: FormGroup;
  farms: Farm[] = [];
  isSaving = false;
  errorMessage = '';
  tipos = ['Arrendamento', 'Parceria', 'Financiamento', 'Comodato', 'CompraVenda'];

  constructor(
    private fb: FormBuilder, private ops: OperationsService,
    private farmService: FarmService, private producerService: ProducerService,
    private authService: AuthService, private router: Router
  ) {
    this.form = this.fb.group({
      farmId: ['', Validators.required],
      tipo: ['', Validators.required],
      parteContratante: [''],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataInicio: ['', Validators.required],
      dataFim: ['']
    });
  }

  ngOnInit(): void { this.loadFarms(); }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const load = (producers: any[]) => {
      const all: Farm[] = [];
      let c = 0;
      producers.forEach(p => this.farmService.getFarmsByProducer(p.id).subscribe({ next: (f) => { all.push(...f); c++; if (c === producers.length) this.farms = all; }, error: () => { c++; } }));
    };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }

  onSubmit(): void {
    if (this.form.invalid) { Object.keys(this.form.controls).forEach(k => this.form.get(k)?.markAsTouched()); return; }
    this.isSaving = true;
    this.ops.createContract(this.form.value as ContractRequest).subscribe({
      next: () => { this.isSaving = false; this.router.navigate(['/operations/contracts']); },
      error: (e) => { this.isSaving = false; this.errorMessage = e.message || 'Erro.'; }
    });
  }
}