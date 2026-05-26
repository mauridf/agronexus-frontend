import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseApiService {
  constructor(http: HttpClient) {
    super(http);
  }

  /** Listar todos os usuários (apenas Admin) */
  getUsers(): Observable<User[]> {
    return this.get<User[]>('/users');
  }

  /** Obter usuário por ID */
  getUserById(id: string): Observable<User> {
    return this.get<User>(`/users/${id}`);
  }

  /** Desativar usuário */
  deleteUser(id: string): Observable<void> {
    return this.delete<void>(`/users/${id}`);
  }
}