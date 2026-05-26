import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
    <mat-card class="stat-card" [ngClass]="colorClass">
      <div class="stat-content">
        <div class="stat-info">
          <span class="stat-label">{{ label }}</span>
          <!-- Usar número formatado sem especificar locale (usa o global pt-BR) -->
          <span class="stat-value">{{ formattedValue }}{{ suffix }}</span>
          @if (subtitle) {
            <span class="stat-subtitle">{{ subtitle }}</span>
          }
        </div>
        <div class="stat-icon">
          <mat-icon>{{ icon }}</mat-icon>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .stat-card {
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: default;
      height: 100%;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .stat-label {
      font-size: 0.85rem;
      color: #666;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1B5E20;
      margin: 0.25rem 0;
    }

    .stat-subtitle {
      font-size: 0.75rem;
      color: #999;
    }

    .stat-icon {
      background: rgba(46, 125, 50, 0.1);
      border-radius: 12px;
      padding: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5rem;
    }

    .stat-icon mat-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #2E7D32;
    }

    /* Cores */
    .color-green .stat-icon { background: rgba(46, 125, 50, 0.1); }
    .color-green .stat-icon mat-icon { color: #2E7D32; }
    .color-green .stat-value { color: #2E7D32; }

    .color-blue .stat-icon { background: rgba(25, 118, 210, 0.1); }
    .color-blue .stat-icon mat-icon { color: #1976D2; }
    .color-blue .stat-value { color: #1976D2; }

    .color-orange .stat-icon { background: rgba(245, 124, 0, 0.1); }
    .color-orange .stat-icon mat-icon { color: #F57C00; }
    .color-orange .stat-value { color: #F57C00; }

    .color-red .stat-icon { background: rgba(211, 47, 47, 0.1); }
    .color-red .stat-icon mat-icon { color: #D32F2F; }
    .color-red .stat-value { color: #D32F2F; }

    @media (max-width: 600px) {
      .stat-value { font-size: 1.25rem; }
      .stat-icon mat-icon { font-size: 1.5rem; width: 1.5rem; height: 1.5rem; }
    }
  `]
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() suffix: string = '';
  @Input() subtitle: string = '';
  @Input() icon: string = 'info';
  @Input() colorClass: string = 'color-green';

  /**
   * Formata o valor sem usar DecimalPipe (evita erro de locale)
   */
  get formattedValue(): string {
    if (this.value === null || this.value === undefined) {
      return '0';
    }
    
    // Se for número inteiro, não mostra decimais
    if (Number.isInteger(this.value)) {
      return this.value.toLocaleString('pt-BR');
    }
    
    // Se tiver decimais, mostra 2 casas
    return this.value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  }
}