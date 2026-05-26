import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { InventoryService } from '../../../../core/services/inventory.service';
import { Input } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-input-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.scss']
})
export class InputListComponent implements OnInit {
  inputs: Input[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInputs();
  }

  loadInputs(): void {
    this.isLoading = true;
    this.inventoryService.getInputs().subscribe({
      next: (data) => { this.inputs = data; this.isLoading = false; },
      error: () => { this.errorMessage = 'Erro ao carregar insumos.'; this.isLoading = false; }
    });
  }

  getTipoIcon(tipo?: string): string {
    switch (tipo?.toLowerCase()) {
      case 'fertilizante': return 'science';
      case 'semente': return 'grass';
      case 'defensivo': return 'shield';
      case 'combustível': return 'local_gas_station';
      case 'corretivo': return 'construction';
      case 'racao': return 'grain';
      case 'medicamento': return 'medication';
      default: return 'inventory_2';
    }
  }
}