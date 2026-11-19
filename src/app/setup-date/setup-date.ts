import {Component, inject, input} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {PetService} from '../service/pet.service';
import {environment} from '../../environments/environment';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  selector: 'app-setup-date',
  styleUrl: './setup-date.css',
  templateUrl: './setup-date.html',
})
export class SetupDate {
  protected readonly name = input.required<string>();
  private readonly petService = inject(PetService);
  protected readonly backendUrl = `${environment.backendUrl}`;
  protected readonly petImage : string = '';

  protected readonly pet = rxResource({
    params: () => this.name(),
    stream: ({ params }) =>
      this.petService.getPet(params)
  })

  // protected imageUrl() {
  //   if (this.pet.hasValue()) {
  //     return this.backendUrl + '/' + this.pet.value().image;
  //   }
  //   return '';
  // }
}
