import {Component, inject, output, signal, WritableSignal} from '@angular/core';
import {Pet} from '../model/pet';
import {form, FormField, FormRoot, required, submit} from '@angular/forms/signals';
import {FormsModule} from '@angular/forms';
import {PetService} from '../service/pet.service';
import {firstValueFrom} from 'rxjs';

@Component({
  imports: [
    FormRoot,
    FormField,
    FormsModule
  ],
  selector: 'app-add-pet',
  styleUrl: './add-pet.css',
  templateUrl: './add-pet.html',
})
export class AddPet {
  protected emptyPet : Pet = {
    name: '',
    kind: '',
    image: '',
    profileText: ''
  }

  //Usiamo una copia di emptyPet per evitare di mutare l'originale
  protected readonly newPet : WritableSignal<Pet> = signal<Pet>({...this.emptyPet});
  private readonly petService = inject(PetService);
  petAdded = output<Pet>();
  protected readonly petForm = form(
    this.newPet,
    (Pet) => {
      required(Pet.name, { message: 'Name is required'});
      required(Pet.kind, { message: 'Kind is required'});
      required(Pet.image, { message: 'Image is required'});
      required(Pet.profileText, { message: 'Profile text is required'});
    },
    {
      submission: {
        action: async (field) => {
          const result = await firstValueFrom(this.petService.addPet(this.newPet()));
          this.newPet.set(this.emptyPet);
          this.petAdded.emit(result);
          return undefined;
        },
        ignoreValidators: 'none',
        onInvalid: (field) => {
          field().errorSummary()[0]?.fieldTree().focusBoundControl();
        }
      }
    }
    );
}
