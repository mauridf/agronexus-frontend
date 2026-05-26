import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { ProducerService } from '../../../../core/services/producer.service';
import { Producer, ProducerRequest } from '../../../../core/models/producer.model';
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
  /** Formulário do produtor */
  producerForm: FormGroup;

  /** Indica se está editando (true) ou criando (false) */
  isEditing = false;
  producerId: string | null = null;

  /** Estados */
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  /** Título da página */
  pageTitle = 'Novo Produtor';

  constructor(
    private fb: FormBuilder,
    private producerService: ProducerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.producerForm = this.fb.group({
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
  }

  ngOnInit(): void {
    // Verifica se tem ID na rota (modo edição)
    this.producerId = this.route.snapshot.paramMap.get('id');
    
    if (this.producerId) {
      this.isEditing = true;
      this.pageTitle = 'Editar Produtor';
      this.loadProducer(this.producerId);
    }
  }

  /**
   * Carrega dados do produtor para edição
   */
  loadProducer(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.producerService.getProducerById(id).subscribe({
      next: (producer) => {
        this.populateForm(producer);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar produtor.';
        this.isLoading = false;
        console.error('Erro:', error);
      }
    });
  }

  /**
   * Preenche o formulário com dados do produtor
   */
  populateForm(producer: Producer): void {
    this.producerForm.patchValue({
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
  }

  /**
   * Submete o formulário (criar ou atualizar)
   */
  onSubmit(): void {
    if (this.producerForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const producerData: ProducerRequest = this.producerForm.value;

    // Remove máscara do CPF/CNPJ antes de enviar
    producerData.cpfCnpj = producerData.cpfCnpj.replace(/\D/g, '');

    if (this.isEditing && this.producerId) {
      this.updateProducer(this.producerId, producerData);
    } else {
      this.createProducer(producerData);
    }
  }

  /**
   * Cria um novo produtor
   */
  private createProducer(data: ProducerRequest): void {
    this.producerService.createProducer(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/producers']);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || 'Erro ao criar produtor.';
        console.error('Erro:', error);
      }
    });
  }

  /**
   * Atualiza um produtor existente
   */
  private updateProducer(id: string, data: ProducerRequest): void {
    this.producerService.updateProducer(id, data).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/producers']);
      },
      error: (error) => {
        this.isSaving = false;
        this.errorMessage = error.message || 'Erro ao atualizar produtor.';
        console.error('Erro:', error);
      }
    });
  }

  /**
   * Validador customizado de CPF/CNPJ
   */
  private cpfCnpjValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value?.replace(/\D/g, '') || '';
    
    if (!value) {
      return { required: true };
    }

    // CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (value.length !== 11 && value.length !== 14) {
      return { invalidCpfCnpj: true };
    }

    return null;
  }

  /**
   * Marca todos campos como tocados
   */
  private markAllAsTouched(): void {
    Object.keys(this.producerForm.controls).forEach(key => {
      this.producerForm.get(key)?.markAsTouched();
    });
  }

  /** Getters para validação */
  get nameControl() { return this.producerForm.get('name'); }
  get cpfCnpjControl() { return this.producerForm.get('cpfCnpj'); }
  get estadoControl() { return this.producerForm.get('estado'); }

  getErrorMessage(controlName: string): string {
    const control = this.producerForm.get(controlName);
    if (!control?.errors) return '';

    if (control.errors['required']) return 'Campo obrigatório';
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors['invalidCpfCnpj']) return 'CPF (11 dígitos) ou CNPJ (14 dígitos)';
    
    return 'Campo inválido';
  }

  /**
   * Máscara dinâmica: CPF ou CNPJ
   */
  get cpfCnpjMask(): string {
    const value = this.cpfCnpjControl?.value?.replace(/\D/g, '') || '';
    if (value.length <= 11) {
      return '000.000.000-00';
    }
    return '00.000.000/0000-00';
  }
}