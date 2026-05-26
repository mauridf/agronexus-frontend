import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { FarmService } from '../../../../core/services/farm.service';
import { ProducerService } from '../../../../core/services/producer.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Farm, FarmRequest } from '../../../../core/models/farm.model';
import { Producer } from '../../../../core/models/producer.model';

@Component({
  selector: 'app-farm-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './farm-form.component.html',
  styleUrls: ['./farm-form.component.scss']
})
export class FarmFormComponent implements OnInit {
  farmForm: FormGroup;
  isEditing = false;
  farmId: string | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  pageTitle = 'Nova Fazenda';

  /** Indica se é Admin */
  isAdmin = false;

  /** Lista de produtores disponíveis */
  availableProducers: Producer[] = [];

  constructor(
    private fb: FormBuilder,
    private farmService: FarmService,
    private producerService: ProducerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isAdmin = this.authService.isAdmin();

    this.farmForm = this.fb.group({
      producerId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      totalAreaHa: ['', [Validators.required, Validators.min(0.01), Validators.max(1000000)]],
      agriculturalAreaHa: ['', [Validators.required, Validators.min(0)]],
      vegetationAreaHa: ['', [Validators.required, Validators.min(0)]],
      builtAreaHa: ['', [Validators.required, Validators.min(0)]],
      cidade: [''],
      estado: ['', Validators.maxLength(2)],
      latitude: ['', [Validators.min(-90), Validators.max(90)]],
      longitude: ['', [Validators.min(-180), Validators.max(180)]],
      endereco: [''],
      inscricaoEstadual: [''],
      codigoCar: [''],
      ccir: [''],
      fonteAgua: ['']
    }, { validators: this.areaValidator });
  }

  ngOnInit(): void {
    // Carrega produtores disponíveis
    this.loadAvailableProducers();

    // Verifica se está editando
    this.farmId = this.route.snapshot.paramMap.get('id');
    if (this.farmId) {
      this.isEditing = true;
      this.pageTitle = 'Editar Fazenda';
      this.loadFarm(this.farmId);
    }
  }

  /**
   * Carrega produtores disponíveis baseado no perfil do usuário
   */
  private loadAvailableProducers(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (this.isAdmin) {
      // Admin: carrega TODOS os produtores
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => {
          this.availableProducers = producers;
        },
        error: (error) => {
          console.error('Erro ao carregar produtores:', error);
        }
      });
    } else {
      // PRD: carrega apenas produtores vinculados ao seu userId
      this.producerService.getProducers(1, 1000).subscribe({
        next: (producers) => {
          // Filtra produtores do usuário logado
          this.availableProducers = producers.filter(p => p.userId === user.id);
        },
        error: (error) => {
          console.error('Erro ao carregar produtores:', error);
        }
      });
    }
  }

  /**
   * Validador de áreas
   */
  private areaValidator(group: FormGroup): { [key: string]: boolean } | null {
    const total = group.get('totalAreaHa')?.value;
    const agricultural = group.get('agriculturalAreaHa')?.value || 0;
    const vegetation = group.get('vegetationAreaHa')?.value || 0;
    const built = group.get('builtAreaHa')?.value || 0;

    if (total && (agricultural + vegetation + built) > total) {
      return { areaExceeded: true };
    }
    return null;
  }

  loadFarm(id: string): void {
    this.isLoading = true;
    this.farmService.getFarmById(id).subscribe({
      next: (farm) => {
        this.farmForm.patchValue({
          producerId: farm.producerId,
          name: farm.name,
          totalAreaHa: farm.totalAreaHa,
          agriculturalAreaHa: farm.agriculturalAreaHa,
          vegetationAreaHa: farm.vegetationAreaHa,
          builtAreaHa: farm.builtAreaHa,
          cidade: farm.cidade || '',
          estado: farm.estado || '',
          latitude: farm.latitude || '',
          longitude: farm.longitude || '',
          endereco: farm.endereco || '',
          inscricaoEstadual: farm.inscricaoEstadual || '',
          codigoCar: farm.codigoCar || '',
          ccir: farm.ccir || '',
          fonteAgua: farm.fonteAgua || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar fazenda.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.farmForm.invalid) {
      Object.keys(this.farmForm.controls).forEach(key => {
        this.farmForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSaving = true;
    const farmData: FarmRequest = this.farmForm.value;

    if (this.isEditing && this.farmId) {
      this.farmService.updateFarm(this.farmId, farmData).subscribe({
        next: () => { this.isSaving = false; this.router.navigate(['/farms']); },
        error: (error) => { this.isSaving = false; this.errorMessage = error.message || 'Erro ao atualizar.'; }
      });
    } else {
      this.farmService.createFarm(farmData).subscribe({
        next: () => { this.isSaving = false; this.router.navigate(['/farms']); },
        error: (error) => { this.isSaving = false; this.errorMessage = error.message || 'Erro ao criar.'; }
      });
    }
  }

  get isAreaExceeded(): boolean { return this.farmForm.hasError('areaExceeded'); }

  get usedArea(): number {
    return (this.farmForm.get('agriculturalAreaHa')?.value || 0) +
           (this.farmForm.get('vegetationAreaHa')?.value || 0) +
           (this.farmForm.get('builtAreaHa')?.value || 0);
  }

  get availableArea(): number {
    return (this.farmForm.get('totalAreaHa')?.value || 0) - this.usedArea;
  }

  getErrorMessage(controlName: string): string {
    const control = this.farmForm.get(controlName);
    if (!control?.errors) return '';
    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['min']) return 'Valor mínimo: ' + control.errors['min'].min;
    if (control.errors['max']) return 'Valor máximo: ' + control.errors['max'].max;
    return 'Campo inválido';
  }

  get nameControl() { return this.farmForm.get('name'); }
  get producerIdControl() { return this.farmForm.get('producerId'); }
  get totalAreaControl() { return this.farmForm.get('totalAreaHa'); }
}