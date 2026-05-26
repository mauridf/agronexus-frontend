import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AgricultureService } from '../../../../core/services/agriculture.service';
import { CultureRequest } from '../../../../core/models/agriculture.model';

@Component({
  selector: 'app-culture-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './culture-form.component.html',
  styleUrls: ['./culture-form.component.scss']
})
export class CultureFormComponent {
  cultureForm: FormGroup;
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private agricultureService: AgricultureService,
    private router: Router
  ) {
    this.cultureForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      ciclo: [''],
      variedade: ['']
    });
  }

  onSubmit(): void {
    if (this.cultureForm.invalid) {
      Object.keys(this.cultureForm.controls).forEach(k => this.cultureForm.get(k)?.markAsTouched());
      return;
    }

    this.isSaving = true;
    const data: CultureRequest = this.cultureForm.value;

    this.agricultureService.createCulture(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/agriculture/cultures']);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || 'Erro ao criar cultura.';
      }
    });
  }

  get nameControl() { return this.cultureForm.get('name'); }
}