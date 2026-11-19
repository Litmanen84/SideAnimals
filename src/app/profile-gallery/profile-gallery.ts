import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {PetService} from '../service/pet.service';
import {rxResource} from '@angular/core/rxjs-interop';
import {environment} from '../../environments/environment';
import {Pet} from '../model/pet';
import {PetProfile} from '../pet-profile/pet-profile';
import {FormsModule} from '@angular/forms';
import {AddPet} from '../add-pet/add-pet';

@Component({
  imports: [PetProfile, FormsModule, AddPet],
  selector: 'app-profile-gallery',
  styleUrl: './profile-gallery.css',
  templateUrl: './profile-gallery.html',
})
export class ProfileGallery {
  private readonly petService = inject(PetService);
  protected readonly backendUrl = `${environment.backendUrl}`;
  searchText : WritableSignal<string> = signal<string>('')

  protected readonly pets = rxResource({
    stream: () => this.petService.getPets(),
    defaultValue: [],
  });

  readonly filteredPets: Signal<Pet[]> = computed(() => {
    const search = this.searchText().trim().toLowerCase();
    return this.pets.value().filter(pet =>
      pet.name.toLowerCase().includes(search)
    );
  })

  protected selectedPet = signal<Pet | undefined>(undefined);

  protected selectPet(pet: Pet) {
    this.selectedPet.update(current =>
      current?.id === pet.id ? undefined : pet
    );
  }

  protected showNewPet(pet : Pet) {
    this.pets.reload();
    this.selectedPet.set(pet);
  }
}
