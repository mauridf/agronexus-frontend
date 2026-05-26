import { Routes } from '@angular/router';

export const OPERATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/operations-home/operations-home.component').then(m => m.OperationsHomeComponent)
  },
  {
    path: 'contracts',
    loadComponent: () => import('./pages/contract-list/contract-list.component').then(m => m.ContractListComponent)
  },
  {
    path: 'contracts/new',
    loadComponent: () => import('./pages/contract-form/contract-form.component').then(m => m.ContractFormComponent)
  },
  {
    path: 'costs',
    loadComponent: () => import('./pages/cost-list/cost-list.component').then(m => m.CostListComponent)
  },
  {
    path: 'costs/new',
    loadComponent: () => import('./pages/cost-form/cost-form.component').then(m => m.CostFormComponent)
  },
  {
    path: 'machines',
    loadComponent: () => import('./pages/machine-list/machine-list.component').then(m => m.MachineListComponent)
  },
  {
    path: 'machines/new',
    loadComponent: () => import('./pages/machine-form/machine-form.component').then(m => m.MachineFormComponent)
  },
  {
    path: 'employees',
    loadComponent: () => import('./pages/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
  },
  {
    path: 'employees/new',
    loadComponent: () => import('./pages/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
  }
];