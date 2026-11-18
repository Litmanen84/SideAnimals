import { Service } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { inject } from '@angular/core';
import {environment} from '../../environments/environment';
import {Pet} from '../model/pet';
import {map, Observable} from 'rxjs';

@Service()
export class PetService {
  private readonly http = inject(HttpClient);
  private readonly petsUrl = `${environment.backendUrl}/pets`;

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.petsUrl).pipe(map(pet => pet.sort((a, b) => a.name.localeCompare(b.name))));
  }

  addPet(pet : Pet) : Observable<Pet> {
    return this.http.post<Pet>(this.petsUrl, pet);
  }
}


// to do
// Bonus: add a test to pet.service.spec.ts that checks that addPet() sends a POST with our pet in its body.
// The GET test you already have is a good starting point. request.request.body holds what was sent.
