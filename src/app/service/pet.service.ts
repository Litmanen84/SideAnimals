import { Service } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { inject } from '@angular/core';
import {environment} from '../../environments/environment';
import {Pet} from '../model/pet';
import {Observable} from 'rxjs';

@Service()
export class PetService {
  private readonly http = inject(HttpClient);
  private readonly petsUrl = `${environment.backendUrl}/pets`;

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.petsUrl);
  }
}
