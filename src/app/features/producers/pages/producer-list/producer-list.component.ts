import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { ProducerService } from '../../../../core/services/producer.service';
import { Producer } from '../../../../core/models/producer.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-producer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './producer-list.component.html',
  styleUrls: ['./producer-list.component.scss']
})
export class ProducerListComponent implements OnInit {
  /** Colunas exibidas na tabela */
  displayedColumns: string[] = ['name', 'cpfCnpj', 'cidade', 'estado', 'telefone', 'createdAt', 'actions'];
  
  /** Fonte de dados da tabela */
  dataSource = new MatTableDataSource<Producer>([]);

  /** Estados */
  isLoading = true;
  errorMessage = '';

  constructor(private producerService: ProducerService) {}

  ngOnInit(): void {
    this.loadProducers();
  }

  /**
   * Carrega a lista de produtores
   */
  loadProducers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.producerService.getProducers().subscribe({
      next: (producers) => {
        this.dataSource.data = producers;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar produtores. Tente novamente.';
        this.isLoading = false;
        console.error('Erro:', error);
      }
    });
  }

  /**
   * Aplica filtro na tabela
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Remove um produtor (soft delete)
   */
  deleteProducer(id: string, name: string): void {
    if (confirm(`Tem certeza que deseja desativar o produtor "${name}"?`)) {
      this.producerService.deleteProducer(id).subscribe({
        next: () => {
          // Remove da lista local
          this.dataSource.data = this.dataSource.data.filter(p => p.id !== id);
        },
        error: (error) => {
          console.error('Erro ao desativar produtor:', error);
          alert('Erro ao desativar produtor. Tente novamente.');
        }
      });
    }
  }

  /**
   * Formata CPF/CNPJ para exibição
   */
  formatCpfCnpj(value: string): string {
    if (!value) return '';
    // Remove caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 11) {
      // CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (numbers.length === 14) {
      // CNPJ: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  }
}