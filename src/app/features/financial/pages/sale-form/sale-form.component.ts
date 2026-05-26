import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { FinancialService } from '../../../../core/services/financial.service';
import { AgricultureService } from '../../../../core/services/agriculture.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PlantedCulture } from '../../../../core/models/agriculture.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss']
})
export class SaleFormComponent implements OnInit {
  saleForm: FormGroup;
  farms: Farm[] = [];
  plantedCultures: PlantedCulture[] = [];
  selectedFarmId: string = '';
  isSaving = false;
  errorMessage = '';
  calculatedTotal: number = 0;

  constructor(
    private fb: FormBuilder,
    private financialService: FinancialService,
    private agricultureService: AgricultureService,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.saleForm = this.fb.group({
      plantedCultureId: ['', Validators.required],
      quantidadeVendida: ['', [Validators.required, Validators.min(0.01)]],
      precoUnitario: ['', [Validators.required, Validators.min(0.01)]],
      dataVenda: ['', Validators.required],
      destino: ['']
    });

    // Calcular valor total automaticamente
    this.saleForm.valueChanges.subscribe(values => {
      if (values.quantidadeVendida && values.precoUnitario) {
        this.calculatedTotal = values.quantidadeVendida * values.precoUnitario;
      } else {
        this.calculatedTotal = 0;
      }
    });
  }

  ngOnInit(): void { this.loadFarms(); }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const load = (producers: any[]) => {
      const all: Farm[] = [];
      let c = 0;
      producers.forEach(p => this.farmService.getFarmsByProducer(p.id).subscribe({
        next: (f) => { all.push(...f); c++; if (c === producers.length) this.farms = all; },
        error: () => { c++; }
      }));
    };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }

  onFarmChange(farmId: string): void {
    this.selectedFarmId = farmId;
    this.agricultureService.getPlantedCultures(farmId).subscribe({
      next: (cultures) => {
        // Filtra apenas culturas que já foram colhidas (têm dataColheitaReal)
        this.plantedCultures = cultures.filter(c => c.dataColheitaReal);
      },
      error: () => { this.plantedCultures = []; }
    });
  }

  onSubmit(): void {
    if (this.saleForm.invalid) {
      Object.keys(this.saleForm.controls).forEach(k => this.saleForm.get(k)?.markAsTouched());
      return;
    }

    this.isSaving = true;
    this.financialService.createSale(this.saleForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/financial/sales']);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || 'Erro ao registrar venda.';
      }
    });
  }
}