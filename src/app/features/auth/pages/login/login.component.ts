import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  /** Formulário de login */
  loginForm: FormGroup;

  /** Indica se está enviando o formulário */
  isLoading = false;

  /** Mensagem de erro para exibir ao usuário */
  errorMessage = '';

  /** Controla visibilidade da senha */
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializa o formulário com validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  /**
   * Submete o formulário de login
   */
  onSubmit(): void {
    // Verifica se o formulário é válido
    if (this.loginForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        // Login bem-sucedido
        this.isLoading = false;
        
        // Redireciona baseado no papel do usuário
        if (response.user.role === 'ADM') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        // Erro no login
        this.isLoading = false;
        this.errorMessage = error.message || 'Email ou senha inválidos. Tente novamente.';
        console.error('Erro no login:', error);
      }
    });
  }

  /**
   * Marca todos os campos como "tocados" para mostrar erros
   */
  private markAllAsTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Helpers para validação no template
   */
  get emailControl() { return this.loginForm.get('email'); }
  get passwordControl() { return this.loginForm.get('password'); }

  /**
   * Mensagens de erro do email
   */
  getEmailErrorMessage(): string {
    if (this.emailControl?.hasError('required')) {
      return 'Email é obrigatório';
    }
    if (this.emailControl?.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }

  /**
   * Mensagens de erro da senha
   */
  getPasswordErrorMessage(): string {
    if (this.passwordControl?.hasError('required')) {
      return 'Senha é obrigatória';
    }
    if (this.passwordControl?.hasError('minlength')) {
      return 'Senha deve ter no mínimo 8 caracteres';
    }
    return '';
  }
}