import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { FarmService } from '../../../../core/services/farm.service';
import { Farm, FarmRequest } from '../../../../core/models/farm.model';

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

  constructor(
    private fb: FormBuilder,
    private farmService: FarmService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.farmForm = this.fb.group({
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
    this.farmId = this.route.snapshot.paramMap.get('id');
    if (this.farmId) {
      this.isEditing = true;
      this.pageTitle = 'Editar Fazenda';
      this.loadFarm(this.farmId);
    }
  }

  /**
   * Validador customizado: soma das áreas não pode exceder área total
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

  /**
   * Carrega dados da fazenda para edição
   */
  loadFarm(id: string): void {
    this.isLoading = true;
    this.farmService.getFarmById(id).subscribe({
      next: (farm) => {
        this.farmForm.patchValue(farm);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar fazenda.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Submete o formulário
   */
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
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/farms']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Erro ao atualizar.';
        }
      });
    } else {
      this.farmService.createFarm(farmData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/farms']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Erro ao criar.';
        }
      });
    }
  }

  /**
   * Verifica se a soma das áreas excede o total
   */
  get isAreaExceeded(): boolean {
    return this.farmForm.hasError('areaExceeded');
  }

  /**
   * Obtém a soma das áreas
   */
  get usedArea(): number {
    const agricultural = this.farmForm.get('agriculturalAreaHa')?.value || 0;
    const vegetation = this.farmForm.get('vegetationAreaHa')?.value || 0;
    const built = this.farmForm.get('builtAreaHa')?.value || 0;
    return agricultural + vegetation + built;
  }

  /**
   * Obtém a área disponível
   */
  get availableArea(): number {
    const total = this.farmForm.get('totalAreaHa')?.value || 0;
    return total - this.usedArea;
  }

  getErrorMessage(controlName: string): string {
    const control = this.farmForm.get(controlName);
    if (!control?.errors) return '';
    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['min']) return 'Valor mínimo: ' + control.errors['min'].min;
    if (control.errors['max']) return 'Valor máximo: ' + control.errors['max'].max;
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    return 'Campo inválido';
  }

  // Getters
  get nameControl() { return this.farmForm.get('name'); }
  get totalAreaControl() { return this.farmForm.get('totalAreaHa'); }
  get agriculturalControl() { return this.farmForm.get('agriculturalAreaHa'); }
  get vegetationControl() { return this.farmForm.get('vegetationAreaHa'); }
  get builtControl() { return this.farmForm.get('builtAreaHa'); }
}