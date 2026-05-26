import { Routes } from '@angular/router';

// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // ==========================================
  // ROTAS PÚBLICAS
  // ==========================================
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // ==========================================
  // ROTAS PROTEGIDAS (exigem login)
  // ==========================================
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      // Produtores
      {
        path: 'producers',
        loadChildren: () => import('./features/producers/producers.routes').then(m => m.PRODUCERS_ROUTES),
        canActivate: [AdminGuard]
      },
      // Fazendas
      {
        path: 'farms',
        loadChildren: () => import('./features/farms/farms.routes').then(m => m.FARMS_ROUTES)
      },
      // Agricultura
      {
        path: 'agriculture',
        loadChildren: () => import('./features/agriculture/agriculture.routes').then(m => m.AGRICULTURE_ROUTES)
      },
      // Inventário
      {
        path: 'inventory',
        loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.INVENTORY_ROUTES)
      },
      // Operações
      {
        path: 'operations',
        loadChildren: () => import('./features/operations/operations.routes').then(m => m.OPERATIONS_ROUTES)
      },
      // Monitoramento
      {
        path: 'monitoring',
        loadChildren: () => import('./features/monitoring/monitoring.routes').then(m => m.MONITORING_ROUTES)
      },
      // Financeiro
      {
        path: 'financial',
        loadChildren: () => import('./features/financial/financial.routes').then(m => m.FINANCIAL_ROUTES)
      },
      // Usuários (Admin)
      {
        path: 'users',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
        canActivate: [AdminGuard]
      },
      // Redirecionamento padrão
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Rota coringa (404)
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];