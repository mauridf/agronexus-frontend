import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { InventoryService } from '../../../../core/services/inventory.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { InputStock } from '../../../../core/models/inventory.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {
  stock: InputStock[] = [];
  farms: Farm[] = [];
  selectedFarmId: string = '';
  isLoading = true;
  errorMessage = '';

  constructor(
    private inventoryService: InventoryService,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadFarms();
  }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const loadProducerFarms = (producers: any[]) => {
      const allFarms: Farm[] = [];
      if (producers.length === 0) { this.farms = []; this.isLoading = false; return; }
      let completed = 0;
      producers.forEach(p => {
        this.farmService.getFarmsByProducer(p.id).subscribe({
          next: (farms) => { allFarms.push(...farms); completed++; if (completed === producers.length) { this.farms = allFarms; if (allFarms.length > 0) { this.selectedFarmId = allFarms[0].id; this.loadStock(); } else { this.isLoading = false; } } },
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

  onFarmChange(): void {
    if (this.selectedFarmId) this.loadStock();
  }

  loadStock(): void {
    this.isLoading = true;
    this.inventoryService.getStock(this.selectedFarmId).subscribe({
      next: (data) => { this.stock = data; this.isLoading = false; },
      error: () => { this.errorMessage = 'Erro ao carregar estoque.'; this.isLoading = false; }
    });
  }
}