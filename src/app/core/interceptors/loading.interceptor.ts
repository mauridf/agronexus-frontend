import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * Interceptor que gerencia o estado de loading global
 * Mostra/esconde um spinner durante requisições HTTP
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  /** Contador de requisições ativas */
  private activeRequests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Incrementa contador e mostra loading
    if (this.activeRequests === 0) {
      this.loadingService.show();
    }
    this.activeRequests++;

    return next.handle(request).pipe(
      finalize(() => {
        // Decrementa contador e esconde loading quando todas requisições terminarem
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.loadingService.hide();
        }
      })
    );
  }
}