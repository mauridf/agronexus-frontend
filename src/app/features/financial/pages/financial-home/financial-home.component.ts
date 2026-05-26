import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';

@Component({
  selector: 'app-financial-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1 class="page-title"><mat-icon>attach_money</mat-icon> Financeiro</h1>
        <p class="page-subtitle">Gerencie as vendas de produção</p>
      </div>
      <div class="hub-grid">
        <mat-card class="hub-card" routerLink="/financial/sales">
          <mat-card-content>
            <div class="hub-icon"><mat-icon>point_of_sale</mat-icon></div>
            <h2>Vendas</h2>
            <p>Visualize e registre as vendas de produção das fazendas</p>
          </mat-card-content>
          <mat-card-actions><button mat-button color="primary">ACESSAR</button></mat-card-actions>
        </mat-card>
        <mat-card class="hub-card" routerLink="/financial/sales/new">
          <mat-card-content>
            <div class="hub-icon"><mat-icon>add_shopping_cart</mat-icon></div>
            <h2>Nova Venda</h2>
            <p>Registre uma nova venda de produção colhida</p>
          </mat-card-content>
          <mat-card-actions><button mat-button color="primary">REGISTRAR</button></mat-card-actions>
        </mat-card>
        <mat-card class="hub-card" routerLink="/dashboard">
          <mat-card-content>
            <div class="hub-icon"><mat-icon>bar_chart</mat-icon></div>
            <h2>Dashboard Financeiro</h2>
            <p>Acompanhe receitas, custos e lucros no dashboard</p>
          </mat-card-content>
          <mat-card-actions><button mat-button color="primary">VER DASHBOARD</button></mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1B5E20; display: flex; align-items: center; gap: 0.5rem; margin: 0 0 0.25rem 0; }
    .page-subtitle { color: #666; font-size: 0.9rem; margin: 0; }
    .hub-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .hub-card { cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; border-radius: 12px;
      &:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); } }
    .hub-icon { text-align: center; margin-bottom: 1rem; mat-icon { font-size: 3rem; width: 3rem; height: 3rem; color: #2E7D32; } }
    h2 { font-size: 1.2rem; color: #333; margin: 0 0 0.5rem 0; }
    p { color: #666; font-size: 0.9rem; line-height: 1.5; }
  `]
})
export class FinancialHomeComponent {}