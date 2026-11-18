import {PetKind} from '../pet-kind';

export interface Pet {
  id?: number;
  name: string;
  kind: string;
  image: string;
  profileText: string;
  popularity?: number;
}
