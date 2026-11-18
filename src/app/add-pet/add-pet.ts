import {Component, inject, output, signal, WritableSignal} from '@angular/core';
import {Pet} from '../model/pet';
import {form, FormField, FormRoot, minLength, required, validate} from '@angular/forms/signals';
import {FormsModule} from '@angular/forms';
import {PetService} from '../service/pet.service';
import {firstValueFrom} from 'rxjs';
import {PetKind} from '../pet-kind';

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
  protected readonly kinds : string[] = Object.values(PetKind);
  petAdded = output<Pet>();

  protected readonly petForm = form(
    this.newPet,
    (path) => {
      required(path.name, { message: 'Name is required'});
      minLength(path.name, 3, {message: 'Name must be at least 3 characters'});
      required(path.kind, { message: 'Kind is required'});
      validate(path.kind, ({ value }) => {
        const v = value();
        if (v && !this.kinds.some(k => k.toLowerCase() === v.toLowerCase())) {
          return { kind: 'invalidKind', message: 'Kind must be one of: ' + this.kinds.join(', ') };
        }
        return null;
      });
      required(path.image, { message: 'Image is required'});
      required(path.profileText, { message: 'Profile text is required'});
      minLength(path.profileText, 5, {message: 'Profile text must be at least 5 characters'});
    },
    {
      submission: {
        action: async (field) => {
          const result = await firstValueFrom(this.petService.addPet(this.newPet()));
          this.newPet.set(this.emptyPet);
          this.petAdded.emit(result);
          field().reset();
          return undefined;
        },
        ignoreValidators: 'none',
        onInvalid: (field) => {
          console.log('Invalid', field().errorSummary());
          field().errorSummary()[0]?.fieldTree().focusBoundControl();
        }
      }
    }
    );
}
