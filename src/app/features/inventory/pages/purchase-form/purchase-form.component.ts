import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { InventoryService } from '../../../../core/services/inventory.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Input, PurchaseRequest } from '../../../../core/models/inventory.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss']
})
export class PurchaseFormComponent implements OnInit {
  purchaseForm: FormGroup;
  inputs: Input[] = [];
  farms: Farm[] = [];
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.purchaseForm = this.fb.group({
      farmId: ['', Validators.required],
      inputId: ['', Validators.required],
      quantidade: ['', [Validators.required, Validators.min(0.01)]],
      valorTotal: ['', [Validators.required, Validators.min(0.01)]],
      dataCompra: ['', Validators.required],
      fornecedor: ['']
    });
  }

  ngOnInit(): void {
    this.loadInputs();
    this.loadFarms();
  }

  loadInputs(): void {
    this.inventoryService.getInputs().subscribe({
      next: (data) => { this.inputs = data; }
    });
  }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const loadProducerFarms = (producers: any[]) => {
      const allFarms: Farm[] = [];
      if (producers.length === 0) { this.farms = []; return; }
      let completed = 0;
      producers.forEach(p => {
        this.farmService.getFarmsByProducer(p.id).subscribe({
          next: (farms) => { allFarms.push(...farms); completed++; if (completed === producers.length) this.farms = allFarms; },
          error: () => { completed++; }
        });
      });
    };

    if (this.authService.isAdmin()) {
      this.producerService.getProducers(1, 1000).subscribe({ next: loadProducerFarms });
    } else {
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => loadProducerFarms(producers.filter(p => p.userId === user.id))
      });
    }
  }

  onSubmit(): void {
    if (this.purchaseForm.invalid) {
      Object.keys(this.purchaseForm.controls).forEach(k => this.purchaseForm.get(k)?.markAsTouched());
      return;
    }
    this.isSaving = true;
    const data: PurchaseRequest = this.purchaseForm.value;
    this.inventoryService.createPurchase(data).subscribe({
      next: () => { this.isSaving = false; this.router.navigate(['/inventory/stock']); },
      error: (error) => { this.isSaving = false; this.errorMessage = error.message || 'Erro ao registrar compra.'; }
    });
  }
}