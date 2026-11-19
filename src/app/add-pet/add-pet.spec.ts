import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPet } from './add-pet';
import {PetKind} from '../pet-kind';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

describe('AddPet', () => {
  let component: AddPet;
  let fixture: ComponentFixture<AddPet>;
  let httpTesting: HttpTestingController;
  function fill(placeholder: string, value: string) {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      `input[placeholder="${placeholder}"]`
    );
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPet],
      providers: [provideHttpClientTesting()],
    }).compileComponents();
    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AddPet);
    fixture.detectChanges();
    component = fixture.componentInstance;
    await fixture.whenStable();

  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the error message if required field is missing and then send request if corrected', () => {
    fill('Name', '');
    fill('Kind', 'Dog');
    fill('Image Url', 'images/dog1.jpg');
    fill('Profile Text', 'testo');
    fixture.detectChanges();

    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[placeholder="Name"]'
    );
    nameInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
    fixture.detectChanges();

    const nameGroup = nameInput.closest('.form-group');
    expect(nameGroup?.textContent).toContain('Name is required');
    httpTesting.expectNone('http://localhost:8080/pets');

    fill('Name', 'Coleottero');
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
    fixture.detectChanges();
    httpTesting.expectOne('http://localhost:8080/pets');
  });

  it('should show the error message if kind is not admitted and then send if correct', () => {
    const kinds : string[] = Object.values(PetKind);

    fill('Name', 'Coleottero');
    fill('Kind', 'Fish');
    fill('Image Url', 'images/dog1.jpg');
    fill('Profile Text', 'testo');
    fixture.detectChanges();

    const kindInput: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[placeholder="Kind"]'
    );
    kindInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
    fixture.detectChanges();

    const nameGroup = kindInput.closest('.form-group');
    expect(nameGroup?.textContent).toContain('Kind must be one of: Dog, Cat, Chicken');
    httpTesting.expectNone('http://localhost:8080/pets');

    fill('Kind', 'Dog');
    fixture.detectChanges();
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
    fixture.detectChanges();
    httpTesting.expectOne('http://localhost:8080/pets');
  });

  it('should send a request when the form is valid', async () => {
    fill('Name', 'Coleottero');
    fill('Kind', 'Dog');
    fill('Image Url', 'images/dog1.jpg');
    fill('Profile Text', 'testo');
    fixture.detectChanges();

    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));

    const request = httpTesting.expectOne('http://localhost:8080/pets');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Coleottero',
      kind: 'Dog',
      image: 'images/dog1.jpg',
      profileText: 'testo'
    });
    request.flush(request.request.body);
    await fixture.whenStable();
  });
});
