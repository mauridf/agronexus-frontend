import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../../shared/material/material.module';
import { AgricultureService } from '../../../../core/services/agriculture.service';
import { Culture } from '../../../../core/models/agriculture.model';

@Component({
  selector: 'app-culture-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule],
  templateUrl: './culture-list.component.html',
  styleUrls: ['./culture-list.component.scss']
})
export class CultureListComponent implements OnInit {
  cultures: Culture[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private agricultureService: AgricultureService) {}

  ngOnInit(): void {
    this.loadCultures();
  }

  loadCultures(): void {
    this.isLoading = true;
    this.agricultureService.getCultures().subscribe({
      next: (data) => {
        this.cultures = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erro ao carregar culturas.';
        this.isLoading = false;
      }
    });
  }
}