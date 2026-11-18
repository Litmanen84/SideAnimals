import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PetProfile } from './pet-profile';
import {Pet} from '../model/pet';

describe('PetProfile', () => {
  let component: PetProfile;
  let fixture: ComponentFixture<PetProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetProfile],
    }).compileComponents();

    const pet: Pet =
      {
        name: 'Princess',
        kind: 'chicken',
        image: 'images/chicken1.jpg',
        profileText: 'test',
        popularity: 0,
      };

    fixture = TestBed.createComponent(PetProfile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pet', pet)
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the pet name and profile text', () => {
    fixture.detectChanges();

    const profile = fixture.nativeElement as HTMLElement;
    expect(profile.textContent).toContain('Princess');
    expect(profile.textContent).toContain('test');
  });
});
