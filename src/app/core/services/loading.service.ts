import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Serviço que controla o estado de loading global da aplicação
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  /** Subject que emite o estado atual de loading */
  private loadingSubject = new BehaviorSubject<boolean>(false);

  /** Observable público para componentes se inscreverem */
  public loading$ = this.loadingSubject.asObservable();

  constructor() {}

  /**
   * Ativa o loading
   */
  show(): void {
    this.loadingSubject.next(true);
  }

  /**
   * Desativa o loading
   */
  hide(): void {
    this.loadingSubject.next(false);
  }
}