import { Routes } from '@angular/router';

export const AGRICULTURE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/agriculture-home/agriculture-home.component').then(m => m.AgricultureHomeComponent)
  },
  {
    path: 'cultures',
    loadComponent: () => import('./pages/culture-list/culture-list.component').then(m => m.CultureListComponent)
  },
  {
    path: 'cultures/new',
    loadComponent: () => import('./pages/culture-form/culture-form.component').then(m => m.CultureFormComponent)
  },
  {
    path: 'planted',
    loadComponent: () => import('./pages/planted-list/planted-list.component').then(m => m.PlantedListComponent)
  },
  {
    path: 'plant',
    loadComponent: () => import('./pages/plant-form/plant-form.component').then(m => m.PlantFormComponent)
  },
  {
    path: 'harvest/:id',
    loadComponent: () => import('./pages/harvest-form/harvest-form.component').then(m => m.HarvestFormComponent)
  }
];