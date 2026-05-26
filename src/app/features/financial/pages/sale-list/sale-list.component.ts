import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { FinancialService } from '../../../../core/services/financial.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ProductionSale } from '../../../../core/models/financial.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss']
})
export class SaleListComponent implements OnInit {
  sales: ProductionSale[] = [];
  farms: Farm[] = [];
  selectedFarmId: string = '';
  isLoading = true;

  constructor(
    private financialService: FinancialService,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void { this.loadFarms(); }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const load = (producers: any[]) => {
      const all: Farm[] = [];
      if (!producers.length) { this.farms = []; this.isLoading = false; return; }
      let c = 0;
      producers.forEach(p => this.farmService.getFarmsByProducer(p.id).subscribe({
        next: (f) => { all.push(...f); c++; if (c === producers.length) { this.farms = all; if (all.length) { this.selectedFarmId = all[0].id; this.loadSales(); } else this.isLoading = false; } },
        error: () => { c++; }
      }));
    };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }

  onFarmChange(): void { if (this.selectedFarmId) this.loadSales(); }

  loadSales(): void {
    this.isLoading = true;
    this.financialService.getSales(this.selectedFarmId).subscribe({
      next: (d) => { this.sales = d; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  /** Calcula o total de vendas */
  getTotalSales(): number {
    return this.sales.reduce((sum, s) => sum + s.valorTotal, 0);
  }
}