import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { OperationsService } from '../../../../core/services/operations.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Contract } from '../../../../core/models/operations.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  contracts: Contract[] = [];
  farms: Farm[] = [];
  selectedFarmId: string = '';
  isLoading = true;

  constructor(
    private operationsService: OperationsService,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void { this.loadFarms(); }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const load = (producers: any[]) => {
      const allFarms: Farm[] = [];
      if (producers.length === 0) { this.farms = []; this.isLoading = false; return; }
      let c = 0;
      producers.forEach(p => this.farmService.getFarmsByProducer(p.id).subscribe({
        next: (f) => { allFarms.push(...f); c++; if (c === producers.length) { this.farms = allFarms; if (allFarms.length) { this.selectedFarmId = allFarms[0].id; this.loadContracts(); } else this.isLoading = false; } },
        error: () => { c++; }
      }));
    };
    if (this.authService.isAdmin()) this.producerService.getProducers(1, 1000).subscribe({ next: load });
    else this.producerService.getProducers(1, 1000).subscribe({ next: (p) => load(p.filter(pp => pp.userId === user.id)) });
  }

  onFarmChange(): void { if (this.selectedFarmId) this.loadContracts(); }

  loadContracts(): void {
    this.isLoading = true;
    this.operationsService.getContracts(this.selectedFarmId).subscribe({
      next: (d) => { this.contracts = d; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }
}