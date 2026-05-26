import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AgricultureService } from '../../../../core/services/agriculture.service';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Culture, PlantCultureRequest } from '../../../../core/models/agriculture.model';
import { Farm } from '../../../../core/models/farm.model';

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.scss']
})
export class PlantFormComponent implements OnInit {
  plantForm: FormGroup;
  cultures: Culture[] = [];
  farms: Farm[] = [];
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private agricultureService: AgricultureService,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService,
    private router: Router
  ) {
    this.plantForm = this.fb.group({
      farmId: ['', Validators.required],
      cultureId: ['', Validators.required],
      safra: ['', [Validators.required, Validators.maxLength(50)]],
      areaPlantadaHa: ['', [Validators.required, Validators.min(0.01)]],
      dataPlantio: [''],
      dataColheitaPrevista: [''],
      produtividadeEsperadaSacasHa: [''],
      custoTotal: ['']
    });
  }

  ngOnInit(): void {
    this.loadCultures();
    this.loadFarms();
  }

  loadCultures(): void {
    this.agricultureService.getCultures().subscribe({
      next: (data) => { this.cultures = data; },
      error: (error) => { console.error('Erro ao carregar culturas:', error); }
    });
  }

  loadFarms(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.authService.isAdmin()) {
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => {
          const allFarms: Farm[] = [];
          let completed = 0;
          producers.forEach(p => {
            this.farmService.getFarmsByProducer(p.id).subscribe({
              next: (farms) => { allFarms.push(...farms); completed++; if (completed === producers.length) this.farms = allFarms; },
              error: () => { completed++; }
            });
          });
        }
      });
    } else {
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => {
          const userProducers = producers.filter(p => p.userId === user.id);
          const allFarms: Farm[] = [];
          let completed = 0;
          userProducers.forEach(p => {
            this.farmService.getFarmsByProducer(p.id).subscribe({
              next: (farms) => { allFarms.push(...farms); completed++; if (completed === userProducers.length) this.farms = allFarms; },
              error: () => { completed++; }
            });
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.plantForm.invalid) {
      Object.keys(this.plantForm.controls).forEach(k => this.plantForm.get(k)?.markAsTouched());
      return;
    }

    this.isSaving = true;
    const data: PlantCultureRequest = this.plantForm.value;

    this.agricultureService.plantCulture(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/agriculture/planted']);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || 'Erro ao registrar plantio.';
      }
    });
  }
}