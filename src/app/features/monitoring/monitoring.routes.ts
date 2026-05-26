import { Routes } from '@angular/router';

export const MONITORING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/monitoring-home/monitoring-home.component').then(m => m.MonitoringHomeComponent)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./pages/alert-list/alert-list.component').then(m => m.AlertListComponent)
  },
  {
    path: 'alerts/new',
    loadComponent: () => import('./pages/alert-form/alert-form.component').then(m => m.AlertFormComponent)
  },
  {
    path: 'certificates',
    loadComponent: () => import('./pages/certificate-list/certificate-list.component').then(m => m.CertificateListComponent)
  },
  {
    path: 'certificates/new',
    loadComponent: () => import('./pages/certificate-form/certificate-form.component').then(m => m.CertificateFormComponent)
  },
  {
    path: 'climate',
    loadComponent: () => import('./pages/climate-list/climate-list.component').then(m => m.ClimateListComponent)
  },
  {
    path: 'climate/new',
    loadComponent: () => import('./pages/climate-form/climate-form.component').then(m => m.ClimateFormComponent)
  }
];