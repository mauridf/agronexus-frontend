import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { InventoryService } from '../../../../core/services/inventory.service';
import { InputRequest } from '../../../../core/models/inventory.model';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent {
  inputForm: FormGroup;
  isSaving = false;
  errorMessage = '';

  tipos = ['fertilizante', 'semente', 'defensivo', 'combustível', 'corretivo', 'racao', 'medicamento'];
  unidades = ['kg', 'L', 'ton', 'saca', 'unidade'];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private router: Router
  ) {
    this.inputForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      tipo: [''],
      unidadeMedida: [''],
      fornecedor: ['']
    });
  }

  onSubmit(): void {
    if (this.inputForm.invalid) return;
    this.isSaving = true;
    const data: InputRequest = this.inputForm.value;
    this.inventoryService.createInput(data).subscribe({
      next: () => { this.isSaving = false; this.router.navigate(['/inventory/inputs']); },
      error: (error) => { this.isSaving = false; this.errorMessage = error.message || 'Erro ao criar insumo.'; }
    });
  }

  get nameControl() { return this.inputForm.get('name'); }
}