import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AuthService } from '../../../../core/services/auth.service';
import { RegisterUserRequest } from '../../../../core/models/user.model';

/**
 * Validador customizado: verifica se as senhas conferem
 */
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  }

  return null;
}

/**
 * Validador customizado: senha forte
 * Pelo menos 1 maiúscula, 1 minúscula, 1 número, 1 especial
 */
function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

  const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

  if (!valid) {
    return { weakPassword: true };
  }

  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
        strongPasswordValidator
      ]],
      confirmPassword: ['', [Validators.required]],
      role: ['PRD', [Validators.required]]
    }, {
      validators: passwordMatchValidator
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData: RegisterUserRequest = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        // Redireciona para login com mensagem de sucesso
        this.router.navigate(['/auth/login'], {
          queryParams: { registered: 'true' }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Erro ao criar conta. Tente novamente.';
      }
    });
  }

  private markAllAsTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  get emailControl() { return this.registerForm.get('email'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get confirmPasswordControl() { return this.registerForm.get('confirmPassword'); }
  get roleControl() { return this.registerForm.get('role'); }

  getEmailErrorMessage(): string {
    if (this.emailControl?.hasError('required')) return 'Email é obrigatório';
    if (this.emailControl?.hasError('email')) return 'Email inválido';
    return '';
  }

  getPasswordErrorMessage(): string {
    if (this.passwordControl?.hasError('required')) return 'Senha é obrigatória';
    if (this.passwordControl?.hasError('minlength')) return 'Mínimo 8 caracteres';
    if (this.passwordControl?.hasError('maxlength')) return 'Máximo 100 caracteres';
    if (this.passwordControl?.hasError('weakPassword')) {
      return 'A senha deve ter: 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    if (this.confirmPasswordControl?.hasError('required')) return 'Confirmação é obrigatória';
    if (this.confirmPasswordControl?.hasError('passwordMismatch')) return 'As senhas não conferem';
    return '';
  }
}