import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { ProducerService } from '../../../../core/services/producer.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Producer, ProducerRequest } from '../../../../core/models/producer.model';
import { User } from '../../../../core/models/user.model';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-producer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './producer-form.component.html',
  styleUrls: ['./producer-form.component.scss']
})
export class ProducerFormComponent implements OnInit {
  producerForm: FormGroup;
  isEditing = false;
  producerId: string | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  pageTitle = 'Novo Produtor';

  /** Indica se o usuário logado é Admin */
  isAdmin = false;

  /** Lista de usuários PRD disponíveis (apenas para Admin) */
  availableUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private producerService: ProducerService,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isAdmin = this.authService.isAdmin();

    this.producerForm = this.fb.group({
      // userId só aparece no formulário se for Admin
      userId: [''],
      name: ['', [Validators.required, Validators.maxLength(200)]],
      cpfCnpj: ['', [Validators.required, this.cpfCnpjValidator]],
      rg: [''],
      inscricaoEstadual: [''],
      dataNascimento: [''],
      telefone: [''],
      cidade: [''],
      estado: ['', [Validators.maxLength(2)]],
      endereco: [''],
      dadosBancarios: [''],
      car: ['']
    });

    // Se for PRD, userId é obrigatório e preenchido automaticamente
    if (!this.isAdmin) {
      this.producerForm.get('userId')?.setValidators([Validators.required]);
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.producerForm.patchValue({ userId: currentUser.id });
      }
    } else {
      // Admin precisa selecionar um usuário PRD
      this.producerForm.get('userId')?.setValidators([Validators.required]);
    }
  }

  ngOnInit(): void {
    // Carrega lista de usuários PRD se for Admin
    if (this.isAdmin) {
      this.loadAvailableUsers();
    }

    // Verifica se está editando
    this.producerId = this.route.snapshot.paramMap.get('id');
    if (this.producerId) {
      this.isEditing = true;
      this.pageTitle = 'Editar Produtor';
      this.loadProducer(this.producerId);
    }
  }

  /**
   * Carrega usuários PRD disponíveis para associação (apenas Admin)
   */
  private loadAvailableUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Filtra apenas usuários PRD
        this.availableUsers = users.filter(u => u.role === 'PRD');
      },
      error: (error) => {
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }

  /**
   * Carrega dados do produtor para edição
   */
  loadProducer(id: string): void {
    this.isLoading = true;
    this.producerService.getProducerById(id).subscribe({
      next: (producer) => {
        this.producerForm.patchValue({
          userId: producer.userId,
          name: producer.name,
          cpfCnpj: producer.cpfCnpj,
          rg: producer.rg || '',
          inscricaoEstadual: producer.inscricaoEstadual || '',
          dataNascimento: producer.dataNascimento || '',
          telefone: producer.telefone || '',
          cidade: producer.cidade || '',
          estado: producer.estado || '',
          endereco: producer.endereco || '',
          dadosBancarios: producer.dadosBancarios || '',
          car: producer.car || ''
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar produtor.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Submete o formulário
   */
  onSubmit(): void {
    if (this.producerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const producerData: ProducerRequest = this.producerForm.value;
    producerData.cpfCnpj = producerData.cpfCnpj.replace(/\D/g, '');

    if (this.isEditing && this.producerId) {
      this.producerService.updateProducer(this.producerId, producerData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/producers']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Erro ao atualizar produtor.';
        }
      });
    } else {
      this.producerService.createProducer(producerData).subscribe({
        next: () => {
          this.isSaving = false;
          this.router.navigate(['/producers']);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = error.message || 'Erro ao criar produtor.';
        }
      });
    }
  }

  private cpfCnpjValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value?.replace(/\D/g, '') || '';
    if (!value) return { required: true };
    if (value.length !== 11 && value.length !== 14) return { invalidCpfCnpj: true };
    return null;
  }

  private markAllAsTouched(): void {
    Object.keys(this.producerForm.controls).forEach(key => {
      this.producerForm.get(key)?.markAsTouched();
    });
  }

  // Getters
  get nameControl() { return this.producerForm.get('name'); }
  get cpfCnpjControl() { return this.producerForm.get('cpfCnpj'); }
  get userIdControl() { return this.producerForm.get('userId'); }
  get estadoControl() { return this.producerForm.get('estado'); }

  getErrorMessage(controlName: string): string {
    const control = this.producerForm.get(controlName);
    if (!control?.errors) return '';
    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors['invalidCpfCnpj']) return 'CPF (11 dígitos) ou CNPJ (14 dígitos)';
    return 'Campo inválido';
  }

  get cpfCnpjMask(): string {
    const value = this.cpfCnpjControl?.value?.replace(/\D/g, '') || '';
    return value.length <= 11 ? '000.000.000-00' : '00.000.000/0000-00';
  }
}